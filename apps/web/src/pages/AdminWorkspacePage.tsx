import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminOrganizersApiError, listAdminOrganizers } from "../api/adminOrganizers";
import type { AdminOrganizer } from "../types/adminOrganizers";
import { StatusBadge } from "../ui/StatusBadge";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

function readErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AdminOrganizersApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function AdminWorkspacePage() {
  const [organizers, setOrganizers] = useState<AdminOrganizer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await listAdminOrganizers();
        if (isMounted) {
          setOrganizers(response);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(readErrorMessage(error, "No pudimos cargar los organizadores."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <WorkspaceShell
      title="Panel de Administración"
      description="Vista mínima para el rol administrador: organizadores curados y accesos rápidos."
      role="admin"
    >
      <section className="workspace-grid">
        <article className="workspace-card" aria-label="Organizadores curados">
          <div className="workspace-card__copy">
            <h2>Organizadores</h2>
            <p>Organizadores curados administrados desde Identity & Access.</p>
          </div>

          {isLoading ? <div className="workspace-placeholder">Cargando organizadores...</div> : null}

          {!isLoading && errorMessage ? <p className="workspace-notice workspace-notice--error">{errorMessage}</p> : null}

          {!isLoading && !errorMessage && organizers.length === 0 ? (
            <div className="workspace-placeholder">No hay organizadores curados todavía.</div>
          ) : null}

          {!isLoading && !errorMessage && organizers.length > 0 ? (
            <div className="draft-list">
              {organizers.map((organizer) => (
                <div className="draft-list__item" key={organizer.organizerId}>
                  <span className="draft-list__title">{organizer.organizationName}</span>
                  <StatusBadge value={organizer.verificationState} />
                </div>
              ))}
            </div>
          ) : null}
        </article>

        <article className="workspace-card" aria-label="Accesos rápidos">
          <div className="workspace-card__copy">
            <h2>Accesos rápidos</h2>
            <p>Atajos a los workspaces operativos de la plataforma.</p>
          </div>

          <div className="draft-list">
            <Link className="draft-list__item" to="/">
              <span className="draft-list__title">Discovery público</span>
            </Link>
            <Link className="draft-list__item" to="/organizer">
              <span className="draft-list__title">Organizer Workspace</span>
            </Link>
            <Link className="draft-list__item" to="/moderation">
              <span className="draft-list__title">Moderation Workspace</span>
            </Link>
          </div>
        </article>
      </section>
    </WorkspaceShell>
  );
}
