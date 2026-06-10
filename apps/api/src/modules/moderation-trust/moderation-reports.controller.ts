import { Body, Controller, Get, Param, Post, Version } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ModerationTrustService } from "./moderation-trust.service.js";
import {
  CreateReportRequestDto,
  ReportResponseDto,
  ReportTriageResponseDto
} from "./dto/moderation-trust.dto.js";

@ApiTags("Moderation Trust")
@Controller("moderation/reports")
export class ModerationReportsController {
  constructor(private readonly moderationTrustService: ModerationTrustService) {}

  @Version("2")
  @Get()
  @ApiOperation({ summary: "List report cases scaffold" })
  @ApiOkResponse({ type: ReportResponseDto, isArray: true })
  list(): ReportResponseDto[] {
    return this.moderationTrustService.listReports();
  }

  @Version("2")
  @Get(":reportId")
  @ApiOperation({ summary: "Get report case scaffold" })
  @ApiOkResponse({ type: ReportResponseDto })
  get(@Param("reportId") reportId: string): ReportResponseDto {
    return this.moderationTrustService.getReport(reportId);
  }

  @Version("2")
  @Post()
  @ApiOperation({ summary: "Create protected report scaffold" })
  @ApiCreatedResponse({ type: ReportResponseDto })
  create(@Body() body: CreateReportRequestDto): ReportResponseDto {
    return this.moderationTrustService.createReport(body.intakeSource);
  }

  @Version("2")
  @Post(":reportId/triage")
  @ApiOperation({ summary: "Triage report scaffold" })
  @ApiOkResponse({ type: ReportTriageResponseDto })
  triage(@Param("reportId") reportId: string): ReportTriageResponseDto {
    return this.moderationTrustService.triageReport(reportId);
  }

  @Version("2")
  @Post(":reportId/resolve")
  @ApiOperation({ summary: "Resolve report scaffold" })
  @ApiOkResponse({ type: ReportTriageResponseDto })
  resolve(@Param("reportId") reportId: string): ReportTriageResponseDto {
    return this.moderationTrustService.resolveReport(reportId);
  }

  @Version("2")
  @Post(":reportId/dismiss")
  @ApiOperation({ summary: "Dismiss report scaffold" })
  @ApiOkResponse({ type: ReportTriageResponseDto })
  dismiss(@Param("reportId") reportId: string): ReportTriageResponseDto {
    return this.moderationTrustService.dismissReport(reportId);
  }
}
