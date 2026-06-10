import React from "react";
import { Link } from "react-router-dom";
import type { ActorRole } from "@umb/shared";

interface WorkspaceShellProps {
  title: string;
  description: string;
  role: ActorRole;
  children: React.ReactNode;
}

export function WorkspaceShell({ title, description, role, children }: WorkspaceShellProps) {
  return (
    <div className="workspace-shell">
      <header className="workspace-shell__header">
        <div>
          <p className="workspace-shell__eyebrow">{role}</p>
          <h1 className="workspace-shell__title">{title}</h1>
          <p className="workspace-shell__description">{description}</p>
        </div>

        <nav className="workspace-shell__nav" aria-label="Navegación de workspace">
          <Link to="/" className="workspace-shell__nav-link">
            Descubrimiento
          </Link>
          <Link to="/login" className="workspace-shell__nav-link">
            Login
          </Link>
        </nav>
      </header>

      <main className="workspace-shell__content">{children}</main>
    </div>
  );
}
