# Discharge Instructions — Scoring Rubric

> **Audience:** This file is read by the assessment LLM **and** parsed by the server.
> Keep the **Criteria Table** below in its exact column format — the server reads it to
> build the score sheet, compute category and overall scores, and store category averages.
> Faculty may edit criterion wording, anchors, and the principles freely. To change which
> criteria exist or their point values, edit the table rows (ID must stay unique and sequential).

## What is being scored

A **patient-facing discharge instructions** document written by a medical student from a
provided discharge summary (the clinical source). You are evaluating the *instructions the
patient receives*, not the clinician-facing summary. Score only what the submitted text
demonstrates. Reward clarity, safety, completeness, and patient-centeredness.

## Scoring scale (applies to every criterion)

Each criterion is scored **0, 1, or 2**:

- **2 — Fully meets standard:** Complete, specific, accurate, and patient-friendly.
- **1 — Partially meets standard:** Present but vague, incomplete, partially inaccurate, or hard to act on.
- **0 — Missing / inadequate:** Absent, or so unclear/incorrect it could not guide the patient (or is unsafe).

Always cite concrete evidence from the student's draft in your rationale (quote or paraphrase
the relevant line). When a criterion does not apply to this case (e.g., no wound, no pending
tests), score **2** if the student correctly omitted it or stated none, and say so.

## Criteria Table

> Server-parsed. Do not change the header row. One row per criterion. `Points` is the max for that criterion.

| ID | Category | Criterion | Points |
|----|----------|-----------|--------|
| 1 | Clinical Completeness | Diagnoses & Hospital Course | 2 |
| 2 | Clinical Completeness | Discharge Status & Pending Items | 2 |
| 3 | Medications & Home Care | Medication Safety & Clarity | 2 |
| 4 | Medications & Home Care | Activity, Diet & Self-Care | 2 |
| 5 | Contingency Planning & Follow-Up | Warning Signs & Return Precautions | 2 |
| 6 | Contingency Planning & Follow-Up | Contact Information | 2 |
| 7 | Contingency Planning & Follow-Up | Follow-Up Care | 2 |
| 8 | Readability, Formatting & Language | Reading Level & Plain Language | 2 |
| 9 | Readability, Formatting & Language | Organization & Formatting | 2 |
| 10 | Communication & Patient Engagement | Patient-Centeredness | 2 |
| 11 | Accuracy & Safety | Accuracy & Consistency with the Record | 2 |

**Maximum total: 22 points.**

## Per-criterion anchors

**1 — Diagnoses & Hospital Course.** Plain-language explanation of *why the patient was in the
hospital*, the main and secondary diagnoses, and the key events/procedures/treatments.
- 2: All present, in lay terms the patient can understand.
- 1: Mentions the diagnosis but thin on the hospital course, or uses unexplained jargon.
- 0: Missing, or the stated reason/diagnosis is wrong.

**2 — Discharge Status & Pending Items.** The patient's condition at discharge (and relevant
numbers, e.g., discharge weight for heart failure) **and** any pending labs/tests/results that
need follow-up.
- 2: States condition at discharge and lists pending items (or clearly states none pending).
- 1: One of the two, or vague.
- 0: Neither addressed.

**3 — Medication Safety & Clarity.** A reconciled medication list with **new / changed / stopped**
clearly flagged; patient-centered directions (how many pills, when, why); and key safety
warnings (e.g., avoid duplicate acetaminophen, anticoagulation precautions, "do not stop X").
- 2: Reconciled, changes flagged, dose/timing/purpose clear, relevant warnings included.
- 1: List present but missing changes, timing, purpose, or warnings.
- 0: No usable medication guidance, or a dangerous medication error.

**4 — Activity, Diet & Self-Care.** Actionable guidance on diet, physical activity/restrictions,
and home/wound/equipment care relevant to this patient.
- 2: Specific and tailored to the case.
- 1: Generic or partial.
- 0: Absent when clearly needed.

**5 — Warning Signs & Return Precautions.** Specific red-flag symptoms that mean "get help,"
with what to do (call vs. go to ER / call 911), tailored to the diagnosis.
- 2: Specific, condition-relevant red flags with clear escalation actions.
- 1: Generic warnings, or symptoms without an action.
- 0: Missing.

**6 — Contact Information.** Exactly who to call if worried — PCP, relevant specialists,
after-hours/nurse line, and the ED — with enough detail to act (role + how to reach).
- 2: Clear contacts including after-hours/emergency path.
- 1: Some contacts, but gaps (e.g., no after-hours guidance).
- 0: No actionable contact guidance.

**7 — Follow-Up Care.** Scheduled follow-up appointments (who / when / why / how to schedule),
specialist recommendations, and anticipated next steps.
- 2: Appointments specified with purpose and timing; next steps clear.
- 1: Mentions follow-up but vague on who/when/why.
- 0: No follow-up plan.

**8 — Reading Level & Plain Language.** Written around a 6th–7th grade level; medical jargon
avoided or defined. A computed Flesch–Kincaid grade level for the draft is provided to you —
use it as the authoritative reading-level measure and weigh it alongside jargon use.
- 2: Consistently plain (≈ 6th–7th grade); jargon explained.
- 1: Mixed; some unexplained terms or long complex sentences (grade level somewhat high).
- 0: Dense clinical language a layperson could not follow.

**9 — Organization & Formatting.** Clear headings, short sentences, and lists/structure that aid
recall (the kind of structure that supports pictograms/visual cues in a real handout).
- 2: Well-organized, scannable, logically ordered.
- 1: Some structure but uneven.
- 0: Wall of text / disorganized.

**10 — Patient-Centeredness.** Speaks to *this* patient's (or caregiver's) situation and social
context, uses a respectful, supportive tone, and invites the patient to ask questions.
- 2: Personalized, supportive tone; invites questions.
- 1: Generic but respectful.
- 0: Impersonal or not actionable for the patient.

**11 — Accuracy & Consistency with the Record.** The instructions are factually consistent with
the provided discharge summary — no contradictions, invented details, or dangerous omissions.
- 2: Faithful to the source; no contradictions or fabrications.
- 1: Minor inconsistencies or omissions.
- 0: Contradicts the record, invents facts, or omits something safety-critical.

> **Note on adaptation:** The original Category 6 covered administrative compliance (attending
> signature, 30-day/24-hour timeliness). Those cannot be judged from instruction text a student
> writes in this exercise, so Category 6 here evaluates **accuracy and consistency with the
> clinical record** — assessable from the submission and directly tied to patient safety.

## Aggregation and bands (computed by the server)

- **Category score** = sum of its criteria; **category percent** = score ÷ category max.
- **Overall score** = sum of all criteria (max 22); **percent** = overall ÷ 22.
- **Performance band** (by percent, so it survives rubric edits):
  - **Optimal** — ≥ 83% (≈ 19–22 / 22): safe, clear, ready to give a patient.
  - **Adequate** — 58–82% (≈ 13–18 / 22): usable but needs targeted revision for safety/comprehension.
  - **Inadequate** — < 58% (< 13 / 22): high risk of post-discharge harm or readmission; needs rewrite.

## Required output (JSON only)

Return a single JSON object — no markdown, no prose outside it. The server attaches category,
criterion text, and max points by `id`, and computes all totals/bands, so **do not** return
category aggregates or the overall total. Score every criterion id from the table.

```json
{
  "criteria": [
    {
      "id": 1,
      "score": 2,
      "rationale": "Concise reason citing the student's text.",
      "improvement": "Specific, actionable fix to reach full marks (empty string if already 2)."
    }
  ],
  "summary": "2–4 sentence overall narrative for the student.",
  "topPriorities": ["The most important fix", "Second", "Third"],
  "safetyFlags": ["Any dangerous error or omission; empty array if none."]
}
```

## Scoring principles

- **Patient safety first.** Dangerous medication errors, wrong diagnoses, missing red flags, or
  contradictions with the record must drive the relevant criterion to 0 and appear in `safetyFlags`.
- **Be specific and evidence-based.** Quote or paraphrase the student's words in every rationale.
- **Be fair about "not applicable."** Correctly omitting an irrelevant section earns credit.
- **Be constructive.** `improvement` text should teach — name the gap and how to close it.
- **Reward plain language.** Favor clarity and teach-back readiness over clinical completeness for its own sake.
