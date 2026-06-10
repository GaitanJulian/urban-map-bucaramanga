import React from "react";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

export function OrganizerWorkspacePage() {
  return (
    <WorkspaceShell
      title="Workspace de Organizador"
      description="Borradores, validación mínima y envío a revisión en modo scaffold."
      role="organizer"
    >
      <section className="workspace-grid">
        <article className="workspace-card">
          <div className="workspace-card__copy">
            <h2>Borradores</h2>
            <p>Listado placeholder para los eventos en preparación.</p>
          </div>
          <div className="workspace-placeholder">Aún no hay lógica de drafts conectada.</div>
        </article>

        <article className="workspace-card">
          <div className="workspace-card__copy">
            <h2>Editor</h2>
            <p>Espacio reservado para formularios de edición de Release 2.</p>
          </div>
          <div className="workspace-placeholder">El editor funcional llegará en el siguiente slice.</div>
        </article>

        <article className="workspace-card workspace-card--wide">
          <div className="workspace-card__copy">
            <h2>Validación y envío</h2>
            <p>Ruta mínima para revisar el estado de un draft antes de enviarlo a moderación.</p>
          </div>
          <div className="workspace-placeholder">Validación y submit quedan como estructura preparada.</div>
        </article>
      </section>
    </WorkspaceShell>
  );
}
