import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo root (parent of client/) — allow Vite to serve the @dci/shared source.
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  server: {
    port: 5173,
    fs: { allow: [repoRoot] },
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
