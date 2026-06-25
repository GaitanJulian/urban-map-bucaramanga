import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ActorRole } from "@umb/shared";
import { useAuth } from "../auth/AuthContext";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

interface LoginLocationState {
  reason?: "unauthenticated" | "forbidden";
  from?: string;
}

const WORKSPACE_BY_ROLE: Record<ActorRole, string> = {
  organizer: "/organizer",
  moderator: "/moderation",
  admin: "/admin"
};

function readContextualMessage(state: LoginLocationState | null): string | null {
  if (!state?.reason) {
    return null;
  }

  if (state.reason === "unauthenticated") {
    return "Tu sesión expiró o no has iniciado sesión. Ingresa de nuevo para continuar.";
  }

  return "No tienes permisos para acceder a esa sección con la cuenta actual.";
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const contextualMessage = readContextualMessage((location.state as LoginLocationState | null) ?? null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const actor = await login(email, password);
      navigate(WORKSPACE_BY_ROLE[actor.activeRole]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No pudimos iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WorkspaceShell
      title="Acceso Release 2"
      description="Inicia sesión con tu cuenta de organizador, moderador o administrador."
      role="admin"
    >
      <section className="workspace-card workspace-card--login" aria-label="Ingreso real">
        <div className="workspace-card__copy">
          <h2>Ingreso protegido</h2>
          <p>Inicia sesión con tus credenciales reales para acceder al workspace correspondiente a tu rol.</p>
        </div>

        <form className="workspace-form" onSubmit={handleSubmit}>
          <label className="workspace-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="organizer@urbanmap.local"
              aria-label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="workspace-field">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="workspace-button workspace-button--primary" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>

          {contextualMessage ? <p className="workspace-notice workspace-notice--error">{contextualMessage}</p> : null}
          {errorMessage ? <p className="workspace-notice workspace-notice--error">{errorMessage}</p> : null}
        </form>
      </section>
    </WorkspaceShell>
  );
}
