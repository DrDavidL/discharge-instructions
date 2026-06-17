import pg from "pg";
import type { CategoryScore, StatsResponse } from "@dci/shared";
import { env } from "./env";
import { getContent } from "./content";

const { Pool } = pg;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS submissions (
  id                 SERIAL PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  note_type          TEXT NOT NULL DEFAULT 'discharge_instructions',
  case_id            TEXT NOT NULL,
  case_title         TEXT,
  source_is_uploaded BOOLEAN NOT NULL DEFAULT false,
  model              TEXT NOT NULL,
  draft              TEXT NOT NULL,
  overall_score      NUMERIC(6,2) NOT NULL,
  max_score          NUMERIC(6,2) NOT NULL,
  percent            NUMERIC(6,2) NOT NULL,
  band               TEXT NOT NULL,
  assessment         JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS category_scores (
  id            SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  note_type     TEXT NOT NULL DEFAULT 'discharge_instructions',
  category      TEXT NOT NULL,
  score         NUMERIC(6,2) NOT NULL,
  max_score     NUMERIC(6,2) NOT NULL,
  percent       NUMERIC(6,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_category_scores_category ON category_scores (note_type, category);
`;

function sslConfig(): false | { rejectUnauthorized: boolean } {
  if (env.db.sslOverride === "false") return false;
  if (env.db.sslOverride === "true") return { rejectUnauthorized: false };
  const url = env.db.url;
  if (!url || url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return { rejectUnauthorized: false };
}

let pool: pg.Pool | null = null;
export let dbReady = false;

export async function initDb(): Promise<void> {
  if (!env.db.url) {
    console.warn("[db] DATABASE_URL not set — running without persistence (scoring works; submissions are not saved).");
    return;
  }
  try {
    pool = new Pool({ connectionString: env.db.url, ssl: sslConfig(), max: 5 });
    await pool.query(SCHEMA_SQL);
    dbReady = true;
    console.log("[db] Connected; schema ensured.");
  } catch (err) {
    console.error("[db] Failed to initialize — continuing without persistence.", err);
    pool = null;
    dbReady = false;
  }
}

export interface SaveArgs {
  noteType: string;
  caseId: string;
  caseTitle: string;
  sourceIsUploaded: boolean;
  model: string;
  draft: string;
  overallScore: number;
  maxScore: number;
  percent: number;
  band: string;
  assessment: unknown;
  categories: CategoryScore[];
}

export async function saveSubmission(a: SaveArgs): Promise<number | null> {
  if (!pool || !dbReady) return null;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query(
      `INSERT INTO submissions
         (note_type, case_id, case_title, source_is_uploaded, model, draft,
          overall_score, max_score, percent, band, assessment)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        a.noteType,
        a.caseId,
        a.caseTitle,
        a.sourceIsUploaded,
        a.model,
        a.draft,
        a.overallScore,
        a.maxScore,
        a.percent,
        a.band,
        JSON.stringify(a.assessment),
      ],
    );
    const id = res.rows[0].id as number;
    for (const c of a.categories) {
      await client.query(
        `INSERT INTO category_scores (submission_id, note_type, category, score, max_score, percent)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, a.noteType, c.category, c.score, c.maxScore, c.percent],
      );
    }
    await client.query("COMMIT");
    return id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getStats(noteType: string): Promise<StatsResponse> {
  if (!pool || !dbReady) {
    return { totalSubmissions: 0, overallAvgPercent: null, categories: [] };
  }
  const totals = await pool.query(
    `SELECT COUNT(*)::int AS n, AVG(percent) AS avg_percent FROM submissions WHERE note_type = $1`,
    [noteType],
  );
  const cats = await pool.query(
    `SELECT category,
            AVG(score)    AS avg_score,
            AVG(max_score) AS avg_max,
            AVG(percent)  AS avg_percent,
            COUNT(*)::int AS n
       FROM category_scores
      WHERE note_type = $1
      GROUP BY category`,
    [noteType],
  );

  const order = getContent().categoryOrder;
  const rows = cats.rows
    .map((r) => ({
      category: r.category as string,
      avgScore: Number(r.avg_score),
      avgMax: Number(r.avg_max),
      avgPercent: Number(r.avg_percent),
      count: r.n as number,
    }))
    .sort((x, y) => {
      const ix = order.indexOf(x.category);
      const iy = order.indexOf(y.category);
      return (ix === -1 ? 999 : ix) - (iy === -1 ? 999 : iy);
    });

  const n = totals.rows[0].n as number;
  const avgP = totals.rows[0].avg_percent;
  return {
    totalSubmissions: n,
    overallAvgPercent: avgP == null ? null : Number(avgP),
    categories: rows,
  };
}
