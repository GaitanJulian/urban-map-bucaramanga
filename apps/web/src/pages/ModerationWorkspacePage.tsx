import React from "react";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

export function ModerationWorkspacePage() {
  return (
    <WorkspaceShell
      title="Workspace de Moderación"
      description="Cola de revisión, reportes y decisiones de confianza en modo scaffold."
      role="moderator"
    >
      <section className="workspace-grid">
        <article className="workspace-card">
          <div className="workspace-card__copy">
            <h2>Cola pendiente</h2>
            <p>Placeholder de casos enviados a revisión.</p>
          </div>
          <div className="workspace-placeholder">La cola de moderación se conectará después.</div>
        </article>

        <article className="workspace-card">
          <div className="workspace-card__copy">
            <h2>Decisión</h2>
            <p>Espacio reservado para aprobar, rechazar, ocultar o solicitar corrección.</p>
          </div>
          <div className="workspace-placeholder">Las decisiones reales aún no están implementadas.</div>
        </article>

        <article className="workspace-card workspace-card--wide">
          <div className="workspace-card__copy">
            <h2>Reportes protegidos</h2>
            <p>Intake interno para reportes de confianza y casos ambiguos.</p>
          </div>
          <div className="workspace-placeholder">No hay reporte público anónimo en este release.</div>
        </article>
      </section>
    </WorkspaceShell>
  );
}
