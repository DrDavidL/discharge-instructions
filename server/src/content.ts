import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { REPO_ROOT } from "./env";

export interface RubricCriterion {
  id: number;
  category: string;
  criterion: string;
  maxScore: number;
}

export interface OutlineSectionDef {
  key: string;
  title: string;
  guidance: string;
}

interface ParsedContent {
  rubricRaw: string;
  featuresRaw: string;
  criteria: RubricCriterion[];
  categoryOrder: string[];
  categoryMax: Record<string, number>;
  documentTitle: string;
  outline: OutlineSectionDef[];
}

let cache: ParsedContent | null = null;

// Fallback used only if scoring.md cannot be parsed — keeps the app functional.
const DEFAULT_CRITERIA: RubricCriterion[] = [
  { id: 1, category: "Clinical Completeness", criterion: "Diagnoses & Hospital Course", maxScore: 2 },
  { id: 2, category: "Clinical Completeness", criterion: "Discharge Status & Pending Items", maxScore: 2 },
  { id: 3, category: "Medications & Home Care", criterion: "Medication Safety & Clarity", maxScore: 2 },
  { id: 4, category: "Medications & Home Care", criterion: "Activity, Diet & Self-Care", maxScore: 2 },
  { id: 5, category: "Contingency Planning & Follow-Up", criterion: "Warning Signs & Return Precautions", maxScore: 2 },
  { id: 6, category: "Contingency Planning & Follow-Up", criterion: "Contact Information", maxScore: 2 },
  { id: 7, category: "Contingency Planning & Follow-Up", criterion: "Follow-Up Care", maxScore: 2 },
  { id: 8, category: "Readability, Formatting & Language", criterion: "Reading Level & Plain Language", maxScore: 2 },
  { id: 9, category: "Readability, Formatting & Language", criterion: "Organization & Formatting", maxScore: 2 },
  { id: 10, category: "Communication & Patient Engagement", criterion: "Patient-Centeredness", maxScore: 2 },
  { id: 11, category: "Accuracy & Safety", criterion: "Accuracy & Consistency with the Record", maxScore: 2 },
];

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Parse the server-readable criteria table out of scoring.md. */
function parseCriteria(md: string): RubricCriterion[] {
  const criteria: RubricCriterion[] = [];
  let inTable = false;
  for (const line of md.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").map((c) => c.trim());
      const headerProbe = cells.join("|").toLowerCase();
      if (
        !inTable &&
        headerProbe.includes("id") &&
        headerProbe.includes("category") &&
        headerProbe.includes("criterion") &&
        headerProbe.includes("points")
      ) {
        inTable = true;
        continue;
      }
      if (inTable) {
        if (/^\|?[\s:|-]+$/.test(trimmed)) continue; // separator row
        const inner = cells.slice(1, -1); // drop leading/trailing empties
        if (inner.length >= 4) {
          const id = Number(inner[0]);
          const maxScore = Number(inner[3]);
          if (Number.isFinite(id) && Number.isFinite(maxScore) && inner[1] && inner[2]) {
            criteria.push({ id, category: inner[1], criterion: inner[2], maxScore });
            continue;
          }
        }
        inTable = false; // a non-data row ends the table
      }
    } else if (inTable) {
      inTable = false;
    }
  }
  return criteria;
}

/** Parse the `## Student Outline` block out of features.md. */
function parseOutline(md: string): OutlineSectionDef[] {
  const out: OutlineSectionDef[] = [];
  let inSection = false;
  let current: OutlineSectionDef | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (current) {
      current.guidance = buf.join("\n").trim();
      out.push(current);
    }
    buf = [];
  };

  for (const line of md.split("\n")) {
    if (/^##\s+student outline\b/i.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line)) {
      // next H2 ends the outline block (H3 "### " does not match ^##\s+)
      flush();
      current = null;
      inSection = false;
      continue;
    }
    if (!inSection) continue;
    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      flush();
      const title = h3[1].trim();
      current = { key: slug(title), title, guidance: "" };
      continue;
    }
    if (current) buf.push(line);
  }
  flush();
  return out;
}

export function getContent(): ParsedContent {
  if (cache) return cache;

  const rubricRaw = readFileSync(resolve(REPO_ROOT, "scoring.md"), "utf8");
  const featuresRaw = readFileSync(resolve(REPO_ROOT, "features.md"), "utf8");

  let criteria = parseCriteria(rubricRaw);
  if (criteria.length === 0) {
    console.warn("[content] Could not parse criteria table from scoring.md — using built-in defaults.");
    criteria = DEFAULT_CRITERIA;
  }

  const categoryOrder: string[] = [];
  const categoryMax: Record<string, number> = {};
  for (const c of criteria) {
    if (!(c.category in categoryMax)) {
      categoryOrder.push(c.category);
      categoryMax[c.category] = 0;
    }
    categoryMax[c.category] += c.maxScore;
  }

  let outline = parseOutline(featuresRaw);
  if (outline.length === 0) {
    console.warn("[content] Could not parse '## Student Outline' from features.md — outline will be empty.");
    outline = [];
  }

  cache = {
    rubricRaw,
    featuresRaw,
    criteria,
    categoryOrder,
    categoryMax,
    documentTitle: "Discharge Instructions",
    outline,
  };
  return cache;
}
