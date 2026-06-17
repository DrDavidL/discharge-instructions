import { useState } from "react";
import { useAuth } from "../auth";
import { PracticeFlow } from "./PracticeFlow";
import { StatsPanel } from "./StatsPanel";

type Tab = "practice" | "stats";

export function Shell() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>("practice");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-title">
            <span className="app-title-main">Discharge Instructions Coach</span>
            <span className="app-title-sub">Feinberg School of Medicine</span>
          </div>
          <nav className="app-nav">
            <button
              className={`nav-tab ${tab === "practice" ? "active" : ""}`}
              onClick={() => setTab("practice")}
            >
              Practice
            </button>
            <button
              className={`nav-tab ${tab === "stats" ? "active" : ""}`}
              onClick={() => setTab("stats")}
            >
              Class Statistics
            </button>
          </nav>
          <button className="btn btn-ghost btn-small" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="app-main">
        {tab === "practice" ? <PracticeFlow /> : <StatsPanel />}
      </main>

      <footer className="app-footer">
        <span>Educational simulation — no PHI is stored.</span>
        <span>Sponsored by Northwestern University Feinberg School of Medicine</span>
      </footer>
    </div>
  );
}
