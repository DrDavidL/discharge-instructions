# CLAUDE.md

Educational web app where medical students draft **patient discharge instructions** from a
simulated discharge summary and get instant, rubric-based LLM feedback. Shared-password login;
no PHI or student identity is stored. Sponsored by Northwestern Feinberg School of Medicine.

## Architecture

```
client/  React + Vite + TS SPA  ──/api──▶  server/  Express + TS
                                              ├─ OpenRouter (scoring LLM)
                                              └─ Railway Postgres (submissions + category_scores)
shared/  TS types shared by both (@dci/shared workspace)
```

- **One Railway service**: the server serves the built SPA (`client/dist`) **and** the `/api`.
- **`scoring.md` and `features.md` are the source of truth.** The server parses `features.md`
  for the student outline (section headers) and the criteria table in `scoring.md`, injects both
  into the scoring prompt, and **computes all category/overall scores itself** (never trusts LLM math).
- DB is optional: with no `DATABASE_URL` the app runs fine but doesn't persist (stats show empty).

## Key files

| File | Purpose |
|------|---------|
| `scoring.md` | Rubric. Server parses the `\| ID \| Category \| Criterion \| Points \|` table. |
| `features.md` | Document spec. Server parses the `## Student Outline` `###` headers. |
| `server/src/content.ts` | Parses the two `.md` files (with safe fallbacks). |
| `server/src/scoring.ts` | OpenRouter call, zod validation + retry, score aggregation, bands. |
| `server/src/cases.ts` | The 3 simulated discharge summaries. |
| `server/src/db.ts` | Postgres schema init, `saveSubmission`, `getStats`. |
| `server/src/index.ts` | Express routes + static SPA serving. |
| `client/src/components/PracticeFlow.tsx` | 3-step workflow orchestration. |
| `client/src/components/StatsPanel.tsx` | Independent class-averages tab. |

## Critical rules

- **Never store PHI.** Uploaded source summaries are **not** persisted (only the student draft +
  assessment are). Keep the no-PHI warnings on upload and login.
- Scores are computed server-side from per-criterion results; the LLM only scores criteria by `id`.
- Bands are percent-based (Optimal ≥83%, Adequate ≥58%, else Inadequate) so they survive rubric edits.
- Keep the parseable formats in `scoring.md`/`features.md` intact (table header row; `## Student Outline` + `### ` headers).

## Commands

```bash
npm install          # install all workspaces
npm run dev          # client (5173) + server (8080) with /api proxy
npm run typecheck    # tsc --noEmit, both workspaces
npm run build        # build client → client/dist
npm start            # production: server serves client/dist + /api (run build first)
```

## Environment variables

`OPENROUTER_API_KEY`, `MODEL` (default `anthropic/claude-sonnet-4.6`), `APP_PASSWORD`,
`AUTH_SECRET`, `DATABASE_URL` (Railway-provided), optional `DATABASE_SSL`, `PORT`,
`OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`. See `.env.example`.

## Update checklist

- Change the outline → edit `## Student Outline` in `features.md`.
- Change scoring → edit the criteria table / anchors in `scoring.md` (keep IDs unique).
- Add a sample case → add to `server/src/cases.ts`.
- Add a new note type → parallel `features-<type>.md`/`scoring-<type>.md`, register, use the `note_type` column.
- Schema change → update `SCHEMA_SQL` in `server/src/db.ts` (uses `CREATE TABLE IF NOT EXISTS`).
