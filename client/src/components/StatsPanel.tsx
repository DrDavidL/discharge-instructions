import { useEffect, useState } from "react";
import type { StatsResponse } from "@dci/shared";
import { api, ApiError } from "../api";

function fillClass(percent: number): string {
  if (percent >= 83) return "good";
  if (percent >= 58) return "mid";
  return "low";
}

export function StatsPanel() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await api.stats());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load statistics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="stats">
      <div className="section-intro stats-intro">
        <div>
          <h2>Class Statistics</h2>
          <p>Average category performance across all submissions in the class database.</p>
        </div>
        <button className="btn btn-ghost btn-small" onClick={() => void load()} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {loading && <div className="panel">Loading statistics…</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && data && data.totalSubmissions === 0 && (
        <div className="panel empty-state">
          <p>No submissions yet.</p>
          <p className="muted">Class averages will appear here once students submit assessments.</p>
        </div>
      )}

      {!loading && !error && data && data.totalSubmissions > 0 && (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-value">{data.totalSubmissions}</div>
              <div className="stat-label">Submissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {data.overallAvgPercent === null ? "—" : `${Math.round(data.overallAvgPercent)}%`}
              </div>
              <div className="stat-label">Overall average</div>
            </div>
          </div>

          <h3 className="section-h">Average by category</h3>
          <div className="category-bars">
            {data.categories.map((c) => (
              <div className="cat-row" key={c.category}>
                <div className="cat-name">
                  {c.category} <span className="muted">({c.count})</span>
                </div>
                <div className="cat-bar">
                  <div
                    className={`cat-fill ${fillClass(c.avgPercent)}`}
                    style={{ width: `${c.avgPercent}%` }}
                  />
                </div>
                <div className="cat-score">
                  {c.avgScore.toFixed(1)}/{c.avgMax.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
