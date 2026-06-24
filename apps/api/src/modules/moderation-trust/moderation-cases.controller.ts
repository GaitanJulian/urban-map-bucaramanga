import { Body, Controller, Get, Param, Post, UseGuards, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../identity-access/guards/auth.guard.js";
import { RolesGuard } from "../identity-access/guards/roles.guard.js";
import { Roles } from "../identity-access/guards/roles.decorator.js";
import { ModerationTrustService } from "./moderation-trust.service.js";
import {
  ModerationCaseDecisionResponseDto,
  ModerationCaseDecisionRequestDto,
  ModerationCaseResponseDto
} from "./dto/moderation-trust.dto.js";

@ApiTags("Moderation Trust")
@UseGuards(AuthGuard, RolesGuard)
@Roles("moderator")
@Controller("moderation/cases")
export class ModerationCasesController {
  constructor(private readonly moderationTrustService: ModerationTrustService) {}

  @Version("2")
  @Get()
  @ApiOperation({ summary: "List moderation cases scaffold" })
  @ApiOkResponse({ type: ModerationCaseResponseDto, isArray: true })
  list(): Promise<ModerationCaseResponseDto[]> {
    return this.moderationTrustService.listCases();
  }

  @Version("2")
  @Get(":caseId")
  @ApiOperation({ summary: "Get moderation case scaffold" })
  @ApiOkResponse({ type: ModerationCaseResponseDto })
  get(@Param("caseId") caseId: string): Promise<ModerationCaseResponseDto> {
    return this.moderationTrustService.getCase(caseId);
  }

  @Version("2")
  @Post(":caseId/approve")
  @ApiOperation({ summary: "Approve moderation case scaffold" })
  @ApiOkResponse({ type: ModerationCaseDecisionResponseDto })
  approve(
    @Param("caseId") caseId: string,
    @Body() body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    return this.moderationTrustService.decideCase(caseId, "approved", body);
  }

  @Version("2")
  @Post(":caseId/reject")
  @ApiOperation({ summary: "Reject moderation case scaffold" })
  @ApiOkResponse({ type: ModerationCaseDecisionResponseDto })
  reject(
    @Param("caseId") caseId: string,
    @Body() body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    return this.moderationTrustService.decideCase(caseId, "rejected", body);
  }

  @Version("2")
  @Post(":caseId/request-correction")
  @ApiOperation({ summary: "Request correction scaffold" })
  @ApiOkResponse({ type: ModerationCaseDecisionResponseDto })
  requestCorrection(
    @Param("caseId") caseId: string,
    @Body() body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    return this.moderationTrustService.decideCase(caseId, "needs_correction", body);
  }

  @Version("2")
  @Post(":caseId/hide")
  @ApiOperation({ summary: "Hide moderation case scaffold" })
  @ApiOkResponse({ type: ModerationCaseDecisionResponseDto })
  hide(
    @Param("caseId") caseId: string,
    @Body() body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    return this.moderationTrustService.decideCase(caseId, "hidden", body);
  }

  @Version("2")
  @Post(":caseId/escalate")
  @ApiOperation({ summary: "Escalate moderation case scaffold" })
  @ApiOkResponse({ type: ModerationCaseDecisionResponseDto })
  escalate(
    @Param("caseId") caseId: string,
    @Body() body: ModerationCaseDecisionRequestDto
  ): Promise<ModerationCaseDecisionResponseDto> {
    return this.moderationTrustService.decideCase(caseId, "escalated", body);
  }
}
