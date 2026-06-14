import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { ModerationOutcome } from "@umb/shared";
import { randomUUID } from "node:crypto";
import { In, Repository } from "typeorm";
import { EventEntity } from "../event-discovery/entities/event.entity.js";
import { PublicationCaseEntity } from "../event-publication/entities/publication-case.entity.js";
import { EventDraftEntity } from "../event-publication/entities/event-draft.entity.js";
import {
  CreateReportRequestDto,
  ModerationCaseDecisionRequestDto,
  ModerationCaseDecisionResponseDto,
  ModerationCaseResponseDto,
  ReportActionRequestDto,
  ReportActionResponseDto,
  ReportResponseDto
} from "./dto/moderation-trust.dto.js";
import { EscalationEntity } from "./entities/escalation.entity.js";
import { ModerationCaseEntity } from "./entities/moderation-case.entity.js";
import { ModerationDecisionEntity } from "./entities/moderation-decision.entity.js";
import { ReportCaseEntity } from "./entities/report-case.entity.js";
import { ReportSignalEntity } from "./entities/report-signal.entity.js";

type PublicationCaseStatus = "submitted" | "in_review" | "approved" | "rejected" | "changes_requested" | "hidden" | "escalated" | "cancelled";
type ReportStatus = "open" | "triaged" | "in_review" | "waiting_correction" | "resolved" | "dismissed" | "hidden" | "escalated";

@Injectable()
export class ModerationTrustService {
  constructor(
    @InjectRepository(ModerationCaseEntity)
    private readonly moderationCaseRepository: Repository<ModerationCaseEntity>,
    @InjectRepository(ModerationDecisionEntity)
    private readonly moderationDecisionRepository: Repository<ModerationDecisionEntity>,
    @InjectRepository(PublicationCaseEntity)
    private readonly publicationCaseRepository: Repository<PublicationCaseEntity>,
    @InjectRepository(EventDraftEntity)
    private readonly draftRepository: Repository<EventDraftEntity>,
    @InjectRepository(ReportCaseEntity)
    private readonly reportCaseRepository: Repository<ReportCaseEntity>,
    @InjectRepository(ReportSignalEntity)
    private readonly reportSignalRepository: Repository<ReportSignalEntity>,
    @InjectRepository(EscalationEntity)
    private readonly escalationRepository: Repository<EscalationEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>
  ) {}

  async listCases(): Promise<ModerationCaseResponseDto[]> {
    await this.syncPendingCases();

    const cases = await this.moderationCaseRepository.find({
      where: {
        status: In(["pending", "in_review"])
      },
      order: {
        createdAt: "ASC"
      }
    });

    return Promise.all(cases.map((moderationCase) => this.toModerationCaseResponse(moderationCase)));
  }

  async getCase(caseId: string): Promise<ModerationCaseResponseDto> {
    await this.syncPendingCases();
    const moderationCase = await this.findModerationCaseOrFail(caseId);
    return this.toModerationCaseResponse(moderationCase);
  }

  async decideCase(
    caseId: string,
    outcome: ModerationOutcome,
    body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    const moderationCase = await this.findModerationCaseOrFail(caseId);

    if (moderationCase.status === "resolved") {
      throw new BadRequestException(`Moderation case ${caseId} is already resolved.`);
    }

    const reason = this.normalizeRequiredText(body.reason, "reason");

    const publicationCase = await this.findPublicationCaseOrFail(moderationCase.publicationCaseId);
    const draft = await this.findDraftOrFail(publicationCase.eventDraftId);

    moderationCase.status = "resolved";
    moderationCase.decisionOutcome = outcome;
    moderationCase.decisionReason = reason;
    moderationCase.reviewedAt = new Date();
    moderationCase.updatedAt = new Date();
    await this.moderationCaseRepository.save(moderationCase);

    const decision = this.moderationDecisionRepository.create({
      id: this.createScopedId("decision"),
      moderationCaseId: moderationCase.id,
      moderatorActorAccountId: null,
      outcome,
      reason
    });
    await this.moderationDecisionRepository.save(decision);

    const publicationCaseStatus = this.resolvePublicationCaseStatus(outcome);
    publicationCase.status = publicationCaseStatus;
    publicationCase.reviewedAt = new Date();
    publicationCase.reviewDecisionId = decision.id;
    publicationCase.updatedAt = new Date();
    await this.publicationCaseRepository.save(publicationCase);

    this.applyOrganizerFacingStatus(draft, outcome);
    draft.updatedAt = new Date();
    await this.draftRepository.save(draft);

    if (outcome === "approved") {
      await this.projectApprovedPublication(publicationCase, draft);
    }

    if ((outcome === "rejected" || outcome === "hidden") && moderationCase.targetEventId) {
      await this.hideProjectedEvent(moderationCase.targetEventId);
    }

    if (outcome === "escalated") {
      await this.createEscalation({
        moderationCaseId: moderationCase.id,
        reportCaseId: null,
        reason,
        escalatedByActorAccountId: null
      });
    }

    return {
      caseId: moderationCase.id,
      publicationCaseId: publicationCase.id,
      outcome,
      reason,
      status: moderationCase.status,
      publicationCaseStatus
    };
  }

  async listReports(): Promise<ReportResponseDto[]> {
    const reports = await this.reportCaseRepository.find({
      order: {
        createdAt: "DESC"
      }
    });

    return Promise.all(reports.map((report) => this.toReportResponse(report)));
  }

  async getReport(reportId: string): Promise<ReportResponseDto> {
    const report = await this.findReportOrFail(reportId);
    return this.toReportResponse(report);
  }

  async createReport(body: CreateReportRequestDto): Promise<ReportResponseDto> {
    const targetEvent = await this.findEventOrFail(body.targetEventId);
    if (targetEvent.visibilityState !== "visible") {
      throw new BadRequestException(`Event ${body.targetEventId} is not visible and cannot be reported.`);
    }
    const reason = this.normalizeRequiredText(body.reason, "reason");
    const description = this.normalizeRequiredText(body.description, "description");

    const report = this.reportCaseRepository.create({
      id: this.createScopedId("report"),
      targetEventId: targetEvent.id,
      intakeActorAccountId: body.intakeActorAccountId?.trim() || null,
      reporterActorAccountId: null,
      reason,
      decisionReason: null,
      status: "open",
      triagePriority: "normal",
      resolvedAt: null
    });
    await this.reportCaseRepository.save(report);

    await this.reportSignalRepository.save(
      this.reportSignalRepository.create({
        id: this.createScopedId("signal"),
        reportCaseId: report.id,
        description,
        evidenceRef: body.evidenceRef?.trim() || null
      })
    );

    return this.toReportResponse(report);
  }

  async triageReport(reportId: string, body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    const report = await this.findReportOrFail(reportId);
    this.ensureReportNotFinal(report);
    const reason = this.normalizeRequiredText(body.reason, "reason");

    report.status = "triaged";
    report.decisionReason = reason;
    report.updatedAt = new Date();
    await this.reportCaseRepository.save(report);

    await this.appendReportSignal(report.id, reason, null);

    return this.toReportActionResponse(report);
  }

  async resolveReport(reportId: string, body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    const report = await this.findReportOrFail(reportId);
    this.ensureReportNotFinal(report);
    const reason = this.normalizeRequiredText(body.reason, "reason");

    report.status = "resolved";
    report.decisionReason = reason;
    report.resolvedAt = new Date();
    report.updatedAt = new Date();
    await this.reportCaseRepository.save(report);

    await this.appendReportSignal(report.id, reason, null);

    return this.toReportActionResponse(report);
  }

  async dismissReport(reportId: string, body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    const report = await this.findReportOrFail(reportId);
    this.ensureReportNotFinal(report);
    const reason = this.normalizeRequiredText(body.reason, "reason");

    report.status = "dismissed";
    report.decisionReason = reason;
    report.resolvedAt = new Date();
    report.updatedAt = new Date();
    await this.reportCaseRepository.save(report);

    await this.appendReportSignal(report.id, reason, null);

    return this.toReportActionResponse(report);
  }

  async hideReport(reportId: string, body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    const report = await this.findReportOrFail(reportId);
    this.ensureReportNotFinal(report);
    const reason = this.normalizeRequiredText(body.reason, "reason");
    const targetEvent = await this.findEventOrFail(report.targetEventId);

    report.status = "hidden";
    report.decisionReason = reason;
    report.resolvedAt = new Date();
    report.updatedAt = new Date();
    await this.reportCaseRepository.save(report);

    await this.hideProjectedEvent(targetEvent.id);

    await this.appendReportSignal(report.id, reason, null);

    return this.toReportActionResponse(report);
  }

  async escalateReport(reportId: string, body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    const report = await this.findReportOrFail(reportId);
    this.ensureReportNotFinal(report);
    const reason = this.normalizeRequiredText(body.reason, "reason");

    report.status = "escalated";
    report.decisionReason = reason;
    report.resolvedAt = new Date();
    report.updatedAt = new Date();
    await this.reportCaseRepository.save(report);

    await this.appendReportSignal(report.id, reason, null);
    await this.createEscalation({
      moderationCaseId: null,
      reportCaseId: report.id,
      reason,
      escalatedByActorAccountId: report.intakeActorAccountId
    });

    return this.toReportActionResponse(report);
  }

  private async syncPendingCases(): Promise<void> {
    const publicationCases = await this.publicationCaseRepository.find({
      where: {
        status: In(["submitted", "in_review"])
      },
      order: {
        createdAt: "ASC"
      }
    });

    const existing = await this.moderationCaseRepository.find({
      select: {
        publicationCaseId: true
      }
    });
    const existingIds = new Set(existing.map((moderationCase) => moderationCase.publicationCaseId));

    const newCases = publicationCases
      .filter((publicationCase) => !existingIds.has(publicationCase.id))
      .map((publicationCase) =>
        this.moderationCaseRepository.create({
          id: this.createScopedId("case"),
          publicationCaseId: publicationCase.id,
          targetEventId: null,
          status: "pending",
          priority: publicationCase.criticalChangeFlag ? "high" : "normal",
          decisionOutcome: null,
          decisionReason: null,
          reviewedAt: null
        })
      );

    if (newCases.length > 0) {
      await this.moderationCaseRepository.save(newCases);
    }
  }

  private async findModerationCaseOrFail(caseId: string): Promise<ModerationCaseEntity> {
    const moderationCase = await this.moderationCaseRepository.findOne({ where: { id: caseId } });
    if (!moderationCase) {
      throw new NotFoundException(`Moderation case ${caseId} not found.`);
    }

    return moderationCase;
  }

  private async findPublicationCaseOrFail(publicationCaseId: string): Promise<PublicationCaseEntity> {
    const publicationCase = await this.publicationCaseRepository.findOne({ where: { id: publicationCaseId } });
    if (!publicationCase) {
      throw new NotFoundException(`Publication case ${publicationCaseId} not found.`);
    }

    return publicationCase;
  }

  private async findDraftOrFail(draftId: string): Promise<EventDraftEntity> {
    const draft = await this.draftRepository.findOne({ where: { id: draftId } });
    if (!draft) {
      throw new NotFoundException(`Draft ${draftId} not found.`);
    }

    return draft;
  }

  private async findReportOrFail(reportId: string): Promise<ReportCaseEntity> {
    const report = await this.reportCaseRepository.findOne({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }

    return report;
  }

  private async findEventOrFail(eventId: string): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found.`);
    }

    return event;
  }

  private async toModerationCaseResponse(moderationCase: ModerationCaseEntity): Promise<ModerationCaseResponseDto> {
    const publicationCase = await this.findPublicationCaseOrFail(moderationCase.publicationCaseId);
    const draft = await this.findDraftOrFail(publicationCase.eventDraftId);

    return {
      caseId: moderationCase.id,
      publicationCaseId: moderationCase.publicationCaseId,
      draftId: draft.id,
      publicationCaseStatus: publicationCase.status,
      status: moderationCase.status,
      priority: moderationCase.priority,
      decisionOutcome: moderationCase.decisionOutcome as ModerationOutcome | null,
      decisionReason: moderationCase.decisionReason
    };
  }

  private async toReportResponse(report: ReportCaseEntity): Promise<ReportResponseDto> {
    const targetEvent = await this.findEventOrFail(report.targetEventId);
    const signals = await this.reportSignalRepository.find({
      where: { reportCaseId: report.id },
      order: { createdAt: "ASC" }
    });

    return {
      reportId: report.id,
      targetEventId: report.targetEventId,
      targetEventTitle: targetEvent.title,
      status: report.status,
      triagePriority: report.triagePriority,
      reason: report.reason,
      decisionReason: report.decisionReason,
      resolvedAt: report.resolvedAt ? report.resolvedAt.toISOString() : null,
      signals: signals.map((signal) => ({
        signalId: signal.id,
        description: signal.description,
        evidenceRef: signal.evidenceRef,
        createdAt: signal.createdAt.toISOString()
      }))
    };
  }

  private toReportActionResponse(report: ReportCaseEntity): ReportActionResponseDto {
    return {
      reportId: report.id,
      status: report.status,
      triagePriority: report.triagePriority,
      decisionReason: report.decisionReason
    };
  }

  private async appendReportSignal(reportCaseId: string, description: string, evidenceRef: string | null): Promise<void> {
    await this.reportSignalRepository.save(
      this.reportSignalRepository.create({
        id: this.createScopedId("signal"),
        reportCaseId,
        description,
        evidenceRef
      })
    );
  }

  private async createEscalation(input: {
    moderationCaseId: string | null;
    reportCaseId: string | null;
    reason: string;
    escalatedByActorAccountId: string | null;
  }): Promise<void> {
    await this.escalationRepository.save(
      this.escalationRepository.create({
        id: this.createScopedId("escalation"),
        moderationCaseId: input.moderationCaseId,
        reportCaseId: input.reportCaseId,
        escalatedByActorAccountId: input.escalatedByActorAccountId,
        reason: input.reason,
        status: "open",
        resolvedAt: null
      })
    );
  }

  private async projectApprovedPublication(publicationCase: PublicationCaseEntity, draft: EventDraftEntity): Promise<EventEntity> {
    const existingEvent = await this.findProjectedEventByDraftId(draft.id);
    const projectedEvent = this.buildProjectedEvent(existingEvent, publicationCase.id, draft);

    if (existingEvent) {
      Object.assign(existingEvent, projectedEvent);
      existingEvent.updatedAt = new Date();
      return this.eventRepository.save(existingEvent);
    }

    return this.eventRepository.save(this.eventRepository.create(projectedEvent));
  }

  private async hideProjectedEvent(eventId: string): Promise<void> {
    const event = await this.findEventOrFail(eventId);
    event.visibilityState = "hidden";
    event.updatedAt = new Date();
    await this.eventRepository.save(event);
  }

  private async findProjectedEventByDraftId(draftId: string): Promise<EventEntity | null> {
    return this.eventRepository.findOne({
      where: { sourceDraftId: draftId }
    });
  }

  private buildProjectedEvent(
    existingEvent: EventEntity | null,
    sourcePublicationCaseId: string,
    draft: EventDraftEntity
  ): Partial<EventEntity> {
    const now = new Date();
    const defaultStartsAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
    const defaultEndsAt = new Date(defaultStartsAt.getTime() + 1000 * 60 * 60 * 3);
    const startsAt = draft.startsAt ?? defaultStartsAt;
    const endsAt = draft.endsAt ?? defaultEndsAt;
    const title = this.normalizePublicField(draft.title, "Evento publicado");
    const summary = this.normalizePublicField(draft.summary, "Resumen del evento");
    const description = this.normalizePublicField(draft.description, summary);
    const categoryId = draft.categoryId ?? "cat_music";
    const locationId = draft.locationId ?? "loc_001";
    const zoneId = draft.zoneId ?? "zone_cabecera";
    const isFree = draft.isFree ?? false;
    const costLabel = this.normalizePublicField(draft.costLabel, isFree ? "Gratis" : "Pago");
    const status = this.resolveEventLifecycleStatus(startsAt, endsAt);
    const slugBase = this.slugify(title);

    return {
      id: existingEvent?.id ?? this.createScopedId("evt"),
      title,
      slug: existingEvent?.slug ?? `${slugBase}-${draft.id.slice(-6)}`,
      summary,
      description,
      categoryId,
      locationId,
      zoneId,
      status,
      visibilityState: "visible",
      startsAt,
      endsAt,
      costLabel,
      isFree,
      isApproximateLocation: existingEvent?.isApproximateLocation ?? true,
      isCurated: true,
      sourceDraftId: draft.id,
      sourcePublicationCaseId,
      createdAt: existingEvent?.createdAt ?? new Date(),
      updatedAt: new Date()
    };
  }

  private resolveEventLifecycleStatus(startsAt: Date, endsAt: Date): EventEntity["status"] {
    const now = new Date();

    if (endsAt.getTime() < now.getTime()) {
      return "ended";
    }

    if (startsAt.getTime() <= now.getTime()) {
      return "live";
    }

    return "upcoming";
  }

  private normalizePublicField(value: string | null | undefined, fallback: string): string {
    if (typeof value !== "string") {
      return fallback;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : fallback;
  }

  private slugify(value: string): string {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 140) || "evento";
  }

  private resolvePublicationCaseStatus(outcome: ModerationOutcome): PublicationCaseStatus {
    switch (outcome) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "needs_correction":
        return "changes_requested";
      case "hidden":
        return "hidden";
      case "escalated":
        return "escalated";
      case "resolved":
        return "cancelled";
      default:
        return "submitted";
    }
  }

  private applyOrganizerFacingStatus(draft: EventDraftEntity, outcome: ModerationOutcome): void {
    switch (outcome) {
      case "approved":
        draft.publicationStatus = "approved";
        break;
      case "rejected":
      case "needs_correction":
        draft.publicationStatus = "changes_requested";
        break;
      case "hidden":
        draft.publicationStatus = "cancelled";
        break;
      case "escalated":
        draft.publicationStatus = "pending";
        break;
      case "resolved":
        draft.publicationStatus = "approved";
        break;
    }
  }

  private ensureReportNotFinal(report: ReportCaseEntity): void {
    if (["resolved", "dismissed", "hidden", "escalated"].includes(report.status)) {
      throw new BadRequestException(`Report ${report.id} is already in a final state.`);
    }
  }

  private normalizeRequiredText(value: string | undefined, fieldName: string): string {
    if (value === undefined) {
      throw new BadRequestException(`${fieldName} is required.`);
    }

    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException(`${fieldName} is required.`);
    }

    return normalized;
  }

  private createScopedId(prefix: string): string {
    return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
  }
}
