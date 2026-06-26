#!/usr/bin/env node
// Trojan-source / hidden-character guard.
// Scans tracked text files for dangerous invisible Unicode that can hide malicious
// intent from human reviewers: bidirectional overrides, zero-width characters, and
// other disallowed control codes. Exits non-zero (with a report) if any are found.
//
// Run locally: `node scripts/scan-hidden-chars.mjs`
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Codepoints that should never appear in source. BOM (U+FEFF) is allowed only as the
// very first character of a file; anywhere else it's treated as a zero-width space.
const FORBIDDEN = new Map([
  [0x200b, "ZERO WIDTH SPACE"],
  [0x200c, "ZERO WIDTH NON-JOINER"],
  [0x200d, "ZERO WIDTH JOINER"],
  [0x2060, "WORD JOINER"],
  [0x202a, "LEFT-TO-RIGHT EMBEDDING"],
  [0x202b, "RIGHT-TO-LEFT EMBEDDING"],
  [0x202c, "POP DIRECTIONAL FORMATTING"],
  [0x202d, "LEFT-TO-RIGHT OVERRIDE"],
  [0x202e, "RIGHT-TO-LEFT OVERRIDE"],
  [0x2066, "LEFT-TO-RIGHT ISOLATE"],
  [0x2067, "RIGHT-TO-LEFT ISOLATE"],
  [0x2068, "FIRST STRONG ISOLATE"],
  [0x2069, "POP DIRECTIONAL ISOLATE"],
  [0x00ad, "SOFT HYPHEN"],
]);

// Binary/non-source files we don't scan.
const SKIP_EXT = /\.(png|jpe?g|gif|webp|ico|svg|pdf|docx?|xlsx?|woff2?|ttf|eot|lock)$/i;

function trackedFiles() {
  return execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((f) => !SKIP_EXT.test(f));
}

let problems = 0;
for (const file of trackedFiles()) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue; // unreadable/binary
  }
  let line = 1;
  let col = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.codePointAt(0);
    if (ch === "\n") {
      line++;
      col = 0;
      continue;
    }
    col++;
    const isLeadingBom = code === 0xfeff && i === 0;
    const flagged = FORBIDDEN.get(code) ?? (code === 0xfeff && !isLeadingBom ? "ZERO WIDTH NO-BREAK SPACE (BOM)" : null);
    if (flagged) {
      problems++;
      console.error(`${file}:${line}:${col}  U+${code.toString(16).toUpperCase().padStart(4, "0")} ${flagged}`);
    }
  }
}

if (problems > 0) {
  console.error(`\n✗ Hidden-character scan failed: ${problems} disallowed character(s) found.`);
  process.exit(1);
}
console.log("✓ Hidden-character scan passed: no disallowed invisible Unicode found.");
