import { useState, type Dispatch, type SetStateAction } from "react";
import type { OutlineSection, ScoreResponse } from "@dci/shared";
import { api, ApiError } from "../api";
import { CaseViewer } from "./CaseViewer";
import type { SelectedCase } from "./CaseSelector";

interface Props {
  selected: SelectedCase;
  outline: OutlineSection[];
  draft: Record<string, string>;
  setDraft: Dispatch<SetStateAction<Record<string, string>>>;
  onBack: () => void;
  onAssessed: (result: ScoreResponse) => void;
}

export function DraftWorkspace({ selected, outline, draft, setDraft, onBack, onAssessed }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filledCount = outline.filter((s) => (draft[s.key] ?? "").trim()).length;

  function assembleDraft(): string {
    return outline.map((s) => `## ${s.title}\n${(draft[s.key] ?? "").trim()}`).join("\n\n");
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.score({
        caseId: selected.id,
        caseTitle: selected.title,
        sourceSummary: selected.content,
        sourceIsUploaded: selected.isUploaded,
        draft: assembleDraft(),
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
          The discharge summary is on the left. Complete each section on the right in plain,
          patient-friendly language.
        </p>
      </div>

      <div className="split">
        <div className="split-left">
          <div className="panel-label">Source · {selected.title}</div>
          <CaseViewer content={selected.content} />
        </div>
        <div className="split-right">
          <div className="panel-label">Your discharge instructions</div>
          <div className="outline-editor">
            {outline.map((s) => (
              <div className="outline-section" key={s.key}>
                <label htmlFor={`sec-${s.key}`}>{s.title}</label>
                <textarea
                  id={`sec-${s.key}`}
                  value={draft[s.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [s.key]: e.target.value }))}
                  rows={4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="workspace-actions">
        <button className="btn btn-ghost" onClick={onBack} disabled={submitting}>
          ← Back to cases
        </button>
        <div className="spacer" />
        <span className="muted">
          {filledCount}/{outline.length} sections written
        </span>
        <button className="btn btn-primary" onClick={submit} disabled={submitting || filledCount === 0}>
          {submitting ? "Assessing…" : "Submit for assessment"}
        </button>
      </div>
    </section>
  );
}
