import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { z } from "zod";
import type { LoginResponse, OutlineResponse, ScoreResponse } from "@dci/shared";
import { env, REPO_ROOT } from "./env";
import { issueToken, passwordMatches, requireAuth } from "./auth";
import { getContent } from "./content";
import { CASES, findCase } from "./cases";
import { scoreSubmission } from "./scoring";
import { getStats, initDb, saveSubmission } from "./db";

const app = express();
app.use(express.json({ limit: "2mb" }));

const api = express.Router();

api.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// ---- Auth ----
const loginBody = z.object({ password: z.string() });
api.post("/login", (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Password is required." });
    return;
  }
  if (!passwordMatches(parsed.data.password)) {
    res.status(401).json({ error: "Incorrect password." });
    return;
  }
  const { token, expiresInSeconds } = issueToken();
  const body: LoginResponse = { token, expiresInSeconds };
  res.json(body);
});

// ---- Outline (parsed from features.md) ----
api.get("/outline", requireAuth, (_req, res) => {
  const { documentTitle, outline } = getContent();
  const body: OutlineResponse = {
    noteType: "discharge_instructions",
    documentTitle,
    sections: outline.map((s) => ({ key: s.key, title: s.title, guidance: s.guidance })),
  };
  res.json(body);
});

// ---- Sample cases ----
api.get("/cases", requireAuth, (_req, res) => {
  res.json(CASES);
});

// ---- Score ----
const scoreBody = z.object({
  caseId: z.string().min(1),
  caseTitle: z.string().default(""),
  sourceSummary: z.string().default(""),
  sourceIsUploaded: z.boolean().default(false),
  noteType: z.string().optional(),
  draft: z.string().default(""),
});

api.post("/score", requireAuth, async (req, res) => {
  const parsed = scoreBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid submission." });
    return;
  }
  const input = parsed.data;

  if (!input.draft.trim()) {
    res.status(400).json({ error: "Please write your discharge instructions before submitting." });
    return;
  }

  // Resolve the source: built-in cases are authoritative server-side; uploaded source
  // comes from the client and is never persisted.
  const sample = input.sourceIsUploaded ? undefined : findCase(input.caseId);
  const sourceSummary = sample?.content ?? input.sourceSummary;
  const caseTitle = sample?.title ?? input.caseTitle ?? "Uploaded case";

  if (!sourceSummary.trim()) {
    res.status(400).json({ error: "No source discharge summary was provided." });
    return;
  }

  let result;
  try {
    result = await scoreSubmission({ sourceSummary, draft: input.draft });
  } catch (err) {
    console.error("[score] scoring failed:", err);
    res.status(502).json({ error: (err as Error).message || "Scoring failed. Please try again." });
    return;
  }

  let submissionId: number | null = null;
  let persisted = false;
  try {
    submissionId = await saveSubmission({
      noteType: input.noteType ?? "discharge_instructions",
      caseId: input.caseId,
      caseTitle,
      sourceIsUploaded: input.sourceIsUploaded,
      model: result.model,
      draft: input.draft,
      overallScore: result.assessment.overallScore,
      maxScore: result.assessment.maxScore,
      percent: result.assessment.percent,
      band: result.assessment.band,
      assessment: result.assessment,
      categories: result.assessment.categories,
    });
    persisted = submissionId !== null;
  } catch (err) {
    console.error("[score] persistence failed (returning assessment anyway):", err);
  }

  const body: ScoreResponse = {
    submissionId,
    persisted,
    model: result.model,
    assessment: result.assessment,
  };
  res.json(body);
});

// ---- Stats (independent tab) ----
api.get("/stats", requireAuth, async (req, res) => {
  const noteType = typeof req.query.noteType === "string" ? req.query.noteType : "discharge_instructions";
  try {
    res.json(await getStats(noteType));
  } catch (err) {
    console.error("[stats] query failed:", err);
    res.status(500).json({ error: "Could not load statistics." });
  }
});

app.use("/api", api);

// ---- Static client (production) ----
const distDir = resolve(REPO_ROOT, "client/dist");
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "Not found." });
      return;
    }
    res.sendFile(resolve(distDir, "index.html"));
  });
} else {
  console.warn("[server] client/dist not found — running API only (use the Vite dev server for the UI).");
}

async function start() {
  await initDb();
  app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port}`);
  });
}

void start();
