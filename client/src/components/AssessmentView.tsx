import type { ScoreResponse } from "@dci/shared";

interface Props {
  result: ScoreResponse;
  onRevise: () => void;
  onRestart: () => void;
}

function fillClass(percent: number): string {
  if (percent >= 83) return "good";
  if (percent >= 58) return "mid";
  return "low";
}

export function AssessmentView({ result, onRevise, onRestart }: Props) {
  const a = result.assessment;
  const band = a.band.toLowerCase();

  return (
    <section className="assessment">
      <div className="section-intro">
        <h2>Step 3 · Your assessment</h2>
        {!result.persisted && (
          <p className="muted">This run was not saved to the class database (persistence is off).</p>
        )}
      </div>

      <div className="score-hero">
        <div className={`score-dial band-${band}`}>
          <div className="score-pct">{Math.round(a.percent)}%</div>
          <div className="score-frac">
            {a.overallScore} / {a.maxScore}
          </div>
        </div>
        <div className="score-hero-text">
          <span className={`band-pill band-${band}`}>{a.band}</span>
          {a.summary && <p>{a.summary}</p>}
        </div>
      </div>

      {a.safetyFlags.length > 0 && (
        <div className="alert alert-error">
          <strong>⚠ Safety concerns</strong>
          <ul>
            {a.safetyFlags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {a.topPriorities.length > 0 && (
        <div className="card priorities">
          <h3>Top priorities to improve</h3>
          <ol>
            {a.topPriorities.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </div>
      )}

      <h3 className="section-h">Category scores</h3>
      <div className="category-bars">
        {a.categories.map((c) => (
          <div className="cat-row" key={c.category}>
            <div className="cat-name">{c.category}</div>
            <div className="cat-bar">
              <div className={`cat-fill ${fillClass(c.percent)}`} style={{ width: `${c.percent}%` }} />
            </div>
            <div className="cat-score">
              {c.score}/{c.maxScore}
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-h">Detailed feedback</h3>
      <div className="criteria-list">
        {a.criteria.map((cr) => (
          <div className="criterion" key={cr.id}>
            <div className="criterion-head">
              <span className="criterion-name">{cr.criterion}</span>
              <span className="criterion-cat">{cr.category}</span>
              <span className={`criterion-score s${cr.score}`}>
                {cr.score}/{cr.maxScore}
              </span>
            </div>
            {cr.rationale && <p className="criterion-rationale">{cr.rationale}</p>}
            {cr.improvement && (
              <p className="criterion-improve">
                <strong>To improve:</strong> {cr.improvement}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="workspace-actions">
        <button className="btn btn-ghost" onClick={onRevise}>
          ← Revise my draft
        </button>
        <div className="spacer" />
        <button className="btn btn-secondary" onClick={onRestart}>
          Start a new case
        </button>
      </div>

      <p className="muted small">Scored by {result.model}.</p>
    </section>
  );
}
