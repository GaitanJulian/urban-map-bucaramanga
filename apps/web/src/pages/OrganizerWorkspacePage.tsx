import React, { useEffect, useMemo, useState } from "react";
import {
  createOrganizerDraft,
  listOrganizerDrafts,
  OrganizerDraftApiError,
  saveOrganizerDraft,
  submitOrganizerDraft,
  updateOrganizerDraft,
  validateOrganizerDraft
} from "../api/organizerDrafts";
import type { DraftEditorState, DraftMutationResponse, OrganizerDraft } from "../types/organizerDrafts";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

const EMPTY_EDITOR: DraftEditorState = {
  title: "",
  summary: "",
  description: ""
};

function toEditorState(draft: OrganizerDraft | null): DraftEditorState {
  if (!draft) {
    return EMPTY_EDITOR;
  }

  return {
    title: draft.title,
    summary: draft.summary ?? "",
    description: draft.description ?? ""
  };
}

function statusLabel(value: string | null | undefined): string {
  if (!value) {
    return "Sin caso";
  }

  return value.replace(/_/g, " ");
}

function readErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function OrganizerWorkspacePage() {
  const [drafts, setDrafts] = useState<OrganizerDraft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [editor, setEditor] = useState<DraftEditorState>(EMPTY_EDITOR);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selectedDraft = useMemo(
    () => drafts.find((draft) => draft.draftId === selectedDraftId) ?? null,
    [drafts, selectedDraftId]
  );

  const loadDrafts = async (preferredDraftId?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await listOrganizerDrafts();
      setDrafts(response);

      const nextSelectedId =
        preferredDraftId ??
        (selectedDraftId && response.some((draft) => draft.draftId === selectedDraftId) ? selectedDraftId : response[0]?.draftId ?? null);

      setSelectedDraftId(nextSelectedId);
    } catch (error) {
      setErrorMessage(readErrorMessage(error, "No pudimos cargar los borradores."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDrafts();
    // Initial load only; selection is reconciled inside loadDrafts after mutations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEditor(toEditorState(selectedDraft));
    setValidationIssues([]);
    setIsValid(null);
    setNotice(null);
  }, [selectedDraft]);

  const patchEditor = (patch: Partial<DraftEditorState>) => {
    setEditor((current) => ({
      ...current,
      ...patch
    }));
  };

  const mutateSelectedDraft = async (
    action: (draftId: string) => Promise<DraftMutationResponse>,
    successMessage: string
  ): Promise<DraftMutationResponse | null> => {
    if (!selectedDraftId) {
      return null;
    }

    setIsMutating(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      const updateResponse = await updateOrganizerDraft(selectedDraftId, editor);
      const actionResponse = await action(selectedDraftId);
      const mergedResponse = {
        ...updateResponse,
        ...actionResponse
      };

      setNotice(successMessage);
      await loadDrafts(selectedDraftId);
      return mergedResponse;
    } catch (error) {
      if (error instanceof OrganizerDraftApiError && error.issues.length > 0) {
        setValidationIssues(error.issues);
        setIsValid(false);
      }

      setErrorMessage(readErrorMessage(error, "No pudimos actualizar el borrador."));
      return null;
    } finally {
      setIsMutating(false);
    }
  };

  const handleCreateDraft = async () => {
    setIsMutating(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      const draft = await createOrganizerDraft({
        title: "Nuevo borrador",
        summary: "",
        description: ""
      });

      setNotice("Borrador creado.");
      await loadDrafts(draft.draftId);
    } catch (error) {
      setErrorMessage(readErrorMessage(error, "No pudimos crear el borrador."));
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveDraft = async () => {
    await mutateSelectedDraft((draftId) => saveOrganizerDraft(draftId), "Borrador guardado.");
  };

  const handleValidateDraft = async () => {
    if (!selectedDraftId) {
      return;
    }

    setIsMutating(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      await updateOrganizerDraft(selectedDraftId, editor);
      const response = await validateOrganizerDraft(selectedDraftId);
      setValidationIssues(response.issues);
      setIsValid(response.isValid);
      setNotice(response.isValid ? "Borrador listo para enviar." : "Faltan campos obligatorios.");
      await loadDrafts(selectedDraftId);
    } catch (error) {
      setErrorMessage(readErrorMessage(error, "No pudimos validar el borrador."));
    } finally {
      setIsMutating(false);
    }
  };

  const handleSubmitDraft = async () => {
    const response = await mutateSelectedDraft((draftId) => submitOrganizerDraft(draftId), "Borrador enviado a revision.");

    if (response) {
      setValidationIssues([]);
      setIsValid(true);
    }
  };

  return (
    <WorkspaceShell
      title="Workspace de Organizador"
      description="Borradores, validacion minima y envio a revision conectados al backend v2."
      role="organizer"
    >
      <section className="organizer-workspace">
        <aside className="workspace-card organizer-workspace__sidebar">
          <div className="workspace-card__copy">
            <h2>Borradores</h2>
            <p>Contenido real de Event Publication.</p>
          </div>

          <button className="workspace-button workspace-button--primary" type="button" onClick={handleCreateDraft} disabled={isMutating}>
            Crear draft
          </button>

          <div className="draft-list" aria-live="polite">
            {isLoading ? <div className="workspace-placeholder">Cargando borradores...</div> : null}

            {!isLoading && drafts.length === 0 ? <div className="workspace-placeholder">No hay borradores creados.</div> : null}

            {drafts.map((draft) => (
              <button
                className={`draft-list__item${draft.draftId === selectedDraftId ? " is-selected" : ""}`}
                type="button"
                key={draft.draftId}
                onClick={() => setSelectedDraftId(draft.draftId)}
              >
                <span className="draft-list__title">{draft.title}</span>
                <span className="draft-list__meta">{statusLabel(draft.publicationStatus)}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="workspace-card organizer-workspace__editor">
          <div className="workspace-card__copy">
            <h2>Editor</h2>
            <p>Campos disponibles para este slice: titulo, resumen y descripcion.</p>
          </div>

          {selectedDraft ? (
            <form className="workspace-form organizer-form" onSubmit={(event) => event.preventDefault()}>
              <label className="workspace-field">
                <span>Titulo</span>
                <input
                  value={editor.title}
                  onChange={(event) => patchEditor({ title: event.target.value })}
                  placeholder="Nombre del evento"
                  maxLength={180}
                />
              </label>

              <label className="workspace-field">
                <span>Resumen</span>
                <input
                  value={editor.summary}
                  onChange={(event) => patchEditor({ summary: event.target.value })}
                  placeholder="Resumen corto"
                  maxLength={280}
                />
              </label>

              <label className="workspace-field">
                <span>Descripcion</span>
                <textarea
                  value={editor.description}
                  onChange={(event) => patchEditor({ description: event.target.value })}
                  placeholder="Descripcion larga del borrador"
                  rows={8}
                />
              </label>

              <div className="organizer-actions">
                <button className="workspace-button workspace-button--primary" type="button" onClick={handleSaveDraft} disabled={isMutating}>
                  Guardar
                </button>
                <button className="workspace-button workspace-button--secondary" type="button" onClick={handleValidateDraft} disabled={isMutating}>
                  Validar
                </button>
                <button className="workspace-button workspace-button--primary" type="button" onClick={handleSubmitDraft} disabled={isMutating}>
                  Enviar a revision
                </button>
              </div>
            </form>
          ) : (
            <div className="workspace-placeholder">Crea o selecciona un borrador para editarlo.</div>
          )}
        </article>

        <aside className="workspace-card organizer-workspace__status">
          <div className="workspace-card__copy">
            <h2>Estado</h2>
            <p>Resultado actual del flujo de publicacion.</p>
          </div>

          {selectedDraft ? (
            <dl className="draft-status">
              <div>
                <dt>Publication status</dt>
                <dd>{statusLabel(selectedDraft.publicationStatus)}</dd>
              </div>
              <div>
                <dt>Publication case</dt>
                <dd>{selectedDraft.publicationCaseId ?? "Sin caso"}</dd>
              </div>
              <div>
                <dt>Case status</dt>
                <dd>{statusLabel(selectedDraft.publicationCaseStatus)}</dd>
              </div>
            </dl>
          ) : (
            <div className="workspace-placeholder">Sin borrador seleccionado.</div>
          )}

          {notice ? <p className="workspace-notice workspace-notice--success">{notice}</p> : null}
          {errorMessage ? <p className="workspace-notice workspace-notice--error">{errorMessage}</p> : null}

          <section className="validation-panel" aria-live="polite">
            <h3>Validation issues</h3>
            {isValid === true ? <p className="validation-panel__empty">Sin issues de validacion.</p> : null}
            {validationIssues.length > 0 ? (
              <ul>
                {validationIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : null}
            {isValid !== true && validationIssues.length === 0 ? (
              <p className="validation-panel__empty">Valida el borrador para ver issues.</p>
            ) : null}
          </section>
        </aside>
      </section>
    </WorkspaceShell>
  );
}
