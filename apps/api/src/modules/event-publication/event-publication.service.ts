import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "node:crypto";
import { In, Repository } from "typeorm";
import { CreateDraftRequestDto, DraftMutationResponseDto, DraftResponseDto, DraftValidationResponseDto, UpdateDraftRequestDto } from "./dto/event-publication.dto.js";
import { EventDraftEntity } from "./entities/event-draft.entity.js";
import { PublicationCaseEntity } from "./entities/publication-case.entity.js";

@Injectable()
export class EventPublicationService {
  constructor(
    @InjectRepository(EventDraftEntity)
    private readonly draftRepository: Repository<EventDraftEntity>,
    @InjectRepository(PublicationCaseEntity)
    private readonly publicationCaseRepository: Repository<PublicationCaseEntity>
  ) {}

  async createDraft(body: CreateDraftRequestDto): Promise<DraftResponseDto> {
    const draft = this.draftRepository.create({
      id: this.createScopedId("draft"),
      organizerProfileId: body.organizerProfileId?.trim() || null,
      title: this.normalizeText(body.title) ?? "Borrador de Release 2",
      summary: this.normalizeText(body.summary),
      description: this.normalizeText(body.description),
      categoryId: null,
      locationId: null,
      zoneId: null,
      startsAt: null,
      endsAt: null,
      costLabel: null,
      isFree: false,
      publicationStatus: "draft",
      visibilityState: "private"
    });

    await this.draftRepository.save(draft);
    return this.toDraftResponse(draft, null);
  }

  async listDrafts(): Promise<DraftResponseDto[]> {
    const drafts = await this.draftRepository.find({
      order: {
        updatedAt: "DESC"
      }
    });
    const latestPublicationCases = await this.loadLatestPublicationCases(drafts.map((draft) => draft.id));

    return drafts.map((draft) => this.toDraftResponse(draft, latestPublicationCases.get(draft.id) ?? null));
  }

  async getDraft(draftId: string): Promise<DraftResponseDto> {
    const draft = await this.findDraftOrFail(draftId);
    const latestPublicationCase = await this.findLatestPublicationCase(draftId);
    return this.toDraftResponse(draft, latestPublicationCase);
  }

  async updateDraft(draftId: string, body: UpdateDraftRequestDto): Promise<DraftMutationResponseDto> {
    const draft = await this.findDraftOrFail(draftId);

    if (body.title !== undefined) {
      draft.title = this.normalizeText(body.title) ?? draft.title;
    }
    if (body.summary !== undefined) {
      draft.summary = this.normalizeText(body.summary);
    }
    if (body.description !== undefined) {
      draft.description = this.normalizeText(body.description);
    }

    draft.updatedAt = new Date();
    await this.draftRepository.save(draft);

    const latestPublicationCase = await this.findLatestPublicationCase(draftId);
    return this.toMutationResponse(draft, latestPublicationCase?.id ?? null, false);
  }

  async saveDraft(draftId: string): Promise<DraftMutationResponseDto> {
    const draft = await this.findDraftOrFail(draftId);
    const validation = this.validateDraftState(draft);
    draft.publicationStatus = validation.isValid ? "ready_for_review" : "incomplete";
    draft.updatedAt = new Date();

    await this.draftRepository.save(draft);

    const latestPublicationCase = await this.findLatestPublicationCase(draftId);
    return this.toMutationResponse(draft, latestPublicationCase?.id ?? null, true);
  }

  async validateDraft(draftId: string): Promise<DraftValidationResponseDto> {
    const draft = await this.findDraftOrFail(draftId);
    const validation = this.validateDraftState(draft);
    return {
      draftId: draft.id,
      isValid: validation.isValid,
      issues: validation.issues
    };
  }

  async submitDraft(draftId: string): Promise<DraftMutationResponseDto> {
    const draft = await this.findDraftOrFail(draftId);
    const validation = this.validateDraftState(draft);

    if (!validation.isValid) {
      throw new BadRequestException({
        message: "Draft does not meet minimum publication requirements.",
        issues: validation.issues
      });
    }

    const publicationCase = this.publicationCaseRepository.create({
      id: this.createScopedId("publication_case"),
      eventDraftId: draft.id,
      submittedByActorAccountId: null,
      status: "submitted",
      submittedAt: new Date(),
      reviewedAt: null,
      reviewDecisionId: null,
      criticalChangeFlag: false
    });

    draft.publicationStatus = "pending";
    draft.updatedAt = new Date();

    await this.publicationCaseRepository.save(publicationCase);
    await this.draftRepository.save(draft);

    return this.toMutationResponse(draft, publicationCase.id, false);
  }

  async cancelDraft(draftId: string): Promise<DraftMutationResponseDto> {
    const draft = await this.findDraftOrFail(draftId);
    draft.publicationStatus = "cancelled";
    draft.updatedAt = new Date();

    const latestPublicationCase = await this.findLatestPublicationCase(draftId);
    if (latestPublicationCase && ["submitted", "in_review"].includes(latestPublicationCase.status)) {
      latestPublicationCase.status = "cancelled";
      latestPublicationCase.reviewedAt = new Date();
      latestPublicationCase.updatedAt = new Date();
      await this.publicationCaseRepository.save(latestPublicationCase);
    }

    await this.draftRepository.save(draft);
    return this.toMutationResponse(draft, latestPublicationCase?.id ?? null, false);
  }

  private async findDraftOrFail(draftId: string): Promise<EventDraftEntity> {
    const draft = await this.draftRepository.findOne({ where: { id: draftId } });
    if (!draft) {
      throw new NotFoundException(`Draft ${draftId} not found.`);
    }

    return draft;
  }

  private async findLatestPublicationCase(draftId: string): Promise<PublicationCaseEntity | null> {
    return this.publicationCaseRepository.findOne({
      where: { eventDraftId: draftId },
      order: { createdAt: "DESC" }
    });
  }

  private async loadLatestPublicationCases(draftIds: string[]): Promise<Map<string, PublicationCaseEntity>> {
    if (draftIds.length === 0) {
      return new Map<string, PublicationCaseEntity>();
    }

    const cases = await this.publicationCaseRepository.find({
      where: { eventDraftId: In(draftIds) },
      order: { createdAt: "DESC" }
    });

    const latestByDraft = new Map<string, PublicationCaseEntity>();
    for (const publicationCase of cases) {
      if (!latestByDraft.has(publicationCase.eventDraftId)) {
        latestByDraft.set(publicationCase.eventDraftId, publicationCase);
      }
    }

    return latestByDraft;
  }

  private validateDraftState(draft: EventDraftEntity): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!this.hasText(draft.title)) {
      issues.push("title is required");
    }
    if (!this.hasText(draft.summary)) {
      issues.push("summary is required");
    }
    if (!this.hasText(draft.description)) {
      issues.push("description is required");
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  private toDraftResponse(draft: EventDraftEntity, publicationCase: PublicationCaseEntity | null): DraftResponseDto {
    return {
      draftId: draft.id,
      title: draft.title,
      organizerProfileId: draft.organizerProfileId,
      publicationCaseId: publicationCase?.id ?? null,
      publicationStatus: draft.publicationStatus
    };
  }

  private toMutationResponse(
    draft: EventDraftEntity,
    publicationCaseId: string | null,
    saved: boolean
  ): DraftMutationResponseDto {
    return {
      draftId: draft.id,
      saved,
      publicationStatus: draft.publicationStatus,
      publicationCaseId
    };
  }

  private createScopedId(prefix: string): string {
    return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
  }

  private normalizeText(value: string | undefined): string | null {
    if (value === undefined) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private hasText(value: string | null): boolean {
    return typeof value === "string" && value.trim().length > 0;
  }
}
