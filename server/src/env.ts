import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/** Repo root, two levels up from server/src. */
export const REPO_ROOT = resolve(here, "../..");

// Load .env from the repo root for local dev. On Railway, real env vars are already
// present and take precedence (dotenv does not override existing process.env).
config({ path: resolve(REPO_ROOT, ".env") });

function optional(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

const isProd = optional("NODE_ENV") === "production";

let authSecret = optional("AUTH_SECRET");
if (!authSecret) {
  authSecret = randomBytes(32).toString("hex");
  console.warn(
    "[env] AUTH_SECRET is not set — using an ephemeral secret. " +
      "Sessions will be invalidated on restart. Set AUTH_SECRET in production.",
  );
}

const appPassword = optional("APP_PASSWORD");
if (!appPassword) {
  console.warn("[env] APP_PASSWORD is not set — login will reject all attempts until it is configured.");
}

const openRouterKey = optional("OPENROUTER_API_KEY");
if (!openRouterKey) {
  console.warn("[env] OPENROUTER_API_KEY is not set — scoring requests will fail until it is configured.");
}

export const env = {
  isProd,
  port: Number(optional("PORT", "8080")),
  openRouter: {
    apiKey: openRouterKey,
    model: optional("MODEL", "anthropic/claude-sonnet-4.6"),
    baseUrl: optional("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
    siteUrl: optional("OPENROUTER_SITE_URL"),
    appName: optional("OPENROUTER_APP_NAME", "Discharge Instructions Coach"),
    // Abort a scoring call that stalls, so it returns a clear error instead of hanging
    // until the platform edge proxy gives up with a bodyless 502. Default 90s.
    timeoutMs: Number(optional("OPENROUTER_TIMEOUT_MS", "90000")),
  },
  auth: {
    password: appPassword,
    secret: authSecret,
    tokenTtlSeconds: 12 * 60 * 60,
  },
  db: {
    url: optional("DATABASE_URL"),
    // "true"/"false" override; otherwise TLS off for localhost, on elsewhere.
    sslOverride: optional("DATABASE_SSL"),
  },
} as const;

export const REPO_ROOT_PATH = REPO_ROOT;
