import { useState, type Dispatch, type SetStateAction } from "react";
import type { ScoreResponse } from "@dci/shared";
import { api, ApiError } from "../api";
import { CaseViewer } from "./CaseViewer";
import type { SelectedCase } from "./CaseSelector";

interface Props {
  selected: SelectedCase;
  draft: string;
  setDraft: Dispatch<SetStateAction<string>>;
  onBack: () => void;
  onAssessed: (result: ScoreResponse) => void;
}

export function DraftWorkspace({ selected, draft, setDraft, onBack, onAssessed }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.score({
        caseId: selected.id,
        caseTitle: selected.title,
        sourceSummary: selected.content,
        sourceIsUploaded: selected.isUploaded,
        draft,
      });
      onAssessed(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Assessment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="workspace">
      <div className="section-intro">
        <h2>Step 2 · Draft your discharge instructions</h2>
        <p>
          The discharge summary is on the left. Write the complete patient-facing discharge
          instructions on the right, in plain, patient-friendly language. There are no section
          prompts — deciding what to include is part of the exercise.
        </p>
      </div>

      <div className="split">
        <div className="split-left">
          <div className="panel-label">Source · {selected.title}</div>
          <CaseViewer content={selected.content} />
        </div>
        <div className="split-right">
          <div className="panel-label">Your discharge instructions</div>
          <textarea
            className="draft-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write the discharge instructions you would hand to this patient…"
            rows={24}
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="workspace-actions">
        <button className="btn btn-ghost" onClick={onBack} disabled={submitting}>
          ← Back to cases
        </button>
        <div className="spacer" />
        <span className="muted">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
        <button className="btn btn-primary" onClick={submit} disabled={submitting || wordCount === 0}>
          {submitting ? "Assessing…" : "Submit for assessment"}
        </button>
      </div>
    </section>
  );
}
