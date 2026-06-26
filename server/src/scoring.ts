import { z } from "zod";
import type { Assessment, CategoryScore, CriterionScore, PerformanceBand } from "@dci/shared";
import { env } from "./env";
import { getContent } from "./content";
import { computeReadability, gradeLabel } from "./readability";

const llmSchema = z.object({
  criteria: z
    .array(
      z.object({
        id: z.number(),
        score: z.number(),
        rationale: z.string().default(""),
        improvement: z.string().default(""),
      }),
    )
    .default([]),
  summary: z.string().default(""),
  topPriorities: z.array(z.string()).default([]),
  safetyFlags: z.array(z.string()).default([]),
});

const ascii = (s: string): string => s.replace(/[^\x00-\x7F]/g, "");
const round1 = (n: number): number => Math.round(n * 10) / 10;

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

function buildMessages(
  sourceSummary: string,
  draft: string,
  opts: { exemplar?: string | null; scoringNotes?: string | null; readingGradeNote?: string } = {},
): ChatMessage[] {
  const { criteria, rubricRaw, featuresRaw } = getContent();
  const criteriaList = criteria
    .map((c) => `- id ${c.id} [${c.category}] ${c.criterion} (max ${c.maxScore})`)
    .join("\n");

  const system =
    "You are an expert clinical educator at Northwestern University Feinberg School of Medicine. " +
    "You evaluate patient-facing discharge instructions written by medical students against the rubric provided. " +
    "Be rigorous, specific, fair, and constructive, and always ground your rationale in the student's actual text. " +
    "Students are given a blank page (no section prompts), so part of the assessment is whether they " +
    "included the right sections themselves. " +
    "Output a single JSON object and nothing else.";

  const user = [
    "# Scoring rubric",
    rubricRaw,
    "",
    "# Document specification (what good looks like; section guidance)",
    featuresRaw,
    "",
    "# Criteria to score — score EVERY id below (integer 0..max)",
    criteriaList,
    "",
    "# SOURCE — Discharge summary the student worked from (the clinical record)",
    sourceSummary,
    "",
    ...(opts.exemplar?.trim()
      ? [
          "# REFERENCE — One gold-standard example for this case",
          "This is ONE acceptable answer, not the only one. Many valid variations exist (different",
          "wording, dosing within reason, clinic names/times). Use it to calibrate, not as an answer key.",
          opts.exemplar.trim(),
          "",
        ]
      : []),
    ...(opts.scoringNotes?.trim()
      ? [
          "# FACULTY GRADING NOTES for this case (acceptable variations — apply these)",
          opts.scoringNotes.trim(),
          "",
        ]
      : []),
    ...(opts.readingGradeNote
      ? [
          "# Computed reading level (authoritative — use this for the Reading Level criterion)",
          opts.readingGradeNote,
          "",
        ]
      : []),
    "# STUDENT SUBMISSION — Discharge instructions to evaluate",
    draft.trim() ? draft : "(the student left the draft blank)",
    "",
    "# Output",
    "Return ONLY this JSON shape (no markdown, no commentary). Score every criterion id.",
    "Do not include category aggregates or overall totals — those are computed separately.",
    '{"criteria":[{"id":1,"score":2,"rationale":"...","improvement":"..."}],"summary":"...","topPriorities":["..."],"safetyFlags":["..."]}',
  ].join("\n");

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  if (!env.openRouter.apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured on the server.");
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.openRouter.apiKey}`,
    "Content-Type": "application/json",
  };
  if (env.openRouter.siteUrl) headers["HTTP-Referer"] = ascii(env.openRouter.siteUrl);
  if (env.openRouter.appName) headers["X-Title"] = ascii(env.openRouter.appName);

  let resp: Response;
  try {
    resp = await fetch(`${env.openRouter.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: env.openRouter.model,
        messages,
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });
  } catch (err) {
    const e = err as { name?: string; message?: string; cause?: unknown };
    console.error("[openrouter] fetch failed:", {
      name: e?.name,
      message: e?.message,
      cause: e?.cause ? String(e.cause) : null,
    });
    throw new Error("Could not reach the scoring service. Check OPENROUTER_API_KEY and network.");
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Scoring service returned ${resp.status}: ${text.slice(0, 500)}`);
  }

  const data = (await resp.json()) as { choices?: Array<{ message?: { content?: unknown } }> };
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Scoring service returned an empty response.");
  }
  return content;
}

function extractJson(text: string): unknown {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

export async function scoreSubmission(input: {
  sourceSummary: string;
  draft: string;
  exemplar?: string | null;
  scoringNotes?: string | null;
}): Promise<{ assessment: Assessment; model: string }> {
  const { criteria, categoryOrder, categoryMax } = getContent();
  const readability = computeReadability(input.draft);
  const readingGradeNote = readability
    ? `Flesch–Kincaid grade level: ${readability.fleschKincaidGrade} (${gradeLabel(
        readability.fleschKincaidGrade,
      )}); Flesch reading ease: ${readability.fleschReadingEase}/100. ` +
      "Target for patient instructions is roughly a 6th–7th grade level."
    : undefined;
  const messages = buildMessages(input.sourceSummary, input.draft, {
    exemplar: input.exemplar,
    scoringNotes: input.scoringNotes,
    readingGradeNote,
  });

  let parsed: z.infer<typeof llmSchema>;
  try {
    parsed = llmSchema.parse(extractJson(await callOpenRouter(messages)));
  } catch {
    // One corrective retry — common when a model wraps JSON in prose.
    const retry: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content:
          "Your previous reply was not valid JSON in the required shape. Reply again with ONLY the JSON object, scoring every criterion id.",
      },
    ];
    parsed = llmSchema.parse(extractJson(await callOpenRouter(retry)));
  }

  const byId = new Map(parsed.criteria.map((c) => [c.id, c]));
  const scored: CriterionScore[] = criteria.map((def) => {
    const got = byId.get(def.id);
    const score = got ? Math.max(0, Math.min(def.maxScore, Math.round(got.score))) : 0;
    return {
      id: def.id,
      category: def.category,
      criterion: def.criterion,
      maxScore: def.maxScore,
      score,
      rationale: got?.rationale?.trim() || (got ? "" : "Not assessed by the model; scored 0."),
      improvement: got?.improvement?.trim() || "",
    };
  });

  const categories: CategoryScore[] = categoryOrder.map((cat) => {
    const items = scored.filter((s) => s.category === cat);
    const score = items.reduce((a, s) => a + s.score, 0);
    const max = categoryMax[cat] ?? items.reduce((a, s) => a + s.maxScore, 0);
    return { category: cat, score, maxScore: max, percent: max ? round1((score / max) * 100) : 0 };
  });

  const overallScore = scored.reduce((a, s) => a + s.score, 0);
  const maxScore = criteria.reduce((a, c) => a + c.maxScore, 0);
  const percent = maxScore ? round1((overallScore / maxScore) * 100) : 0;
  const band: PerformanceBand = percent >= 83 ? "Optimal" : percent >= 58 ? "Adequate" : "Inadequate";

  const assessment: Assessment = {
    overallScore,
    maxScore,
    percent,
    band,
    summary: parsed.summary.trim(),
    categories,
    criteria: scored,
    topPriorities: parsed.topPriorities.map((s) => s.trim()).filter(Boolean),
    safetyFlags: parsed.safetyFlags.map((s) => s.trim()).filter(Boolean),
    readability,
  };

  return { assessment, model: env.openRouter.model };
}
