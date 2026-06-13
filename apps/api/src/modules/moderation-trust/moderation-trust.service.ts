import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { ModerationOutcome } from "@umb/shared";
import { randomUUID } from "node:crypto";
import { In, Repository } from "typeorm";
import { PublicationCaseEntity } from "../event-publication/entities/publication-case.entity.js";
import { EventDraftEntity } from "../event-publication/entities/event-draft.entity.js";
import { ModerationCaseDecisionRequestDto, ModerationCaseDecisionResponseDto, ModerationCaseResponseDto } from "./dto/moderation-trust.dto.js";
import { ModerationCaseEntity } from "./entities/moderation-case.entity.js";
import { ModerationDecisionEntity } from "./entities/moderation-decision.entity.js";

type PublicationCaseStatus = "submitted" | "in_review" | "approved" | "rejected" | "changes_requested" | "hidden" | "escalated" | "cancelled";

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
    private readonly draftRepository: Repository<EventDraftEntity>
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

    return Promise.all(cases.map((moderationCase) => this.toResponse(moderationCase)));
  }

  async getCase(caseId: string): Promise<ModerationCaseResponseDto> {
    await this.syncPendingCases();
    const moderationCase = await this.findCaseOrFail(caseId);
    return this.toResponse(moderationCase);
  }

  async decideCase(
    caseId: string,
    outcome: ModerationOutcome,
    body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    const moderationCase = await this.findCaseOrFail(caseId);

    if (moderationCase.status === "resolved") {
      throw new BadRequestException(`Moderation case ${caseId} is already resolved.`);
    }

    const reason = this.normalizeReason(body.reason);
    if (["rejected", "needs_correction", "hidden", "escalated"].includes(outcome) && !reason) {
      throw new BadRequestException("A reason is required for this moderation outcome.");
    }

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

    return {
      caseId: moderationCase.id,
      publicationCaseId: publicationCase.id,
      outcome,
      reason,
      status: moderationCase.status,
      publicationCaseStatus
    };
  }

  listReports() {
    return [
      {
        reportId: "report_scaffold",
        status: "open",
        triagePriority: "normal"
      }
    ];
  }

  getReport(reportId: string) {
    return {
      reportId,
      status: "open",
      triagePriority: "normal"
    };
  }

  createReport(intakeSource: string) {
    return {
      reportId: "report_scaffold",
      intakeSource,
      status: "open",
      triagePriority: "normal"
    };
  }

  triageReport(reportId: string) {
    return {
      reportId,
      status: "triaged"
    };
  }

  resolveReport(reportId: string) {
    return {
      reportId,
      status: "resolved"
    };
  }

  dismissReport(reportId: string) {
    return {
      reportId,
      status: "dismissed"
    };
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

  private async findCaseOrFail(caseId: string): Promise<ModerationCaseEntity> {
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

  private async toResponse(moderationCase: ModerationCaseEntity): Promise<ModerationCaseResponseDto> {
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

  private normalizeReason(value: string | undefined): string | null {
    if (value === undefined) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private createScopedId(prefix: string): string {
    return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
  }
}
