import type {
  CaseSummary,
  LoginResponse,
  OutlineResponse,
  ScoreRequest,
  ScoreResponse,
  StatsResponse,
} from "@dci/shared";

const TOKEN_KEY = "dci_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401 && token) {
    // An existing session expired or was rejected.
    setToken(null);
    onUnauthorized();
    throw new ApiError("Your session expired. Please log in again.", 401);
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(data.error || `Request failed (${res.status}).`, res.status);
  }

  return (await res.json()) as T;
}

export const api = {
  login: (password: string) =>
    request<LoginResponse>("/login", { method: "POST", body: JSON.stringify({ password }) }),
  outline: () => request<OutlineResponse>("/outline"),
  cases: () => request<CaseSummary[]>("/cases"),
  score: (body: ScoreRequest) =>
    request<ScoreResponse>("/score", { method: "POST", body: JSON.stringify(body) }),
  stats: () => request<StatsResponse>("/stats"),
};
