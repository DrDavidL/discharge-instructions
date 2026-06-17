import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, getToken, setToken, setUnauthorizedHandler } from "./api";

interface AuthContextValue {
  token: string | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    // When any request hits a 401, drop back to the login screen.
    setUnauthorizedHandler(() => setTokenState(null));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      async login(password: string) {
        const { token: t } = await api.login(password);
        setToken(t);
        setTokenState(t);
      },
      logout() {
        setToken(null);
        setTokenState(null);
      },
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
