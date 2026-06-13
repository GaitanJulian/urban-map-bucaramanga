import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { ModerationOutcome } from "@umb/shared";

export class ModerationCaseResponseDto {
  @ApiProperty({ example: "case_scaffold" })
  caseId!: string;

  @ApiProperty({ example: "publication_case_scaffold" })
  publicationCaseId!: string;

  @ApiPropertyOptional({ example: "draft_scaffold", nullable: true })
  draftId?: string | null;

  @ApiPropertyOptional({ example: "pending", nullable: true })
  publicationCaseStatus?: string | null;

  @ApiProperty({ example: "pending" })
  status!: string;

  @ApiProperty({ example: "normal" })
  priority!: string;

  @ApiPropertyOptional({
    example: "approved",
    enum: ["approved", "rejected", "needs_correction", "hidden", "escalated", "resolved"]
  })
  decisionOutcome?: ModerationOutcome | null;

  @ApiPropertyOptional({ example: "Falta verificación de ubicación", nullable: true })
  decisionReason?: string | null;
}

export class ModerationCaseDecisionRequestDto {
  @ApiPropertyOptional({ example: "Falta verificación de ubicación" })
  reason?: string;
}

export class ModerationCaseDecisionResponseDto {
  @ApiProperty({ example: "case_scaffold" })
  caseId!: string;

  @ApiProperty({ example: "publication_case_scaffold" })
  publicationCaseId!: string;

  @ApiProperty({
    example: "approved",
    enum: ["approved", "rejected", "needs_correction", "hidden", "escalated", "resolved"]
  })
  outcome!: ModerationOutcome;

  @ApiPropertyOptional({ example: "Falta verificación de ubicación", nullable: true })
  reason?: string | null;

  @ApiProperty({ example: "resolved" })
  status!: string;

  @ApiPropertyOptional({ example: "approved", nullable: true })
  publicationCaseStatus?: string | null;
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
