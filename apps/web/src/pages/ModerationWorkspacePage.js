import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { decideModerationCase, getModerationCase, listModerationCases } from "../api/moderationCases";
import { actOnModerationReport, getModerationReport, listModerationReports } from "../api/moderationReports";
import { StatusBadge } from "../ui/StatusBadge";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";
const APPROVAL_REASON = "Contenido aprobado para publicacion.";
function formatDate(value) {
    if (!value) {
        return "Sin fecha";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}
function readErrorMessage(error, fallback) {
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}
function draftTitle(draft) {
    return draft?.title?.trim() || "Borrador sin titulo";
}
function reportTitle(report) {
    return report.targetEventTitle?.trim() || report.targetEventId;
}
export function ModerationWorkspacePage() {
    const [activeTab, setActiveTab] = useState("cases");
    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [selectedCase, setSelectedCase] = useState(null);
    const [caseReason, setCaseReason] = useState("");
    const [isCasesLoading, setIsCasesLoading] = useState(true);
    const [isCaseDetailLoading, setIsCaseDetailLoading] = useState(false);
    const [isCaseMutating, setIsCaseMutating] = useState(false);
    const [caseErrorMessage, setCaseErrorMessage] = useState(null);
    const [caseNotice, setCaseNotice] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportReason, setReportReason] = useState("");
    const [isReportsLoading, setIsReportsLoading] = useState(true);
    const [isReportDetailLoading, setIsReportDetailLoading] = useState(false);
    const [isReportMutating, setIsReportMutating] = useState(false);
    const [reportErrorMessage, setReportErrorMessage] = useState(null);
    const [reportNotice, setReportNotice] = useState(null);
    const selectedListCase = useMemo(() => cases.find((moderationCase) => moderationCase.caseId === selectedCaseId) ?? null, [cases, selectedCaseId]);
    const selectedListReport = useMemo(() => reports.find((report) => report.reportId === selectedReportId) ?? null, [reports, selectedReportId]);
    const loadCases = async (preferredCaseId) => {
        setIsCasesLoading(true);
        setCaseErrorMessage(null);
        try {
            const response = await listModerationCases();
            setCases(response);
            const nextCaseId = preferredCaseId !== undefined
                ? preferredCaseId
                : selectedCaseId && response.some((moderationCase) => moderationCase.caseId === selectedCaseId)
                    ? selectedCaseId
                    : response[0]?.caseId ?? null;
            setSelectedCaseId(nextCaseId);
            if (response.length === 0) {
                setSelectedCase(null);
            }
        }
        catch (error) {
            setCaseErrorMessage(readErrorMessage(error, "No pudimos cargar la cola de moderacion."));
        }
        finally {
            setIsCasesLoading(false);
        }
    };
    const loadCaseDetail = async (caseId) => {
        setIsCaseDetailLoading(true);
        setCaseErrorMessage(null);
        try {
            const response = await getModerationCase(caseId);
            setSelectedCase(response);
        }
        catch (error) {
            setSelectedCase(selectedListCase);
            setCaseErrorMessage(readErrorMessage(error, "No pudimos cargar el detalle del caso."));
        }
        finally {
            setIsCaseDetailLoading(false);
        }
    };
    const loadReports = async (preferredReportId) => {
        setIsReportsLoading(true);
        setReportErrorMessage(null);
        try {
            const response = await listModerationReports();
            setReports(response);
            const nextReportId = preferredReportId !== undefined
                ? preferredReportId
                : selectedReportId && response.some((report) => report.reportId === selectedReportId)
                    ? selectedReportId
                    : response[0]?.reportId ?? null;
            setSelectedReportId(nextReportId);
            if (response.length === 0) {
                setSelectedReport(null);
            }
        }
        catch (error) {
            setReportErrorMessage(readErrorMessage(error, "No pudimos cargar los reportes."));
        }
        finally {
            setIsReportsLoading(false);
        }
    };
    const loadReportDetail = async (reportId) => {
        setIsReportDetailLoading(true);
        setReportErrorMessage(null);
        try {
            const response = await getModerationReport(reportId);
            setSelectedReport(response);
        }
        catch (error) {
            setSelectedReport(selectedListReport);
            setReportErrorMessage(readErrorMessage(error, "No pudimos cargar el detalle del reporte."));
        }
        finally {
            setIsReportDetailLoading(false);
        }
    };
    useEffect(() => {
        void loadCases();
        void loadReports();
        // Initial load only; queues are explicitly refreshed after decisions.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setCaseNotice(null);
        setCaseReason("");
        if (selectedCaseId) {
            void loadCaseDetail(selectedCaseId);
            return;
        }
        setSelectedCase(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCaseId]);
    useEffect(() => {
        setReportNotice(null);
        setReportReason("");
        if (selectedReportId) {
            void loadReportDetail(selectedReportId);
            return;
        }
        setSelectedReport(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReportId]);
    const handleCaseDecision = async (action) => {
        if (!selectedCaseId) {
            return;
        }
        const reason = caseReason.trim() || (action === "approve" ? APPROVAL_REASON : "");
        if (!reason) {
            setCaseErrorMessage("Ingresa un motivo para esta decision.");
            return;
        }
        setIsCaseMutating(true);
        setCaseErrorMessage(null);
        setCaseNotice(null);
        try {
            const response = await decideModerationCase(selectedCaseId, action, reason);
            setCaseNotice(`Decision registrada: ${response.publicationCaseStatus?.replace(/_/g, " ") ?? response.status}.`);
            setCaseReason("");
            await loadCases(null);
        }
        catch (error) {
            setCaseErrorMessage(readErrorMessage(error, "No pudimos registrar la decision."));
        }
        finally {
            setIsCaseMutating(false);
        }
    };
    const handleReportAction = async (action) => {
        if (!selectedReportId) {
            return;
        }
        const reason = reportReason.trim();
        if (!reason) {
            setReportErrorMessage("Ingresa un motivo para esta accion.");
            return;
        }
        setIsReportMutating(true);
        setReportErrorMessage(null);
        setReportNotice(null);
        try {
            const response = await actOnModerationReport(selectedReportId, action, reason);
            setReportNotice(`Reporte actualizado: ${response.status.replace(/_/g, " ")}.`);
            setReportReason("");
            await loadReports(selectedReportId);
            await loadReportDetail(selectedReportId);
        }
        catch (error) {
            setReportErrorMessage(readErrorMessage(error, "No pudimos actualizar el reporte."));
        }
        finally {
            setIsReportMutating(false);
        }
    };
    const caseDetail = selectedCase ?? selectedListCase;
    const draft = caseDetail?.draft ?? null;
    const reportDetail = selectedReport ?? selectedListReport;
    return (_jsxs(WorkspaceShell, { title: "Workspace de Moderacion", description: "Cola de revision y reportes conectados al backend v2 para decisiones de publicacion y confianza.", role: "moderator", children: [_jsxs("div", { className: "moderation-tabs", role: "tablist", "aria-label": "Secciones de moderacion", children: [_jsxs("button", { type: "button", role: "tab", id: "moderation-tab-cases", "aria-selected": activeTab === "cases", "aria-controls": "moderation-panel-cases", className: `moderation-tabs__button${activeTab === "cases" ? " is-active" : ""}`, onClick: () => setActiveTab("cases"), children: ["Publicaciones", _jsx("span", { className: "moderation-tabs__count", children: cases.length })] }), _jsxs("button", { type: "button", role: "tab", id: "moderation-tab-reports", "aria-selected": activeTab === "reports", "aria-controls": "moderation-panel-reports", className: `moderation-tabs__button${activeTab === "reports" ? " is-active" : ""}`, onClick: () => setActiveTab("reports"), children: ["Reportes", _jsx("span", { className: "moderation-tabs__count", children: reports.length })] })] }), activeTab === "cases" ? (_jsxs("section", { className: "moderation-workspace", role: "tabpanel", id: "moderation-panel-cases", "aria-labelledby": "moderation-tab-cases", children: [_jsxs("aside", { className: "workspace-card moderation-workspace__queue", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Cola pendiente" }), _jsx("p", { children: "Casos enviados a revision." })] }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => loadCases(), disabled: isCasesLoading, children: "Refrescar" }), _jsxs("div", { className: "moderation-queue", "aria-live": "polite", children: [isCasesLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando casos..." }) : null, !isCasesLoading && cases.length === 0 ? (_jsx("div", { className: "workspace-placeholder", children: "No hay casos pendientes." })) : null, cases.map((moderationCase) => (_jsxs("button", { className: `moderation-queue__item${moderationCase.caseId === selectedCaseId ? " is-selected" : ""}`, type: "button", onClick: () => setSelectedCaseId(moderationCase.caseId), children: [_jsx("span", { className: "moderation-queue__title", children: draftTitle(moderationCase.draft) }), _jsxs("span", { className: "moderation-queue__badges", children: [_jsx(StatusBadge, { value: moderationCase.status }), _jsx(StatusBadge, { value: moderationCase.priority })] })] }, moderationCase.caseId)))] })] }), _jsxs("article", { className: "workspace-card moderation-workspace__detail", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Detalle del caso" }), _jsx("p", { children: "Snapshot de publicacion y datos principales del evento." })] }), isCaseDetailLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando detalle..." }) : null, !isCaseDetailLoading && caseDetail ? (_jsxs("div", { className: "moderation-detail", children: [_jsxs("dl", { className: "draft-status moderation-detail__meta", children: [_jsxs("div", { children: [_jsx("dt", { children: "Publication case" }), _jsx("dd", { children: caseDetail.publicationCaseId })] }), _jsxs("div", { children: [_jsx("dt", { children: "Status" }), _jsx("dd", { children: _jsx(StatusBadge, { value: caseDetail.status }) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Case status" }), _jsx("dd", { children: _jsx(StatusBadge, { value: caseDetail.publicationCaseStatus, fallback: "Sin caso" }) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Submitted" }), _jsx("dd", { children: formatDate(caseDetail.submittedAt) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Created" }), _jsx("dd", { children: formatDate(caseDetail.createdAt) })] })] }), _jsxs("section", { className: "moderation-event-summary", children: [_jsx("h3", { children: draftTitle(draft) }), _jsx("p", { children: draft?.summary || "Sin resumen" }), _jsx("p", { children: draft?.description || "Sin descripcion" })] }), _jsxs("dl", { className: "moderation-event-grid", children: [_jsxs("div", { children: [_jsx("dt", { children: "Categoria" }), _jsx("dd", { children: draft?.categoryId ?? "Sin categoria" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Zona" }), _jsx("dd", { children: draft?.zoneId ?? "Sin zona" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Lugar" }), _jsx("dd", { children: draft?.venueName ?? "Sin lugar" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Direccion" }), _jsx("dd", { children: draft?.address ?? "Sin direccion" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Inicio" }), _jsx("dd", { children: formatDate(draft?.startsAt) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Fin" }), _jsx("dd", { children: formatDate(draft?.endsAt) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Costo" }), _jsx("dd", { children: draft?.isFree ? "Gratis" : draft?.costLabel ?? "Sin costo" })] })] })] })) : null, !isCaseDetailLoading && !caseDetail ? (_jsx("div", { className: "workspace-placeholder", children: "Selecciona un caso para revisar." })) : null] }), _jsxs("aside", { className: "workspace-card moderation-workspace__decision", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Decision" }), _jsx("p", { children: "Aprueba, rechaza, solicita correccion, oculta o escala." })] }), _jsxs("label", { className: "workspace-field moderation-reason", htmlFor: "case-decision-reason", children: [_jsx("span", { children: "Motivo" }), _jsx("textarea", { id: "case-decision-reason", value: caseReason, onChange: (event) => setCaseReason(event.target.value), placeholder: "Motivo visible para trazabilidad", rows: 7 })] }), _jsxs("div", { className: "moderation-actions", children: [_jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: () => handleCaseDecision("approve"), disabled: !caseDetail || isCaseMutating, children: "Aprobar" }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => handleCaseDecision("request-correction"), disabled: !caseDetail || isCaseMutating, children: "Pedir correccion" }), _jsx("button", { className: "workspace-button workspace-button--danger", type: "button", onClick: () => handleCaseDecision("reject"), disabled: !caseDetail || isCaseMutating, children: "Rechazar" }), _jsx("button", { className: "workspace-button workspace-button--danger", type: "button", onClick: () => handleCaseDecision("hide"), disabled: !caseDetail || isCaseMutating, children: "Ocultar" }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => handleCaseDecision("escalate"), disabled: !caseDetail || isCaseMutating, children: "Escalar" })] }), caseNotice ? _jsx("p", { className: "workspace-notice workspace-notice--success", children: caseNotice }) : null, caseErrorMessage ? _jsx("p", { className: "workspace-notice workspace-notice--error", children: caseErrorMessage }) : null] })] })) : (_jsxs("section", { className: "moderation-workspace", role: "tabpanel", id: "moderation-panel-reports", "aria-labelledby": "moderation-tab-reports", children: [_jsxs("aside", { className: "workspace-card moderation-workspace__queue", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Reportes" }), _jsx("p", { children: "Reportes protegidos contra contenido visible." })] }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => loadReports(), disabled: isReportsLoading, children: "Refrescar" }), _jsxs("div", { className: "moderation-queue", "aria-live": "polite", children: [isReportsLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando reportes..." }) : null, !isReportsLoading && reports.length === 0 ? (_jsx("div", { className: "workspace-placeholder", children: "No hay reportes registrados." })) : null, reports.map((report) => (_jsxs("button", { className: `moderation-queue__item${report.reportId === selectedReportId ? " is-selected" : ""}`, type: "button", onClick: () => setSelectedReportId(report.reportId), children: [_jsx("span", { className: "moderation-queue__title", children: reportTitle(report) }), _jsxs("span", { className: "moderation-queue__badges", children: [_jsx(StatusBadge, { value: report.status }), _jsx(StatusBadge, { value: report.triagePriority })] })] }, report.reportId)))] })] }), _jsxs("article", { className: "workspace-card moderation-workspace__detail", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Detalle del reporte" }), _jsx("p", { children: "Senales, objetivo y estado operacional." })] }), isReportDetailLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando detalle..." }) : null, !isReportDetailLoading && reportDetail ? (_jsxs("div", { className: "moderation-detail", children: [_jsxs("dl", { className: "draft-status moderation-detail__meta", children: [_jsxs("div", { children: [_jsx("dt", { children: "Report case" }), _jsx("dd", { children: reportDetail.reportId })] }), _jsxs("div", { children: [_jsx("dt", { children: "Target event" }), _jsx("dd", { children: reportDetail.targetEventId })] }), _jsxs("div", { children: [_jsx("dt", { children: "Status" }), _jsx("dd", { children: _jsx(StatusBadge, { value: reportDetail.status }) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Priority" }), _jsx("dd", { children: _jsx(StatusBadge, { value: reportDetail.triagePriority }) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Created" }), _jsx("dd", { children: formatDate(reportDetail.createdAt) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Updated" }), _jsx("dd", { children: formatDate(reportDetail.updatedAt) })] })] }), _jsxs("section", { className: "moderation-event-summary", children: [_jsx("h3", { children: reportTitle(reportDetail) }), _jsx("p", { children: reportDetail.reason }), _jsx("p", { children: reportDetail.decisionReason ?? "Sin decision registrada." })] }), _jsxs("section", { className: "report-signals", children: [_jsx("h3", { children: "Signals" }), reportDetail.signals.length === 0 ? (_jsx("p", { className: "workspace-placeholder", children: "Sin senales registradas." })) : (_jsx("ul", { className: "report-signals__list", children: reportDetail.signals.map((signal) => (_jsxs("li", { className: "report-signals__item", children: [_jsx("p", { children: signal.description }), _jsx("span", { children: formatDate(signal.createdAt) }), signal.evidenceRef ? _jsx("span", { children: signal.evidenceRef }) : null] }, signal.signalId))) }))] })] })) : null, !isReportDetailLoading && !reportDetail ? (_jsx("div", { className: "workspace-placeholder", children: "Selecciona un reporte para revisar." })) : null] }), _jsxs("aside", { className: "workspace-card moderation-workspace__decision", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Accion" }), _jsx("p", { children: "Haz triage, resuelve, descarta, oculta o escala." })] }), _jsxs("label", { className: "workspace-field moderation-reason", htmlFor: "report-action-reason", children: [_jsx("span", { children: "Motivo" }), _jsx("textarea", { id: "report-action-reason", value: reportReason, onChange: (event) => setReportReason(event.target.value), placeholder: "Motivo visible para trazabilidad", rows: 7 })] }), _jsxs("div", { className: "moderation-actions", children: [_jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => handleReportAction("triage"), disabled: !reportDetail || isReportMutating, children: "Triage" }), _jsx("button", { className: "workspace-button workspace-button--primary", type: "button", onClick: () => handleReportAction("resolve"), disabled: !reportDetail || isReportMutating, children: "Resolver" }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => handleReportAction("dismiss"), disabled: !reportDetail || isReportMutating, children: "Descartar" }), _jsx("button", { className: "workspace-button workspace-button--danger", type: "button", onClick: () => handleReportAction("hide"), disabled: !reportDetail || isReportMutating, children: "Ocultar contenido" }), _jsx("button", { className: "workspace-button workspace-button--secondary", type: "button", onClick: () => handleReportAction("escalate"), disabled: !reportDetail || isReportMutating, children: "Escalar" })] }), reportNotice ? _jsx("p", { className: "workspace-notice workspace-notice--success", children: reportNotice }) : null, reportErrorMessage ? (_jsx("p", { className: "workspace-notice workspace-notice--error", children: reportErrorMessage })) : null] })] }))] }));
}
//# sourceMappingURL=ModerationWorkspacePage.js.map