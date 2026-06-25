import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { createOrganizerDraft, listOrganizerDrafts, OrganizerDraftApiError, saveOrganizerDraft, submitOrganizerDraft, updateOrganizerDraft, validateOrganizerDraft } from "../api/organizerDrafts";
import { StatusBadge } from "../ui/StatusBadge";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";
const EMPTY_EDITOR = {
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
    { value: "cat_music", label: "Música" },
    { value: "cat_culture", label: "Cultura" },
    { value: "cat_food", label: "Gastronomía" }
];
const ZONE_OPTIONS = [
    { value: "zone_cabecera", label: "Cabecera del Llano" },
    { value: "zone_centro", label: "Centro" }
];
function toEditorState(draft) {
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
function toDateTimeLocalValue(value) {
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
        const response = await mutateSelectedDraft((draftId) => submitOrganizerDraft(draftId), "Borrador enviado a revisión.");
        if (response) {
            setValidationIssues([]);
            setIsValid(true);
        }
    };
    return (_jsx(WorkspaceShell, { title: "Workspace de Organizador", description: "Crea, valida y env\u00EDa tus eventos a revisi\u00F3n antes de publicarlos.", role: "organizer", children: _jsxs("section", { className: "organizer-workspace", children: [_jsxs("aside", { className: "workspace-card organizer-workspace__sidebar", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Borradores" }), _jsx("p", { children: "Contenido real de Event Publication." })] }), _jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: handleCreateDraft, disabled: isMutating, children: "Crear borrador" }), _jsxs("div", { className: "draft-list", "aria-live": "polite", children: [isLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando borradores..." }) : null, !isLoading && drafts.length === 0 ? _jsx("div", { className: "workspace-placeholder", children: "No hay borradores creados." }) : null, drafts.map((draft) => (_jsxs("button", { className: `draft-list__item${draft.draftId === selectedDraftId ? " is-selected" : ""}`, type: "button", onClick: () => setSelectedDraftId(draft.draftId), children: [_jsx("span", { className: "draft-list__title", children: draft.title || "Borrador sin título" }), _jsx(StatusBadge, { value: draft.publicationStatus })] }, draft.draftId)))] })] }), _jsxs("article", { className: "workspace-card organizer-workspace__editor", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Editor" }), _jsx("p", { children: "Datos principales del evento para env\u00EDo a revisi\u00F3n." })] }), selectedDraft ? (_jsxs("form", { className: "workspace-form organizer-form", onSubmit: (event) => event.preventDefault(), children: [_jsxs("section", { className: "organizer-form__section", children: [_jsx("h3", { className: "organizer-form__section-title", children: "Informaci\u00F3n b\u00E1sica" }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-title", children: [_jsx("span", { children: "T\u00EDtulo" }), _jsx("input", { id: "draft-title", value: editor.title, onChange: (event) => patchEditor({ title: event.target.value }), placeholder: "Nombre del evento", maxLength: 180 })] }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-summary", children: [_jsx("span", { children: "Resumen" }), _jsx("input", { id: "draft-summary", value: editor.summary, onChange: (event) => patchEditor({ summary: event.target.value }), placeholder: "Resumen corto", maxLength: 280 })] }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-description", children: [_jsx("span", { children: "Descripci\u00F3n" }), _jsx("textarea", { id: "draft-description", value: editor.description, onChange: (event) => patchEditor({ description: event.target.value }), placeholder: "Descripci\u00F3n larga del borrador", rows: 8 })] })] }), _jsxs("section", { className: "organizer-form__section", children: [_jsx("h3", { className: "organizer-form__section-title", children: "Categor\u00EDa y zona" }), _jsxs("div", { className: "organizer-form__grid", children: [_jsxs("label", { className: "workspace-field", htmlFor: "draft-category", children: [_jsx("span", { children: "Categor\u00EDa" }), _jsxs("select", { id: "draft-category", value: editor.categoryId, onChange: (event) => patchEditor({ categoryId: event.target.value }), children: [_jsx("option", { value: "", children: "Selecciona categor\u00EDa" }), CATEGORY_OPTIONS.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-zone", children: [_jsx("span", { children: "Zona" }), _jsxs("select", { id: "draft-zone", value: editor.zoneId, onChange: (event) => patchEditor({ zoneId: event.target.value }), children: [_jsx("option", { value: "", children: "Selecciona zona" }), ZONE_OPTIONS.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] })] })] })] }), _jsxs("section", { className: "organizer-form__section", children: [_jsx("h3", { className: "organizer-form__section-title", children: "Lugar y fecha" }), _jsxs("div", { className: "organizer-form__grid", children: [_jsxs("label", { className: "workspace-field", htmlFor: "draft-venue", children: [_jsx("span", { children: "Lugar" }), _jsx("input", { id: "draft-venue", value: editor.venueName, onChange: (event) => patchEditor({ venueName: event.target.value }), placeholder: "Nombre del lugar", maxLength: 180 })] }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-address", children: [_jsx("span", { children: "Direcci\u00F3n" }), _jsx("input", { id: "draft-address", value: editor.address, onChange: (event) => patchEditor({ address: event.target.value }), placeholder: "Direcci\u00F3n o referencia", maxLength: 280 })] })] }), _jsxs("div", { className: "organizer-form__grid", children: [_jsxs("label", { className: "workspace-field", htmlFor: "draft-starts-at", children: [_jsx("span", { children: "Inicio" }), _jsx("input", { id: "draft-starts-at", type: "datetime-local", value: editor.startsAt, onChange: (event) => patchEditor({ startsAt: event.target.value }) })] }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-ends-at", children: [_jsx("span", { children: "Fin" }), _jsx("input", { id: "draft-ends-at", type: "datetime-local", value: editor.endsAt, onChange: (event) => patchEditor({ endsAt: event.target.value }) })] })] })] }), _jsxs("section", { className: "organizer-form__section", children: [_jsx("h3", { className: "organizer-form__section-title", children: "Costo" }), _jsxs("div", { className: "organizer-form__cost", children: [_jsxs("label", { className: "workspace-field workspace-field--checkbox", htmlFor: "draft-is-free", children: [_jsx("input", { id: "draft-is-free", type: "checkbox", checked: editor.isFree, onChange: (event) => patchEditor({
                                                                isFree: event.target.checked,
                                                                costLabel: event.target.checked ? "Gratis" : editor.costLabel
                                                            }) }), _jsx("span", { children: "Evento gratuito" })] }), _jsxs("label", { className: "workspace-field", htmlFor: "draft-cost-label", children: [_jsx("span", { children: "Costo" }), _jsx("input", { id: "draft-cost-label", value: editor.costLabel, onChange: (event) => patchEditor({ costLabel: event.target.value }), placeholder: editor.isFree ? "Gratis" : "Ej. $25.000", maxLength: 80 })] })] })] }), _jsxs("div", { className: "organizer-actions", children: [_jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: handleSaveDraft, disabled: isMutating, children: "Guardar" }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: handleValidateDraft, disabled: isMutating, children: "Validar" }), _jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: handleSubmitDraft, disabled: isMutating, children: "Enviar a revisi\u00F3n" })] })] })) : (_jsx("div", { className: "workspace-placeholder", children: "Crea o selecciona un borrador para editarlo." }))] }), _jsxs("aside", { className: "workspace-card organizer-workspace__status", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Estado" }), _jsx("p", { children: "Resultado actual del flujo de publicaci\u00F3n." })] }), selectedDraft ? (_jsxs("dl", { className: "draft-status", children: [_jsxs("div", { children: [_jsx("dt", { children: "Estado de publicaci\u00F3n" }), _jsx("dd", { children: _jsx(StatusBadge, { value: selectedDraft.publicationStatus }) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Caso de publicaci\u00F3n" }), _jsx("dd", { children: selectedDraft.publicationCaseId ?? "Sin caso" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Estado del caso" }), _jsx("dd", { children: _jsx(StatusBadge, { value: selectedDraft.publicationCaseStatus, fallback: "Sin caso" }) })] })] })) : (_jsx("div", { className: "workspace-placeholder", children: "Sin borrador seleccionado." })), notice ? _jsx("p", { className: "workspace-notice workspace-notice--success", children: notice }) : null, errorMessage ? _jsx("p", { className: "workspace-notice workspace-notice--error", children: errorMessage }) : null, _jsxs("section", { className: "validation-panel", "aria-live": "polite", children: [_jsx("h3", { children: "Problemas de validaci\u00F3n" }), isValid === true ? _jsx("p", { className: "validation-panel__empty", children: "Sin problemas de validaci\u00F3n." }) : null, validationIssues.length > 0 ? (_jsx("ul", { children: validationIssues.map((issue) => (_jsx("li", { children: issue }, issue))) })) : null, isValid !== true && validationIssues.length === 0 ? (_jsx("p", { className: "validation-panel__empty", children: "Valida el borrador para ver los problemas detectados." })) : null] })] })] }) }));
}
//# sourceMappingURL=OrganizerWorkspacePage.js.map