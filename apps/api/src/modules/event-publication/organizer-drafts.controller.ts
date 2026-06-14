import { Body, Controller, Get, Param, Patch, Post, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { EventPublicationService } from "./event-publication.service.js";
import {
  CreateDraftRequestDto,
  DraftMutationResponseDto,
  DraftResponseDto,
  DraftValidationResponseDto,
  UpdateDraftRequestDto
} from "./dto/event-publication.dto.js";

@ApiTags("Event Publication")
@Controller("organizer/drafts")
export class OrganizerDraftsController {
  constructor(private readonly eventPublicationService: EventPublicationService) {}

  @Version("2")
  @Post()
  @ApiOperation({ summary: "Create a draft scaffold" })
  @ApiCreatedResponse({ type: DraftResponseDto })
  create(@Body() body: CreateDraftRequestDto): Promise<DraftResponseDto> {
    return this.eventPublicationService.createDraft(body);
  }

  @Version("2")
  @Get()
  @ApiOperation({ summary: "List organizer drafts scaffold" })
  @ApiOkResponse({ type: DraftResponseDto, isArray: true })
  list(): Promise<DraftResponseDto[]> {
    return this.eventPublicationService.listDrafts();
  }

  @Version("2")
  @Get(":draftId")
  @ApiOperation({ summary: "Get draft scaffold" })
  @ApiOkResponse({ type: DraftResponseDto })
  get(@Param("draftId") draftId: string): Promise<DraftResponseDto> {
    return this.eventPublicationService.getDraft(draftId);
  }

  @Version("2")
  @Patch(":draftId")
  @ApiOperation({ summary: "Update draft scaffold" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  update(@Param("draftId") draftId: string, @Body() body: UpdateDraftRequestDto): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.updateDraft(draftId, body);
  }

  @Version("2")
  @Post(":draftId/save")
  @ApiOperation({ summary: "Save draft progress scaffold" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  save(@Param("draftId") draftId: string): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.saveDraft(draftId);
  }

  @Version("2")
  @Post(":draftId/validate")
  @ApiOperation({ summary: "Validate draft scaffold" })
  @ApiOkResponse({ type: DraftValidationResponseDto })
  validate(@Param("draftId") draftId: string): Promise<DraftValidationResponseDto> {
    return this.eventPublicationService.validateDraft(draftId);
  }

  @Version("2")
  @Post(":draftId/submit")
  @ApiOperation({ summary: "Submit draft for review scaffold" })
  @ApiBadRequestResponse({ description: "Scaffold placeholder validation failure" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  submit(@Param("draftId") draftId: string): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.submitDraft(draftId);
  }

  @Version("2")
  @Post(":draftId/cancel")
  @ApiOperation({ summary: "Cancel draft scaffold" })
  @ApiOkResponse({ type: DraftMutationResponseDto })
  cancel(@Param("draftId") draftId: string): Promise<DraftMutationResponseDto> {
    return this.eventPublicationService.cancelDraft(draftId);
  }
}
