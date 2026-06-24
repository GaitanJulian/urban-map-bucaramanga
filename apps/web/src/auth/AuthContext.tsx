import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentActor, login as loginRequest, logout as logoutRequest } from "../api/auth";
import type { Actor } from "../types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  actor: Actor | null;
  login: (email: string, password: string) => Promise<Actor>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [actor, setActor] = useState<Actor | null>(null);

  const refresh = useCallback(async () => {
    const currentActor = await fetchCurrentActor();
    setActor(currentActor);
    setStatus(currentActor ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const nextActor = await loginRequest(email, password);
    if (!nextActor) {
      throw new Error("Credenciales inválidas. Verifica el email y la contraseña.");
    }
    setActor(nextActor);
    setStatus("authenticated");
    return nextActor;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setActor(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, actor, login, logout, refresh }),
    [status, actor, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}
