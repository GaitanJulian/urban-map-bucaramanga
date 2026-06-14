import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { createOrganizerDraft, listOrganizerDrafts, OrganizerDraftApiError, saveOrganizerDraft, submitOrganizerDraft, updateOrganizerDraft, validateOrganizerDraft } from "../api/organizerDrafts";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";
const EMPTY_EDITOR = {
    title: "",
    summary: "",
    description: ""
};
function toEditorState(draft) {
    if (!draft) {
        return EMPTY_EDITOR;
    }
    return {
        title: draft.title,
        summary: draft.summary ?? "",
        description: draft.description ?? ""
    };
}
function statusLabel(value) {
    if (!value) {
        return "Sin caso";
    }
    return value.replace(/_/g, " ");
}
function readErrorMessage(error, fallback) {
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}
export function OrganizerWorkspacePage() {
    const [drafts, setDrafts] = useState([]);
    const [selectedDraftId, setSelectedDraftId] = useState(null);
    const [editor, setEditor] = useState(EMPTY_EDITOR);
    const [validationIssues, setValidationIssues] = useState([]);
    const [isValid, setIsValid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [notice, setNotice] = useState(null);
    const selectedDraft = useMemo(() => drafts.find((draft) => draft.draftId === selectedDraftId) ?? null, [drafts, selectedDraftId]);
    const loadDrafts = async (preferredDraftId) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await listOrganizerDrafts();
            setDrafts(response);
            const nextSelectedId = preferredDraftId ??
                (selectedDraftId && response.some((draft) => draft.draftId === selectedDraftId) ? selectedDraftId : response[0]?.draftId ?? null);
            setSelectedDraftId(nextSelectedId);
        }
        catch (error) {
            setErrorMessage(readErrorMessage(error, "No pudimos cargar los borradores."));
        }
        finally {
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
    const patchEditor = (patch) => {
        setEditor((current) => ({
            ...current,
            ...patch
        }));
    };
    const mutateSelectedDraft = async (action, successMessage) => {
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
        }
        catch (error) {
            if (error instanceof OrganizerDraftApiError && error.issues.length > 0) {
                setValidationIssues(error.issues);
                setIsValid(false);
            }
            setErrorMessage(readErrorMessage(error, "No pudimos actualizar el borrador."));
            return null;
        }
        finally {
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
        }
        catch (error) {
            setErrorMessage(readErrorMessage(error, "No pudimos crear el borrador."));
        }
        finally {
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
        }
        catch (error) {
            setErrorMessage(readErrorMessage(error, "No pudimos validar el borrador."));
        }
        finally {
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
    return (_jsx(WorkspaceShell, { title: "Workspace de Organizador", description: "Borradores, validacion minima y envio a revision conectados al backend v2.", role: "organizer", children: _jsxs("section", { className: "organizer-workspace", children: [_jsxs("aside", { className: "workspace-card organizer-workspace__sidebar", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Borradores" }), _jsx("p", { children: "Contenido real de Event Publication." })] }), _jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: handleCreateDraft, disabled: isMutating, children: "Crear draft" }), _jsxs("div", { className: "draft-list", "aria-live": "polite", children: [isLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando borradores..." }) : null, !isLoading && drafts.length === 0 ? _jsx("div", { className: "workspace-placeholder", children: "No hay borradores creados." }) : null, drafts.map((draft) => (_jsxs("button", { className: `draft-list__item${draft.draftId === selectedDraftId ? " is-selected" : ""}`, type: "button", onClick: () => setSelectedDraftId(draft.draftId), children: [_jsx("span", { className: "draft-list__title", children: draft.title }), _jsx("span", { className: "draft-list__meta", children: statusLabel(draft.publicationStatus) })] }, draft.draftId)))] })] }), _jsxs("article", { className: "workspace-card organizer-workspace__editor", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Editor" }), _jsx("p", { children: "Campos disponibles para este slice: titulo, resumen y descripcion." })] }), selectedDraft ? (_jsxs("form", { className: "workspace-form organizer-form", onSubmit: (event) => event.preventDefault(), children: [_jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Titulo" }), _jsx("input", { value: editor.title, onChange: (event) => patchEditor({ title: event.target.value }), placeholder: "Nombre del evento", maxLength: 180 })] }), _jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Resumen" }), _jsx("input", { value: editor.summary, onChange: (event) => patchEditor({ summary: event.target.value }), placeholder: "Resumen corto", maxLength: 280 })] }), _jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Descripcion" }), _jsx("textarea", { value: editor.description, onChange: (event) => patchEditor({ description: event.target.value }), placeholder: "Descripcion larga del borrador", rows: 8 })] }), _jsxs("div", { className: "organizer-actions", children: [_jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: handleSaveDraft, disabled: isMutating, children: "Guardar" }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: handleValidateDraft, disabled: isMutating, children: "Validar" }), _jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: handleSubmitDraft, disabled: isMutating, children: "Enviar a revision" })] })] })) : (_jsx("div", { className: "workspace-placeholder", children: "Crea o selecciona un borrador para editarlo." }))] }), _jsxs("aside", { className: "workspace-card organizer-workspace__status", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Estado" }), _jsx("p", { children: "Resultado actual del flujo de publicacion." })] }), selectedDraft ? (_jsxs("dl", { className: "draft-status", children: [_jsxs("div", { children: [_jsx("dt", { children: "Publication status" }), _jsx("dd", { children: statusLabel(selectedDraft.publicationStatus) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Publication case" }), _jsx("dd", { children: selectedDraft.publicationCaseId ?? "Sin caso" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Case status" }), _jsx("dd", { children: statusLabel(selectedDraft.publicationCaseStatus) })] })] })) : (_jsx("div", { className: "workspace-placeholder", children: "Sin borrador seleccionado." })), notice ? _jsx("p", { className: "workspace-notice workspace-notice--success", children: notice }) : null, errorMessage ? _jsx("p", { className: "workspace-notice workspace-notice--error", children: errorMessage }) : null, _jsxs("section", { className: "validation-panel", "aria-live": "polite", children: [_jsx("h3", { children: "Validation issues" }), isValid === true ? _jsx("p", { className: "validation-panel__empty", children: "Sin issues de validacion." }) : null, validationIssues.length > 0 ? (_jsx("ul", { children: validationIssues.map((issue) => (_jsx("li", { children: issue }, issue))) })) : null, isValid !== true && validationIssues.length === 0 ? (_jsx("p", { className: "validation-panel__empty", children: "Valida el borrador para ver issues." })) : null] })] })] }) }));
}
//# sourceMappingURL=OrganizerWorkspacePage.js.map