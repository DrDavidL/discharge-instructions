import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";

/** Constant-time comparison against the shared class password. */
export function passwordMatches(input: string): boolean {
  if (!env.auth.password) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(env.auth.password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function issueToken(): { token: string; expiresInSeconds: number } {
  const token = jwt.sign({ role: "student" }, env.auth.secret, {
    expiresIn: env.auth.tokenTtlSeconds,
  });
  return { token, expiresInSeconds: env.auth.tokenTtlSeconds };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  try {
    jwt.verify(token, env.auth.secret);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}
