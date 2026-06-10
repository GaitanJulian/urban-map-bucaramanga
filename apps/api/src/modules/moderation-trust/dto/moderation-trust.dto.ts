import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { ModerationOutcome } from "@umb/shared";

export class ModerationCaseResponseDto {
  @ApiProperty({ example: "case_scaffold" })
  caseId!: string;

  @ApiProperty({ example: "pending" })
  status!: string;

  @ApiProperty({ example: "normal" })
  priority!: string;

  @ApiPropertyOptional({ example: "approved", enum: ["approved", "rejected", "needs_correction", "hidden", "escalated", "resolved"] })
  decisionOutcome?: ModerationOutcome | null;
}

export class ModerationCaseDecisionResponseDto {
  @ApiProperty({ example: "case_scaffold" })
  caseId!: string;

  @ApiProperty({ example: "approved", enum: ["approved", "rejected", "needs_correction", "hidden", "escalated", "resolved"] })
  outcome!: ModerationOutcome;
}

export class ReportResponseDto {
  @ApiProperty({ example: "report_scaffold" })
  reportId!: string;

  @ApiProperty({ example: "open" })
  status!: string;

  @ApiProperty({ example: "normal" })
  triagePriority!: string;
}

export class CreateReportRequestDto {
  @ApiProperty({ example: "moderator" })
  intakeSource!: string;
}

export class ReportTriageResponseDto {
  @ApiProperty({ example: "report_scaffold" })
  reportId!: string;

  @ApiProperty({ example: "triaged" })
  status!: string;
}
