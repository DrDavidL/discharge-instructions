# Decisions

Format: Date · Context · Decision · Rationale.

## 2026-06-17 · Backend language
**Context:** React frontend required; backend needed for the OpenRouter proxy, auth, and DB.
**Decision:** Node + Express + TypeScript (single language across the repo).
**Rationale:** One toolchain and one Railway service (server serves the built SPA + API). A
Python/FastAPI backend would add a second build system for little gain on a small API. (User chose
this in the kickoff questions.)

## 2026-06-17 · TypeScript everywhere + shared types
**Decision:** TS in client, server, and a `@dci/shared` workspace package for shared types.
**Rationale:** One contract for the scoring/outline/stats payloads; matches the "robust" goal.

## 2026-06-17 · Markdown files as the single source of truth
**Decision:** `features.md` (outline) and `scoring.md` (rubric) are parsed by the server and
injected into the LLM prompt; the UI outline and the scoring criteria both derive from them.
**Rationale:** Faculty can change the outline and rubric without code changes. Parsing has safe
fallbacks (built-in default criteria; empty outline warning) so a bad edit can't crash the app.

## 2026-06-17 · Server computes scores; LLM only scores criteria
**Decision:** The LLM returns a score per criterion `id` (+ rationale/improvement/summary/flags).
The server attaches category/criterion/max, sums categories and the overall, and assigns the band.
**Rationale:** Removes reliance on LLM arithmetic; guarantees internally consistent totals and bands.
Bands are percent-based so they survive rubric edits.

## 2026-06-17 · Rubric Category 6 adaptation
**Context:** The source rubric's Category 6 was "Administrative Compliance" (attending signature,
24h/30-day timeliness).
**Decision:** Replace it with "Accuracy & Safety — consistency with the record."
**Rationale:** Signature/timeliness can't be judged from instruction text a student types in this
exercise; accuracy-vs-source is assessable and directly safety-relevant. Documented in `scoring.md`.

## 2026-06-17 · PHI safety posture
**Decision:** No student identity stored. Built-in cases are simulated. Uploaded source summaries
are **not** persisted — only the student draft and the assessment are saved. No-PHI warnings on
the login and upload screens.
**Rationale:** Minimize any chance of storing real patient data in a teaching tool.

## 2026-06-17 · Database optional / graceful degradation
**Decision:** If `DATABASE_URL` is absent or connection fails, the app still scores; it just
doesn't persist, and Class Statistics shows an empty state.
**Rationale:** Frictionless local dev without Postgres; resilient if the DB is briefly unavailable.

## 2026-06-17 · Single Railway service + Nixpacks
**Decision:** Express serves `client/dist` and `/api`; `nixpacks.toml` pins Node 20 and runs
`npm ci` → `npm run build` → `npm start`. Server runs via `tsx` (no separate compile step).
**Rationale:** Simplest deploy; one service + a Postgres plugin.

## 2026-06-17 · Accepted dev-only npm advisory
**Context:** `npm audit` flags `esbuild <=0.24.2` via Vite (dev server can be probed by a website).
**Decision:** Accept it; pinned a patched `shell-quote` via `overrides` for the `concurrently` chain.
**Rationale:** esbuild/Vite are dev-only and not in the production runtime (prod serves prebuilt
static files via Express). Forcing a Vite major bump to clear it risks breaking the build for no
production benefit. Revisit when upgrading Vite.
