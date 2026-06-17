import { useState, type FormEvent } from "react";
import { ApiError } from "../api";
import { useAuth } from "../auth";

export function Login() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="brand-mark">Feinberg School of Medicine</div>
        <h1>Discharge Instructions Coach</h1>
        <p className="login-sub">
          Practice writing clear, safe, patient-centered discharge instructions and get instant,
          rubric-based feedback.
        </p>

        <label className="field-label" htmlFor="password">
          Class password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the shared class password"
          autoFocus
        />

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-primary btn-block" type="submit" disabled={loading || !password}>
          {loading ? "Signing in…" : "Enter"}
        </button>

        <p className="login-note">
          No student identity or protected health information (PHI) is collected or stored. This is a
          simulation environment for education only.
        </p>
      </form>
      <footer className="login-footer">
        Sponsored by Northwestern University Feinberg School of Medicine
      </footer>
    </div>
  );
}
