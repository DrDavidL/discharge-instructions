import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./auth";
import { App } from "./App";
import "./theme.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
