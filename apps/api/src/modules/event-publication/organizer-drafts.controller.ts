import { Body, Controller, Get, Param, Patch, Post, UseGuards, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../identity-access/guards/auth.guard.js";
import { RolesGuard } from "../identity-access/guards/roles.guard.js";
import { Roles } from "../identity-access/guards/roles.decorator.js";
import { CurrentUser } from "../identity-access/guards/current-user.decorator.js";
import type { AuthUser } from "../identity-access/better-auth.js";
import { EventPublicationService } from "./event-publication.service.js";
import {
  CreateDraftRequestDto,
  DraftMutationResponseDto,
  DraftResponseDto,
  DraftValidationResponseDto,
  UpdateDraftRequestDto
} from "./dto/event-publication.dto.js";

@ApiTags("Event Publication")
@UseGuards(AuthGuard, RolesGuard)
@Roles("organizer")
@Controller("organizer/drafts")
export class OrganizerDraftsController {
  constructor(private readonly eventPublicationService: EventPublicationService) {}

  @Version("2")
  @Post()
  @ApiOperation({ summary: "Create a draft owned by the authenticated organizer" })
  @ApiCreatedResponse({ type: DraftResponseDto })
  create(@Body() body: CreateDraftRequestDto, @CurrentUser() user: AuthUser): Promise<DraftResponseDto> {
    return this.eventPublicationService.createDraft(body, user.id);
  }

  @Version("2")
  @Get()
  @ApiOperation({ summary: "List drafts owned by the authenticated organizer" })
  @ApiOkResponse({ type: DraftResponseDto, isArray: true })
  list(@CurrentUser() user: AuthUser): Promise<DraftResponseDto[]> {
    return this.eventPublicationService.listDrafts(user.id);
  }

  @Version("2")
  @Get(":draftId")
  @ApiOperation({ summary: "Get an own draft" })
  @ApiOkResponse({ type: DraftResponseDto })
  get(@Param("draftId") draftId: string, @CurrentUser() user: AuthUser): Promise<DraftResponseDto> {
    return this.eventPublicationService.getDraft(draftId, user.id);
  }

  @Version("2")
  @Patch(":draftId")
  @ApiOperation({ summary: "Update an own draft" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  update(
    @Param("draftId") draftId: string,
    @Body() body: UpdateDraftRequestDto,
    @CurrentUser() user: AuthUser
  ): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.updateDraft(draftId, body, user.id);
  }

  @Version("2")
  @Post(":draftId/save")
  @ApiOperation({ summary: "Save progress on an own draft" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  save(@Param("draftId") draftId: string, @CurrentUser() user: AuthUser): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.saveDraft(draftId, user.id);
  }

  @Version("2")
  @Post(":draftId/validate")
  @ApiOperation({ summary: "Validate an own draft" })
  @ApiOkResponse({ type: DraftValidationResponseDto })
  validate(@Param("draftId") draftId: string, @CurrentUser() user: AuthUser): Promise<DraftValidationResponseDto> {
    return this.eventPublicationService.validateDraft(draftId, user.id);
  }

  @Version("2")
  @Post(":draftId/submit")
  @ApiOperation({ summary: "Submit an own draft for review" })
  @ApiBadRequestResponse({ description: "Validation failure" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  submit(@Param("draftId") draftId: string, @CurrentUser() user: AuthUser): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.submitDraft(draftId, user.id);
  }

  @Version("2")
  @Post(":draftId/cancel")
  @ApiOperation({ summary: "Cancel an own draft" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  cancel(@Param("draftId") draftId: string, @CurrentUser() user: AuthUser): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.cancelDraft(draftId, user.id);
  }
}
