# Discharge Instructions — Document Spec & App Features

> **Audience:** read by the assessment LLM **and** parsed by the server.
> The **Student Outline** section below is **faculty/LLM reference only** — students now draft on a
> blank page (a single free-text box, no section prompts), because part of the assessment is whether
> they know which sections to include. The titles and guidance below are still sent to the LLM as
> "what good looks like." Keep the `## Student Outline` heading and the `### ` title format so the
> server keeps parsing this block.

## What students are writing

**Discharge instructions** are the *patient-facing* document handed to a patient at discharge —
plain-language, actionable, and safe. They are derived from, but distinct from, the clinician-facing
**discharge summary** (the source case shown on the left). The goal: a patient (and caregiver) can
read it and know what happened, what to do, what to watch for, and who to call.

## Student Outline

> Faculty/LLM reference only. Students are not shown these titles — they draft on a blank page, and
> whether they include the right sections is part of what is assessed.

### Why You Were in the Hospital
Plain-language reason for admission, the main and secondary diagnoses, and the key things that
happened (significant findings, procedures, treatments). No unexplained jargon.

### Your Medicines
A reconciled medication list with **new / changed / stopped** clearly marked. For each: what it is
for, how many to take, and when. Include safety warnings (e.g., do not double up on acetaminophen,
anticoagulation precautions, "do not stop this medicine on your own").

### Activity, Diet, and Daily Care
Diet, physical activity and restrictions, and any wound care, equipment (e.g., oxygen), or home
services. Tailored to this patient's condition.

### Tests and Results to Follow Up
The patient's condition at discharge (including relevant numbers such as discharge weight), and any
pending labs, imaging, or results that still need follow-up — or a clear statement that none are pending.

### Warning Signs and When to Get Help
Specific red-flag symptoms tied to this diagnosis, with what to do for each — call the office, call a
nurse line, or go to the ER / call 911.

### Your Follow-up Appointments
Scheduled follow-up visits: who, when, why, and how to schedule. Include specialist recommendations
and anticipated next steps.

### Who to Call
Exactly who to contact if worried — primary care, relevant specialists, an after-hours/nurse line,
and the emergency department — with roles and how to reach them.

### Your Questions
Invite the patient (or caregiver) to ask questions, in a respectful, supportive tone that speaks to
their specific situation.

## Reference: hallmarks of excellent discharge instructions

**Core clinical information** — clear reason for hospitalization and final diagnoses; concise
hospital course (findings, procedures, treatments); condition and destination at discharge.

**Medications & at-home care** — comprehensive, reconciled list with patient-centered directions
(exact number of pills and times); explicit safety warnings; clear diet, activity, and self-care.

**Contingency planning & follow-up** — explicit worsening/return-precaution warning signs; exactly
who to call if worried (PCP, specialists, ED); scheduled appointments; pending labs/studies; and
anticipated problems with recommended next steps.

**Readability & communication** — 6th–7th grade reading level; minimal, defined jargon; structure
and visual cues that aid recall; a respectful, patient-centered tone that invites questions.

## App features

- **Shared-password login.** One class password gates the app. No student identity or PHI is stored.
- **Step 1 — Choose or upload a case.** Three built-in simulated discharge summaries, or paste/upload
  your own (with a no-PHI / simulated-content-only warning). The source displays on the left.
- **Step 2 — Draft your discharge instructions.** Students write on a **blank page** (a single
  free-text box) — no section prompts — so the assessment can capture whether they know which
  sections to include.
- **Step 3 — Assess.** The draft is scored by the LLM against `scoring.md`, plus a server-computed
  Flesch–Kincaid reading level. The draft and full assessment are saved to the database; the
  assessment is shown to the student. For built-in cases, a **gold-standard example** can be
  revealed for comparison after scoring.
- **Class Statistics (independent tab).** Average category scores across all submissions, viewable
  any time without going through the steps.

## Extending to other note types

The outline and rubric are data, not code. To add a note type (e.g., H&P, progress note, procedure
note), add a parallel `features-<type>.md` / `scoring-<type>.md` pair and register it; the editor,
prompt assembly, scoring, and stats are all driven by these files plus the `note_type` column in the
database.
