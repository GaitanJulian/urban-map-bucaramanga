import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ActorRole } from "@umb/shared";
import { useAuth } from "../auth/AuthContext";

interface WorkspaceShellProps {
  title: string;
  description: string;
  role: ActorRole;
  children: React.ReactNode;
}

const ROLE_LABELS: Record<ActorRole, string> = {
  organizer: "Organizador",
  moderator: "Moderador",
  admin: "Administrador"
};

export function WorkspaceShell({ title, description, role, children }: WorkspaceShellProps) {
  const { status, actor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="workspace-shell">
      <header className="workspace-shell__header">
        <div>
          <p className="workspace-shell__eyebrow">{ROLE_LABELS[role]}</p>
          <h1 className="workspace-shell__title">{title}</h1>
          <p className="workspace-shell__description">{description}</p>
        </div>

        <nav className="workspace-shell__nav" aria-label="Navegación de workspace">
          <Link to="/" className="workspace-shell__nav-link">
            Descubrimiento
          </Link>

          {status === "authenticated" && actor ? (
            <>
              {actor.activeRole === "admin" ? (
                <Link to="/admin" className="workspace-shell__nav-link">
                  Panel admin
                </Link>
              ) : null}
              <span className="workspace-shell__nav-link" aria-label="Cuenta actual">
                {actor.displayName} ({ROLE_LABELS[actor.activeRole]})
              </span>
              <button type="button" className="workspace-shell__nav-link workspace-shell__logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="workspace-shell__nav-link">
              Ingreso
            </Link>
          )}
        </nav>
      </header>

      <main className="workspace-shell__content">{children}</main>
    </div>
  );
}
