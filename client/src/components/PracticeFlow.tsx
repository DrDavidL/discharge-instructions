import { useEffect, useState } from "react";
import type { CaseSummary, ScoreResponse } from "@dci/shared";
import { api, ApiError } from "../api";
import { CaseSelector, type SelectedCase } from "./CaseSelector";
import { DraftWorkspace } from "./DraftWorkspace";
import { AssessmentView } from "./AssessmentView";

type Step = 1 | 2 | 3;

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Choose a case" },
  { n: 2, label: "Draft instructions" },
  { n: 3, label: "Assessment" },
];

export function PracticeFlow() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<SelectedCase | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [result, setResult] = useState<ScoreResponse | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const c = await api.cases();
        if (!active) return;
        setCases(c);
      } catch (err) {
        if (active) setLoadError(err instanceof ApiError ? err.message : "Failed to load the workspace.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function chooseCase(sel: SelectedCase) {
    setSelected(sel);
    setResult(null);
    setStep(2);
  }

  function restart() {
    setSelected(null);
    setDraft("");
    setResult(null);
    setStep(1);
  }

  return (
    <div className="practice">
      <ol className="stepper">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className={`step ${step === s.n ? "current" : ""} ${step > s.n ? "done" : ""}`}
          >
            <span className="step-num">{s.n}</span>
            <span className="step-label">{s.label}</span>
          </li>
        ))}
      </ol>

      {loading && <div className="panel">Loading the workspace…</div>}
      {loadError && <div className="alert alert-error">{loadError}</div>}

      {!loading && !loadError && step === 1 && <CaseSelector cases={cases} onSelect={chooseCase} />}

      {!loading && !loadError && step === 2 && selected && (
        <DraftWorkspace
          selected={selected}
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(1)}
          onAssessed={(r) => {
            setResult(r);
            setStep(3);
          }}
        />
      )}

      {!loading && !loadError && step === 3 && result && (
        <AssessmentView result={result} onRevise={() => setStep(2)} onRestart={restart} />
      )}
    </div>
  );
}
