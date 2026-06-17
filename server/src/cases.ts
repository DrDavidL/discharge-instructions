import type { CaseSummary } from "@dci/shared";

// All cases are fully SIMULATED. No real patient information. The content is intentionally
// rich enough to support writing complete patient discharge instructions.

const HEART_FAILURE = `> **⚠️ SIMULATED CASE — NOT A REAL PATIENT.** For educational use only.

# Discharge Summary

**Patient:** Robert A. (simulated) · **MRN:** SIM-100001 · **Age/Sex:** 72 M
**Admitted:** Day 0 · **Discharged:** Day 6
**Attending:** Dr. P. Okafor, Cardiology · **Service:** Cardiology

## Admitting Diagnosis
Acute decompensated heart failure (volume overload).

## Discharge Diagnoses
1. Acute on chronic systolic heart failure (HFrEF, LVEF 30%), decompensated
2. New-onset atrial fibrillation with rapid ventricular response
3. Acute kidney injury on chronic kidney disease (stage 3a), resolving
4. Type 2 diabetes mellitus
5. Hypertension
6. Hyperlipidemia

## Allergies
Sulfa drugs (rash).

## Hospital Course
Mr. A. presented with 5 days of progressive dyspnea, orthopnea (3 pillows), 4 kg weight
gain, and bilateral leg swelling. Exam showed JVD, bibasilar crackles, and 2+ pitting
edema. BNP 1,850 pg/mL. Chest x-ray showed pulmonary edema. He was found to be in atrial
fibrillation (HR 128) — new compared with prior sinus rhythm.

He was treated with IV furosemide with a net diuresis of 6.2 L over 5 days; symptoms and
oxygenation improved. Rate control was achieved with metoprolol. Given CHA₂DS₂-VASc of 4,
anticoagulation with apixaban was started for stroke prevention. Creatinine rose from a
baseline of 1.3 to a peak of 1.9 mg/dL (AKI) with diuresis and improved to 1.5 mg/dL by
discharge. Guideline-directed therapy was optimized: lisinopril was continued and
spironolactone was newly added; empagliflozin was started for combined heart-failure and
diabetes benefit. He was counseled extensively on daily weights and a low-sodium diet.

## Procedures
- Transthoracic echocardiogram: LVEF 30%, moderate MR, no significant valvular stenosis.
- Telemetry monitoring.

## Condition at Discharge
Hemodynamically stable, euvolemic, ambulating independently. **Discharge weight: 81.6 kg
(dry weight).** Resting HR 72, BP 118/70, SpO₂ 96% on room air.

## Discharge Medications
**NEW**
- Apixaban 5 mg by mouth twice daily (blood thinner to prevent stroke from atrial fibrillation)
- Spironolactone 25 mg by mouth once daily (heart-failure medicine; can raise potassium)
- Empagliflozin 10 mg by mouth once daily (helps the heart and lowers blood sugar)
- Furosemide 40 mg by mouth once daily (water pill)

**CHANGED**
- Metoprolol succinate increased to 50 mg by mouth once daily (was 25 mg)

**CONTINUED**
- Lisinopril 10 mg by mouth once daily
- Atorvastatin 40 mg by mouth once daily
- Metformin 1000 mg by mouth twice daily

**STOPPED**
- Ibuprofen (over-the-counter) — avoid NSAIDs; they worsen heart failure and kidney function.

## Pending at Discharge
- Basic metabolic panel (potassium and creatinine) to be drawn in 3–5 days — results pending.
- TSH ordered to evaluate new atrial fibrillation — result pending.

## Follow-Up
- **Cardiology (Dr. Okafor):** 7–10 days. Bring your weight log.
- **Primary care:** within 1 week for lab recheck (potassium, kidney function).
- **Anticoagulation/pharmacy clinic:** call within 2 days to confirm apixaban coverage.

## Diet / Activity
- Low-sodium diet (< 2,000 mg/day). Fluid limit 2 L/day.
- Weigh yourself every morning after urinating, before breakfast; record it.
- Walk daily as tolerated; rest if short of breath.

## Code Status
Full code.`;

const DKA = `> **⚠️ SIMULATED CASE — NOT A REAL PATIENT.** For educational use only.

# Discharge Summary

**Patient:** Maya T. (simulated) · **MRN:** SIM-100002 · **Age/Sex:** 19 F
**Admitted:** Day 0 · **Discharged:** Day 4
**Attending:** Dr. L. Hassan, Endocrinology · **Service:** Internal Medicine / Endocrinology
**Preferred language:** Spanish (patient bilingual; mother prefers Spanish).

## Admitting Diagnosis
Diabetic ketoacidosis.

## Discharge Diagnoses
1. New-onset type 1 diabetes mellitus presenting with diabetic ketoacidosis (resolved)
2. Mild volume depletion (resolved)

## Allergies
No known drug allergies.

## Hospital Course
Ms. T., a previously healthy college student, presented with 2 weeks of polyuria,
polydipsia, 5 kg weight loss, then 1 day of nausea, vomiting, and abdominal pain. Labs:
glucose 512 mg/dL, bicarbonate 9 mmol/L, anion gap 24, large serum ketones, pH 7.18.
She was diagnosed with DKA. Autoantibody testing (GAD-65) was positive and C-peptide low,
consistent with type 1 diabetes.

She was treated with IV fluids and an insulin infusion; the anion gap closed and she was
transitioned to subcutaneous insulin. Diabetes education was begun with the inpatient
diabetes educator: blood glucose monitoring, carbohydrate counting, insulin injection
technique, and sick-day rules. She and her mother received initial teaching; ongoing
outpatient education is arranged. She demonstrated correct glucose checking and injection
on the day before discharge.

## Condition at Discharge
Tolerating a full diet, ambulating, glucose 140–180 mg/dL range. No ketones. Alert and
engaged in self-care.

## Discharge Medications
**NEW (all new — first time on insulin)**
- Insulin glargine (long-acting) 14 units subcutaneously every night at bedtime
- Insulin lispro (rapid-acting) with meals using a sliding scale + carbohydrate ratio:
  - 1 unit per 12 g carbohydrate, PLUS correction 1 unit per 50 mg/dL over 150 mg/dL
- Glucagon emergency kit — for severe low blood sugar if unable to take sugar by mouth

**SUPPLIES**
- Glucose meter, test strips, lancets
- Insulin pens and pen needles
- Ketone test strips
- Medical alert recommendation discussed

## Pending at Discharge
- Hemoglobin A1c — result pending.
- Thyroid antibody panel and celiac screen (associated autoimmune conditions) — pending.

## Follow-Up
- **Endocrinology / diabetes clinic:** within 3–5 days (early visit essential for insulin
  dose adjustment). Office will call to schedule; if not contacted in 1 business day, call them.
- **Outpatient diabetes educator:** appointment in 1 week for continued teaching.
- **Primary care:** within 2 weeks.

## Diet / Activity / Self-Care
- Check blood glucose before each meal and at bedtime (4×/day), and any time you feel low.
- Carbohydrate counting as taught; consistent meal timing.
- Check ketones if glucose > 250 mg/dL or if sick.
- **Sick-day rules:** never skip basal (long-acting) insulin even if not eating; hydrate;
  check ketones; call the diabetes clinic.
- Resume normal activity; carry fast-acting sugar at all times.

## Code Status
Full code.`;

const COLECTOMY = `> **⚠️ SIMULATED CASE — NOT A REAL PATIENT.** For educational use only.

# Discharge Summary

**Patient:** George N. (simulated) · **MRN:** SIM-100003 · **Age/Sex:** 58 M
**Admitted:** Day 0 (emergency) · **Discharged:** Day 8
**Attending:** Dr. S. Whitfield, Colorectal Surgery · **Service:** Surgery

## Admitting Diagnosis
Perforated sigmoid diverticulitis with localized peritonitis.

## Discharge Diagnoses
1. Perforated sigmoid diverticulitis, Hinchey II
2. Status post laparoscopic-converted-to-open sigmoid colectomy with end colostomy (Hartmann)
3. Post-operative ileus (resolved)
4. Superficial surgical site infection (incisional), improving on antibiotics
5. Provoked deep vein thrombosis prophylaxis during admission
6. Obesity, hypertension

## Allergies
Penicillin (hives).

## Hospital Course
Mr. N. presented with 3 days of left lower-quadrant pain, fever, and peritoneal signs. CT
showed sigmoid diverticulitis with perforation and a localized abscess. He underwent
laparoscopic sigmoid colectomy that was converted to open due to inflammation; an **end
colostomy** was created (Hartmann's procedure). He received IV antibiotics
(ciprofloxacin + metronidazole given penicillin allergy).

His course was complicated by a post-operative ileus that resolved by day 5 with bowel
rest and ambulation, and a superficial incisional surgical site infection on day 6 treated
with a short course of oral antibiotics and local wound care. The ostomy nurse provided
extensive teaching on colostomy care and pouch changes; he demonstrated an independent
pouch change before discharge. Diet was advanced to a low-residue diet, which he tolerated.

## Procedures
- Open sigmoid colectomy with end colostomy (Hartmann's procedure).
- CT abdomen/pelvis with contrast.

## Condition at Discharge
Afebrile, tolerating low-residue diet, colostomy functioning with formed output, pain
controlled on oral medication, ambulating independently. Incision clean with steri-strips;
small open area at inferior incision packed daily.

## Discharge Medications
**NEW**
- Acetaminophen 650 mg by mouth every 6 hours as needed for pain (do not exceed 3,000 mg/day;
  avoid other products that also contain acetaminophen)
- Oxycodone 5 mg by mouth every 6 hours as needed for severe pain (short course; causes
  constipation and drowsiness — do not drive)
- Docusate 100 mg by mouth twice daily (stool softener while taking opioids)
- Ciprofloxacin 500 mg by mouth twice daily for 5 more days (finish the full course)
- Metronidazole 500 mg by mouth three times daily for 5 more days (no alcohol while taking it)

**CONTINUED**
- Lisinopril 20 mg by mouth once daily
- Enoxaparin 40 mg subcutaneously once daily for 2 weeks (VTE prevention after surgery)

## Pending at Discharge
- Surgical pathology of the colon specimen — result pending.
- Wound culture (from the incisional infection) — sensitivities pending.

## Follow-Up
- **Colorectal surgery:** wound check and staple/steri-strip review in 10–14 days.
- **Ostomy/wound care nurse:** home visit within 3–4 days for colostomy support and wound packing.
- **Discussion of colostomy reversal:** to be planned at the surgery visit (typically months later).

## Diet / Activity / Wound & Ostomy Care
- Low-residue diet now; advance gradually as instructed by surgery.
- Empty the colostomy pouch when ⅓ full; change the pouch every 3–4 days or if leaking.
- No lifting over 10 lb for 6 weeks; no driving while taking oxycodone.
- Wound care: pack the small open area once daily with the supplied dressing; keep the
  incision clean and dry; shower is okay, no baths or swimming until cleared.
- Stay hydrated; expect looser output if intake of certain foods changes.

## Code Status
Full code.`;

export const CASES: CaseSummary[] = [
  {
    id: "chf",
    title: "Acute Decompensated Heart Failure (with new AFib & AKI)",
    blurb: "72M with HFrEF, new atrial fibrillation on a new anticoagulant, AKI, and diabetes — heavy medication changes and daily-weight monitoring.",
    content: HEART_FAILURE,
  },
  {
    id: "dka",
    title: "New-Onset Type 1 Diabetes Presenting in DKA",
    blurb: "19F, first-ever insulin regimen, glucose monitoring, sick-day rules, and urgent endocrine follow-up. Spanish language preference noted.",
    content: DKA,
  },
  {
    id: "colectomy",
    title: "Perforated Diverticulitis — Sigmoid Colectomy with New Colostomy",
    blurb: "58M post-op with a new colostomy, wound infection and packing, opioid + antibiotic course, VTE prophylaxis, and activity restrictions.",
    content: COLECTOMY,
  },
];

export function findCase(id: string): CaseSummary | undefined {
  return CASES.find((c) => c.id === id);
}
