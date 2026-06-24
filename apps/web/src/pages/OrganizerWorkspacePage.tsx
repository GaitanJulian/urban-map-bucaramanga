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
import { StatusBadge } from "../ui/StatusBadge";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

const EMPTY_EDITOR: DraftEditorState = {
  title: "",
  summary: "",
  description: "",
  categoryId: "",
  zoneId: "",
  venueName: "",
  address: "",
  startsAt: "",
  endsAt: "",
  isFree: false,
  costLabel: ""
};

const CATEGORY_OPTIONS = [
  { value: "cat_music", label: "Musica" },
  { value: "cat_culture", label: "Cultura" },
  { value: "cat_food", label: "Gastronomia" }
];

const ZONE_OPTIONS = [
  { value: "zone_cabecera", label: "Cabecera del Llano" },
  { value: "zone_centro", label: "Centro" }
];

function toEditorState(draft: OrganizerDraft | null): DraftEditorState {
  if (!draft) {
    return EMPTY_EDITOR;
  }

  return {
    title: draft.title,
    summary: draft.summary ?? "",
    description: draft.description ?? "",
    categoryId: draft.categoryId ?? "",
    zoneId: draft.zoneId ?? "",
    venueName: draft.venueName ?? "",
    address: draft.address ?? "",
    startsAt: toDateTimeLocalValue(draft.startsAt),
    endsAt: toDateTimeLocalValue(draft.endsAt),
    isFree: draft.isFree,
    costLabel: draft.costLabel ?? ""
  };
}

function toDateTimeLocalValue(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
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
        description: "",
        categoryId: "",
        zoneId: "",
        venueName: "",
        address: "",
        startsAt: "",
        endsAt: "",
        isFree: false,
        costLabel: ""
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
                <span className="draft-list__title">{draft.title || "Borrador sin titulo"}</span>
                <StatusBadge value={draft.publicationStatus} />
              </button>
            ))}
          </div>
        </aside>

        <article className="workspace-card organizer-workspace__editor">
          <div className="workspace-card__copy">
            <h2>Editor</h2>
            <p>Datos principales del evento para envio a revision.</p>
          </div>

          {selectedDraft ? (
            <form className="workspace-form organizer-form" onSubmit={(event) => event.preventDefault()}>
              <section className="organizer-form__section">
                <h3 className="organizer-form__section-title">Informacion basica</h3>

                <label className="workspace-field" htmlFor="draft-title">
                  <span>Titulo</span>
                  <input
                    id="draft-title"
                    value={editor.title}
                    onChange={(event) => patchEditor({ title: event.target.value })}
                    placeholder="Nombre del evento"
                    maxLength={180}
                  />
                </label>

                <label className="workspace-field" htmlFor="draft-summary">
                  <span>Resumen</span>
                  <input
                    id="draft-summary"
                    value={editor.summary}
                    onChange={(event) => patchEditor({ summary: event.target.value })}
                    placeholder="Resumen corto"
                    maxLength={280}
                  />
                </label>

                <label className="workspace-field" htmlFor="draft-description">
                  <span>Descripcion</span>
                  <textarea
                    id="draft-description"
                    value={editor.description}
                    onChange={(event) => patchEditor({ description: event.target.value })}
                    placeholder="Descripcion larga del borrador"
                    rows={8}
                  />
                </label>
              </section>

              <section className="organizer-form__section">
                <h3 className="organizer-form__section-title">Categoria y zona</h3>

                <div className="organizer-form__grid">
                  <label className="workspace-field" htmlFor="draft-category">
                    <span>Categoria</span>
                    <select
                      id="draft-category"
                      value={editor.categoryId}
                      onChange={(event) => patchEditor({ categoryId: event.target.value })}
                    >
                      <option value="">Selecciona categoria</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="workspace-field" htmlFor="draft-zone">
                    <span>Zona</span>
                    <select id="draft-zone" value={editor.zoneId} onChange={(event) => patchEditor({ zoneId: event.target.value })}>
                      <option value="">Selecciona zona</option>
                      {ZONE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="organizer-form__section">
                <h3 className="organizer-form__section-title">Lugar y fecha</h3>

                <div className="organizer-form__grid">
                  <label className="workspace-field" htmlFor="draft-venue">
                    <span>Lugar</span>
                    <input
                      id="draft-venue"
                      value={editor.venueName}
                      onChange={(event) => patchEditor({ venueName: event.target.value })}
                      placeholder="Nombre del lugar"
                      maxLength={180}
                    />
                  </label>

                  <label className="workspace-field" htmlFor="draft-address">
                    <span>Direccion</span>
                    <input
                      id="draft-address"
                      value={editor.address}
                      onChange={(event) => patchEditor({ address: event.target.value })}
                      placeholder="Direccion o referencia"
                      maxLength={280}
                    />
                  </label>
                </div>

                <div className="organizer-form__grid">
                  <label className="workspace-field" htmlFor="draft-starts-at">
                    <span>Inicio</span>
                    <input
                      id="draft-starts-at"
                      type="datetime-local"
                      value={editor.startsAt}
                      onChange={(event) => patchEditor({ startsAt: event.target.value })}
                    />
                  </label>

                  <label className="workspace-field" htmlFor="draft-ends-at">
                    <span>Fin</span>
                    <input
                      id="draft-ends-at"
                      type="datetime-local"
                      value={editor.endsAt}
                      onChange={(event) => patchEditor({ endsAt: event.target.value })}
                    />
                  </label>
                </div>
              </section>

              <section className="organizer-form__section">
                <h3 className="organizer-form__section-title">Costo</h3>

                <div className="organizer-form__cost">
                  <label className="workspace-field workspace-field--checkbox" htmlFor="draft-is-free">
                    <input
                      id="draft-is-free"
                      type="checkbox"
                      checked={editor.isFree}
                      onChange={(event) =>
                        patchEditor({
                          isFree: event.target.checked,
                          costLabel: event.target.checked ? "Gratis" : editor.costLabel
                        })
                      }
                    />
                    <span>Evento gratuito</span>
                  </label>

                  <label className="workspace-field" htmlFor="draft-cost-label">
                    <span>Costo</span>
                    <input
                      id="draft-cost-label"
                      value={editor.costLabel}
                      onChange={(event) => patchEditor({ costLabel: event.target.value })}
                      placeholder={editor.isFree ? "Gratis" : "Ej. $25.000"}
                      maxLength={80}
                    />
                  </label>
                </div>
              </section>

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
                <dd>
                  <StatusBadge value={selectedDraft.publicationStatus} />
                </dd>
              </div>
              <div>
                <dt>Publication case</dt>
                <dd>{selectedDraft.publicationCaseId ?? "Sin caso"}</dd>
              </div>
              <div>
                <dt>Case status</dt>
                <dd>
                  <StatusBadge value={selectedDraft.publicationCaseStatus} fallback="Sin caso" />
                </dd>
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
