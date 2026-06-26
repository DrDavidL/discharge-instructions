import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

// Flat config (ESLint 9). One config for the whole monorepo:
// - client: browser globals + React Hooks rules
// - server / shared / scripts: Node globals
export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.config.js", "**/*.config.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Allow intentionally-unused identifiers prefixed with `_` (e.g. rest-destructure drops).
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ["client/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Perf-style rule (react-hooks v6) that flags the standard "fetch + setState on mount"
      // pattern used by our data panels. Keep the correctness rules (rules-of-hooks); allow this.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["server/**/*.ts", "shared/**/*.ts", "scripts/**/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },
);
