import { Body, Controller, Get, Param, Post, Version } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ModerationTrustService } from "./moderation-trust.service.js";
import {
  CreateReportRequestDto,
  ReportActionRequestDto,
  ReportActionResponseDto,
  ReportResponseDto
} from "./dto/moderation-trust.dto.js";

@ApiTags("Moderation Trust")
@Controller("moderation/reports")
export class ModerationReportsController {
  constructor(private readonly moderationTrustService: ModerationTrustService) {}

  @Version("2")
  @Get()
  @ApiOperation({ summary: "List report cases scaffold" })
  @ApiOkResponse({ type: ReportResponseDto, isArray: true })
  list(): Promise<ReportResponseDto[]> {
    return this.moderationTrustService.listReports();
  }

  @Version("2")
  @Get(":reportId")
  @ApiOperation({ summary: "Get report case scaffold" })
  @ApiOkResponse({ type: ReportResponseDto })
  get(@Param("reportId") reportId: string): Promise<ReportResponseDto> {
    return this.moderationTrustService.getReport(reportId);
  }

  @Version("2")
  @Post()
  @ApiOperation({ summary: "Create protected report scaffold" })
  @ApiCreatedResponse({ type: ReportResponseDto })
  create(@Body() body: CreateReportRequestDto): Promise<ReportResponseDto> {
    return this.moderationTrustService.createReport(body);
  }

  @Version("2")
  @Post(":reportId/triage")
  @ApiOperation({ summary: "Triage report scaffold" })
  @ApiOkResponse({ type: ReportActionResponseDto })
  triage(@Param("reportId") reportId: string, @Body() body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    return this.moderationTrustService.triageReport(reportId, body);
  }

  @Version("2")
  @Post(":reportId/resolve")
  @ApiOperation({ summary: "Resolve report scaffold" })
  @ApiOkResponse({ type: ReportActionResponseDto })
  resolve(@Param("reportId") reportId: string, @Body() body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    return this.moderationTrustService.resolveReport(reportId, body);
  }

  @Version("2")
  @Post(":reportId/dismiss")
  @ApiOperation({ summary: "Dismiss report scaffold" })
  @ApiOkResponse({ type: ReportActionResponseDto })
  dismiss(@Param("reportId") reportId: string, @Body() body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    return this.moderationTrustService.dismissReport(reportId, body);
  }

  @Version("2")
  @Post(":reportId/hide")
  @ApiOperation({ summary: "Hide report target scaffold" })
  @ApiOkResponse({ type: ReportActionResponseDto })
  hide(@Param("reportId") reportId: string, @Body() body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    return this.moderationTrustService.hideReport(reportId, body);
  }

  @Version("2")
  @Post(":reportId/escalate")
  @ApiOperation({ summary: "Escalate report scaffold" })
  @ApiOkResponse({ type: ReportActionResponseDto })
  escalate(@Param("reportId") reportId: string, @Body() body: ReportActionRequestDto): Promise<ReportActionResponseDto> {
    return this.moderationTrustService.escalateReport(reportId, body);
  }
}
