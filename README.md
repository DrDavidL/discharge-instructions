# Discharge Instructions Coach

An educational web app for medical students to practice writing **patient-facing discharge
instructions** from a simulated discharge summary, and receive instant, rubric-based feedback
from an LLM. Built for and **sponsored by Northwestern University Feinberg School of Medicine**.

> ⚠️ **Educational simulation only.** Login is a single shared class password. No student
> identity and **no protected health information (PHI)** is collected or stored. All built-in
> cases are fully simulated, and uploaded source documents are **never persisted**.

## How it works

1. **Choose a case** — pick one of the simulated discharge summaries, or paste/upload your own
   *simulated* document (with a no-PHI warning).
2. **Draft your discharge instructions** — the source summary shows on the left; you write the
   complete instructions on the right in a **single blank text box**. There are no section
   prompts — deciding which sections to include is part of the exercise.
3. **Assess** — your draft is scored against a comprehensive rubric, with a server-computed
   **reading-level estimate** (see below). The draft and the full assessment are saved to the
   class database, and the assessment is shown to you immediately. For built-in cases, a
   **gold-standard example** can be revealed for comparison after scoring.

A separate, always-available **Class Statistics** tab shows average category scores across all
submissions (independent of the 3-step flow).

The rubric (`scoring.md`) and the student outline (`features.md`) are plain Markdown and are the
**single source of truth** — faculty can edit them without touching code.

## Reading-level assessment (deterministic)

The reading grade level is **computed by the server, not the LLM**, so it is reproducible: the
same draft always yields the same number. The implementation (`server/src/readability.ts`) is
dependency-free and applies the standard readability formulas to the student's submitted text:

- **Flesch–Kincaid Grade Level** = `0.39 × (words ÷ sentences) + 11.8 × (syllables ÷ words) − 15.59`
  — the headline metric, reported as a U.S. school grade (target ≈ 6th–7th grade for patient material).
- **Flesch Reading Ease** = `206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words)`
  — a 0–100 companion score (higher is easier), clamped to that range for display.

Before counting, the text is lightly de-marked-down (headings, list bullets, emphasis, links, code
removed). Words are matched on letter runs; sentences on `.`/`!`/`?` terminators (minimum 1 so a
single line still scores); syllables are estimated with a vowel-group heuristic (silent trailing
`e` dropped, minimum 1 per word). This estimate is shown to the student **and** passed into the
scoring prompt as the authoritative figure for the *Reading Level & Plain Language* criterion, so
the LLM grades that criterion against a real number rather than guessing.

## Tech stack

- **Frontend:** React + Vite + TypeScript (Northwestern-purple theme, responsive).
- **Backend:** Node + Express + TypeScript (one service serves the API *and* the built SPA).
- **LLM:** OpenRouter (default model `anthropic/claude-sonnet-4.6`).
- **Database:** PostgreSQL (Railway).
- Monorepo via npm workspaces: `client/`, `server/`, `shared/`.

## Local development

Requires Node 20+.

```bash
git clone <your-repo-url>
cd discharge-instructions
npm install
cp .env.example .env      # then fill in the values
npm run dev               # client at http://localhost:5173, API at :8080
```

`npm run dev` runs the Vite dev server (which proxies `/api` to the Express server). A database
is **optional** locally — without `DATABASE_URL` the app works but won't persist submissions.

Other scripts: `npm run typecheck`, `npm run build`, `npm start` (production: serves
`client/dist` + API from the Express server — run `npm run build` first).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | yes | OpenRouter API key (used server-side only). |
| `MODEL` | no | Scoring model. Default `anthropic/claude-sonnet-4.6`. |
| `APP_PASSWORD` | yes | The shared class login password. |
| `AUTH_SECRET` | yes (prod) | Secret for signing session tokens. `openssl rand -hex 32`. |
| `DATABASE_URL` | prod | Postgres connection string (Railway provides this). |
| `DATABASE_SSL` | no | `true`/`false` to force TLS. Default: off for localhost, on otherwise. |
| `PORT` | no | Defaults to 8080; Railway sets this automatically. |
| `OPENROUTER_SITE_URL` | no | Sent as `HTTP-Referer` to OpenRouter (attribution). |
| `OPENROUTER_APP_NAME` | no | Sent as `X-Title` to OpenRouter (attribution). |

`.env` is git-ignored. **Never commit secrets.**

## Deploying to Railway

This app is **one service** — the Express server serves the built React SPA *and* the `/api`.
Railway's default **Railpack** builder runs the root `build` script (which builds the client) and
the root `start` script (which starts the server), and supports npm workspaces natively.

1. **Push this repo to GitHub** (public is fine — no secrets are committed).
2. In Railway: **New Project → Deploy from GitHub repo** and select this repo.
   - ⚠️ **Monorepo note:** Railway may auto-detect the npm workspaces and create *one service per
     workspace* (`@dci/client`, `@dci/server`). You only want **one** app service. Delete the
     extra one and, on the service you keep, set **Settings → Root Directory** to the **repo root**
     (blank / `/`) so Railpack builds the client *and* runs the server. Keep the builder on
     **Railpack** (the included `railpack.json` pins Node 20 and `startCommand: npm start`).
3. **Add a database:** in the project, **New → Database → PostgreSQL**. This creates a Postgres
   service exposing `DATABASE_URL`.
4. **Reference the database** from the app service: in the app service **Variables**, add
   `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (Railway variable reference).
5. **Set the remaining variables** on the app service:
   - `OPENROUTER_API_KEY` — your key
   - `MODEL` — `anthropic/claude-sonnet-4.6` (or another OpenRouter model)
   - `APP_PASSWORD` — the shared class password
   - `AUTH_SECRET` — a long random string (`openssl rand -hex 32`)
   - *(optional)* `OPENROUTER_SITE_URL` = your Railway URL, `OPENROUTER_APP_NAME`
   - *(optional)* `DATABASE_SSL=true` if you connect over the public Postgres URL and TLS errors occur
6. Railway sets `PORT` automatically — do not override it.
7. Deploy. On first boot the server **creates the database tables automatically**
   (`CREATE TABLE IF NOT EXISTS`); no migration step is needed.

### Database

Two tables are created on startup:

- `submissions` — one row per assessed draft: case, model, the student `draft`, overall score,
  band, and the full `assessment` JSON.
- `category_scores` — one row per category per submission, used for the Class Statistics averages.

No PHI is stored. Uploaded source summaries are not saved.

## For faculty: customizing content

- **Cases:** edit `server/src/cases.ts` (keep them clearly simulated). Each case may include an
  optional `exemplar` (a gold-standard example revealed to students *after* scoring — withheld
  from the `/cases` list so it can't be pre-read) and `scoringNotes` (case-specific grading
  guidance sent to the LLM only).
- **Outline (LLM/faculty reference):** edit the `## Student Outline` section in `features.md`.
  Students no longer see these titles (they draft on a blank page), but the titles and guidance
  are still sent to the LLM as "what good looks like." Keep the `## Student Outline` heading and
  `### ` title format so the server keeps parsing the block.
- **Rubric (how it's scored):** edit `scoring.md` — the criteria table and the anchors. Keep the
  table header `| ID | Category | Criterion | Points |` and unique IDs. Bands are percent-based,
  so adding/removing criteria adjusts the totals automatically.

Changes take effect on redeploy.

## License

Educational use. © Northwestern University Feinberg School of Medicine.
