import React from "react";
import type { ActorRole } from "@umb/shared";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

const ROLES: ActorRole[] = ["organizer", "moderator", "admin"];

export function LoginPage() {
  return (
    <WorkspaceShell
      title="Acceso Release 2"
      description="Scaffold mínimo para organizadores y moderadores autenticados."
      role="admin"
    >
      <section className="workspace-card workspace-card--login" aria-label="Login mínimo">
        <div className="workspace-card__copy">
          <h2>Ingreso protegido</h2>
          <p>
            Este espacio es solo un placeholder de Release 2. La autenticación completa se conectará en el siguiente
            slice.
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
                  {role}
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
