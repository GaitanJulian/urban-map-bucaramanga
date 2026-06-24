import React from "react";
import type { ActorRole } from "@umb/shared";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

const ROLE_LABELS: Record<ActorRole, string> = {
  organizer: "Organizador",
  moderator: "Moderador",
  admin: "Administrador"
};

const ROLES: ActorRole[] = ["organizer", "moderator", "admin"];

export function LoginPage() {
  return (
    <WorkspaceShell
      title="Acceso Release 2"
      description="Acceso mínimo para organizadores y moderadores autenticados."
      role="admin"
    >
      <section className="workspace-card workspace-card--login" aria-label="Login mínimo">
        <div className="workspace-card__copy">
          <h2>Ingreso protegido</h2>
          <p>
            Este espacio es un punto de partida de Release 2. La autenticación completa se conectará en un siguiente
            slice; por ahora no valida credenciales reales.
          </p>
        </div>

        <form className="workspace-form" onSubmit={(event) => event.preventDefault()}>
          <label className="workspace-field">
            <span>Email</span>
            <input type="email" placeholder="organizer@urbanmap.local" aria-label="Email" />
          </label>

          <label className="workspace-field">
            <span>Rol</span>
            <select aria-label="Rol">
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="workspace-button workspace-button--primary">
            Entrar
          </button>
        </form>
      </section>
    </WorkspaceShell>
  );
}
