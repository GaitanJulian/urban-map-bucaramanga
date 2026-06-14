import React, { useEffect, useMemo, useState } from "react";
import { decideModerationCase, getModerationCase, listModerationCases } from "../api/moderationCases";
import { actOnModerationReport, getModerationReport, listModerationReports } from "../api/moderationReports";
import type { ModerationAction, ModerationCase, ModerationDraftSnapshot } from "../types/moderationCases";
import type { ModerationReport, ReportAction } from "../types/moderationReports";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";

const APPROVAL_REASON = "Contenido aprobado para publicacion.";

type ModerationTab = "queue" | "reports";

function statusLabel(value: string | null | undefined): string {
  if (!value) {
    return "Sin estado";
  }

  return value.replace(/_/g, " ");
}

function formatDate(value: string | null | undefined): string {
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

function readErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function draftTitle(draft: ModerationDraftSnapshot | null | undefined): string {
  return draft?.title?.trim() || "Borrador sin titulo";
}

function reportTitle(report: ModerationReport): string {
  return report.targetEventTitle?.trim() || report.targetEventId;
}

export function ModerationWorkspacePage() {
  const [activeTab, setActiveTab] = useState<ModerationTab>("queue");

  const [cases, setCases] = useState<ModerationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<ModerationCase | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isReportsLoading, setIsReportsLoading] = useState(true);
  const [isReportDetailLoading, setIsReportDetailLoading] = useState(false);
  const [isReportMutating, setIsReportMutating] = useState(false);
  const [reportErrorMessage, setReportErrorMessage] = useState<string | null>(null);
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  const selectedListCase = useMemo(
    () => cases.find((moderationCase) => moderationCase.caseId === selectedCaseId) ?? null,
    [cases, selectedCaseId]
  );
  const selectedListReport = useMemo(
    () => reports.find((report) => report.reportId === selectedReportId) ?? null,
    [reports, selectedReportId]
  );

  const loadCases = async (preferredCaseId?: string | null) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await listModerationCases();
      setCases(response);

      const nextCaseId =
        preferredCaseId !== undefined
          ? preferredCaseId
          : selectedCaseId && response.some((moderationCase) => moderationCase.caseId === selectedCaseId)
            ? selectedCaseId
            : response[0]?.caseId ?? null;

      setSelectedCaseId(nextCaseId);
      if (response.length === 0) {
        setSelectedCase(null);
      }
    } catch (error) {
      setErrorMessage(readErrorMessage(error, "No pudimos cargar la cola de moderacion."));
    } finally {
      setIsLoading(false);
    }
  };

  const loadCaseDetail = async (caseId: string) => {
    setIsDetailLoading(true);
    setErrorMessage(null);

    try {
      const response = await getModerationCase(caseId);
      setSelectedCase(response);
    } catch (error) {
      setSelectedCase(selectedListCase);
      setErrorMessage(readErrorMessage(error, "No pudimos cargar el detalle del caso."));
    } finally {
      setIsDetailLoading(false);
    }
  };

  const loadReports = async (preferredReportId?: string | null) => {
    setIsReportsLoading(true);
    setReportErrorMessage(null);

    try {
      const response = await listModerationReports();
      setReports(response);

      const nextReportId =
        preferredReportId !== undefined
          ? preferredReportId
          : selectedReportId && response.some((report) => report.reportId === selectedReportId)
            ? selectedReportId
            : response[0]?.reportId ?? null;

      setSelectedReportId(nextReportId);
      if (response.length === 0) {
        setSelectedReport(null);
      }
    } catch (error) {
      setReportErrorMessage(readErrorMessage(error, "No pudimos cargar los reportes."));
    } finally {
      setIsReportsLoading(false);
    }
  };

  const loadReportDetail = async (reportId: string) => {
    setIsReportDetailLoading(true);
    setReportErrorMessage(null);

    try {
      const response = await getModerationReport(reportId);
      setSelectedReport(response);
    } catch (error) {
      setSelectedReport(selectedListReport);
      setReportErrorMessage(readErrorMessage(error, "No pudimos cargar el detalle del reporte."));
    } finally {
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
    setNotice(null);
    setDecisionReason("");

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

  const handleDecision = async (action: ModerationAction) => {
    if (!selectedCaseId) {
      return;
    }

    const reason = decisionReason.trim() || (action === "approve" ? APPROVAL_REASON : "");
    if (!reason) {
      setErrorMessage("Ingresa un motivo para esta decision.");
      return;
    }

    setIsMutating(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      const response = await decideModerationCase(selectedCaseId, action, reason);
      setNotice(`Decision registrada: ${statusLabel(response.publicationCaseStatus)}.`);
      setDecisionReason("");
      await loadCases(null);
    } catch (error) {
      setErrorMessage(readErrorMessage(error, "No pudimos registrar la decision."));
    } finally {
      setIsMutating(false);
    }
  };

  const handleReportAction = async (action: ReportAction) => {
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
      setReportNotice(`Accion registrada: ${statusLabel(response.status)}.`);
      setReportReason("");
      await loadReports(selectedReportId);
      await loadReportDetail(selectedReportId);
    } catch (error) {
      setReportErrorMessage(readErrorMessage(error, "No pudimos registrar la accion del reporte."));
    } finally {
      setIsReportMutating(false);
    }
  };

  const detail = selectedCase ?? selectedListCase;
  const draft = detail?.draft ?? null;
  const reportDetail = selectedReport ?? selectedListReport;

  return (
    <WorkspaceShell
      title="Workspace de Moderacion"
      description="Cola de revision y reportes protegidos conectados al backend v2."
      role="moderator"
    >
      <div className="workspace-tabs" role="tablist" aria-label="Secciones de moderacion">
        <button className={activeTab === "queue" ? "is-active" : ""} type="button" onClick={() => setActiveTab("queue")}>
          Publicaciones
        </button>
        <button className={activeTab === "reports" ? "is-active" : ""} type="button" onClick={() => setActiveTab("reports")}>
          Reportes
        </button>
      </div>

      {activeTab === "queue" ? (
        <section className="moderation-workspace">
          <aside className="workspace-card moderation-workspace__queue">
            <div className="workspace-card__copy">
              <h2>Cola pendiente</h2>
              <p>Casos enviados a revision.</p>
            </div>

            <button className="workspace-button workspace-button--secondary" type="button" onClick={() => loadCases()} disabled={isLoading}>
              Refrescar
            </button>

            <div className="moderation-queue" aria-live="polite">
              {isLoading ? <div className="workspace-placeholder">Cargando casos...</div> : null}

              {!isLoading && cases.length === 0 ? <div className="workspace-placeholder">No hay casos pendientes.</div> : null}

              {cases.map((moderationCase) => (
                <button
                  className={`moderation-queue__item${moderationCase.caseId === selectedCaseId ? " is-selected" : ""}`}
                  type="button"
                  key={moderationCase.caseId}
                  onClick={() => setSelectedCaseId(moderationCase.caseId)}
                >
                  <span className="moderation-queue__title">{draftTitle(moderationCase.draft)}</span>
                  <span className="moderation-queue__meta">
                    {statusLabel(moderationCase.status)} - {moderationCase.priority}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <article className="workspace-card moderation-workspace__detail">
            <div className="workspace-card__copy">
              <h2>Detalle del caso</h2>
              <p>Snapshot de publicacion y datos principales del evento.</p>
            </div>

            {isDetailLoading ? <div className="workspace-placeholder">Cargando detalle...</div> : null}

            {!isDetailLoading && detail ? (
              <div className="moderation-detail">
                <dl className="draft-status moderation-detail__meta">
                  <div>
                    <dt>Publication case</dt>
                    <dd>{detail.publicationCaseId}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{statusLabel(detail.status)}</dd>
                  </div>
                  <div>
                    <dt>Case status</dt>
                    <dd>{statusLabel(detail.publicationCaseStatus)}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(detail.submittedAt)}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{formatDate(detail.createdAt)}</dd>
                  </div>
                </dl>

                <section className="moderation-event-summary">
                  <h3>{draftTitle(draft)}</h3>
                  <p>{draft?.summary || "Sin resumen"}</p>
                  <p>{draft?.description || "Sin descripcion"}</p>
                </section>

                <dl className="moderation-event-grid">
                  <div>
                    <dt>Categoria</dt>
                    <dd>{draft?.categoryId ?? "Sin categoria"}</dd>
                  </div>
                  <div>
                    <dt>Zona</dt>
                    <dd>{draft?.zoneId ?? "Sin zona"}</dd>
                  </div>
                  <div>
                    <dt>Lugar</dt>
                    <dd>{draft?.venueName ?? "Sin lugar"}</dd>
                  </div>
                  <div>
                    <dt>Direccion</dt>
                    <dd>{draft?.address ?? "Sin direccion"}</dd>
                  </div>
                  <div>
                    <dt>Inicio</dt>
                    <dd>{formatDate(draft?.startsAt)}</dd>
                  </div>
                  <div>
                    <dt>Fin</dt>
                    <dd>{formatDate(draft?.endsAt)}</dd>
                  </div>
                  <div>
                    <dt>Costo</dt>
                    <dd>{draft?.isFree ? "Gratis" : draft?.costLabel ?? "Sin costo"}</dd>
                  </div>
                </dl>
              </div>
            ) : null}

            {!isDetailLoading && !detail ? <div className="workspace-placeholder">Selecciona un caso para revisar.</div> : null}
          </article>

          <aside className="workspace-card moderation-workspace__decision">
            <div className="workspace-card__copy">
              <h2>Decision</h2>
              <p>Aprueba, rechaza, solicita correccion, oculta o escala.</p>
            </div>

            <label className="workspace-field moderation-reason">
              <span>Motivo</span>
              <textarea
                value={decisionReason}
                onChange={(event) => setDecisionReason(event.target.value)}
                placeholder="Motivo visible para trazabilidad"
                rows={7}
              />
            </label>

            <div className="moderation-actions">
              <button className="workspace-button workspace-button--primary" type="button" onClick={() => handleDecision("approve")} disabled={!detail || isMutating}>
                Aprobar
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleDecision("request-correction")} disabled={!detail || isMutating}>
                Pedir correccion
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleDecision("reject")} disabled={!detail || isMutating}>
                Rechazar
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleDecision("hide")} disabled={!detail || isMutating}>
                Ocultar
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleDecision("escalate")} disabled={!detail || isMutating}>
                Escalar
              </button>
            </div>

            {notice ? <p className="workspace-notice workspace-notice--success">{notice}</p> : null}
            {errorMessage ? <p className="workspace-notice workspace-notice--error">{errorMessage}</p> : null}
          </aside>
        </section>
      ) : (
        <section className="moderation-workspace">
          <aside className="workspace-card moderation-workspace__queue">
            <div className="workspace-card__copy">
              <h2>Reportes</h2>
              <p>Reportes protegidos contra contenido visible.</p>
            </div>

            <button className="workspace-button workspace-button--secondary" type="button" onClick={() => loadReports()} disabled={isReportsLoading}>
              Refrescar
            </button>

            <div className="moderation-queue" aria-live="polite">
              {isReportsLoading ? <div className="workspace-placeholder">Cargando reportes...</div> : null}

              {!isReportsLoading && reports.length === 0 ? <div className="workspace-placeholder">No hay reportes registrados.</div> : null}

              {reports.map((report) => (
                <button
                  className={`moderation-queue__item${report.reportId === selectedReportId ? " is-selected" : ""}`}
                  type="button"
                  key={report.reportId}
                  onClick={() => setSelectedReportId(report.reportId)}
                >
                  <span className="moderation-queue__title">{reportTitle(report)}</span>
                  <span className="moderation-queue__meta">
                    {statusLabel(report.status)} - {report.triagePriority}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <article className="workspace-card moderation-workspace__detail">
            <div className="workspace-card__copy">
              <h2>Detalle del reporte</h2>
              <p>Senales, objetivo y estado operacional.</p>
            </div>

            {isReportDetailLoading ? <div className="workspace-placeholder">Cargando detalle...</div> : null}

            {!isReportDetailLoading && reportDetail ? (
              <div className="moderation-detail">
                <dl className="draft-status moderation-detail__meta">
                  <div>
                    <dt>Report case</dt>
                    <dd>{reportDetail.reportId}</dd>
                  </div>
                  <div>
                    <dt>Target event</dt>
                    <dd>{reportDetail.targetEventId}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{statusLabel(reportDetail.status)}</dd>
                  </div>
                  <div>
                    <dt>Priority</dt>
                    <dd>{reportDetail.triagePriority}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{formatDate(reportDetail.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{formatDate(reportDetail.updatedAt)}</dd>
                  </div>
                </dl>

                <section className="moderation-event-summary">
                  <h3>{reportTitle(reportDetail)}</h3>
                  <p>{reportDetail.reason}</p>
                  <p>{reportDetail.decisionReason ?? "Sin decision registrada."}</p>
                </section>

                <section className="report-signals">
                  <h3>Signals</h3>
                  {reportDetail.signals.length === 0 ? <p className="validation-panel__empty">Sin senales registradas.</p> : null}
                  {reportDetail.signals.map((signal) => (
                    <article className="report-signal" key={signal.signalId}>
                      <p>{signal.description}</p>
                      <span>{formatDate(signal.createdAt)}</span>
                      {signal.evidenceRef ? <span>{signal.evidenceRef}</span> : null}
                    </article>
                  ))}
                </section>
              </div>
            ) : null}

            {!isReportDetailLoading && !reportDetail ? <div className="workspace-placeholder">Selecciona un reporte para revisar.</div> : null}
          </article>

          <aside className="workspace-card moderation-workspace__decision">
            <div className="workspace-card__copy">
              <h2>Accion</h2>
              <p>Haz triage, resuelve, descarta, oculta o escala.</p>
            </div>

            <label className="workspace-field moderation-reason">
              <span>Motivo</span>
              <textarea
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                placeholder="Motivo visible para trazabilidad"
                rows={7}
              />
            </label>

            <div className="moderation-actions">
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleReportAction("triage")} disabled={!reportDetail || isReportMutating}>
                Triage
              </button>
              <button className="workspace-button workspace-button--primary" type="button" onClick={() => handleReportAction("resolve")} disabled={!reportDetail || isReportMutating}>
                Resolver
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleReportAction("dismiss")} disabled={!reportDetail || isReportMutating}>
                Descartar
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleReportAction("hide")} disabled={!reportDetail || isReportMutating}>
                Ocultar contenido
              </button>
              <button className="workspace-button workspace-button--secondary" type="button" onClick={() => handleReportAction("escalate")} disabled={!reportDetail || isReportMutating}>
                Escalar
              </button>
            </div>

            {reportNotice ? <p className="workspace-notice workspace-notice--success">{reportNotice}</p> : null}
            {reportErrorMessage ? <p className="workspace-notice workspace-notice--error">{reportErrorMessage}</p> : null}
          </aside>
        </section>
      )}
    </WorkspaceShell>
  );
}
