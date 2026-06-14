import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { ModerationOutcome } from "@umb/shared";

export class ModerationDraftSnapshotDto {
  @ApiProperty({ example: "draft_scaffold" })
  draftId!: string;

  @ApiProperty({ example: "Concierto en Bucaramanga" })
  title!: string;

  @ApiPropertyOptional({ example: "Resumen corto", nullable: true })
  summary?: string | null;

  @ApiPropertyOptional({ example: "Descripcion del evento", nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ example: "cat_music", nullable: true })
  categoryId?: string | null;

  @ApiPropertyOptional({ example: "zone_cabecera", nullable: true })
  zoneId?: string | null;

  @ApiPropertyOptional({ example: "Teatro Santander", nullable: true })
  venueName?: string | null;

  @ApiPropertyOptional({ example: "Calle 33 #18-60", nullable: true })
  address?: string | null;

  @ApiPropertyOptional({ example: "2026-07-01T19:00:00.000Z", nullable: true })
  startsAt?: string | null;

  @ApiPropertyOptional({ example: "2026-07-01T22:00:00.000Z", nullable: true })
  endsAt?: string | null;

  @ApiProperty({ example: true })
  isFree!: boolean;

  @ApiPropertyOptional({ example: "Gratis", nullable: true })
  costLabel?: string | null;
}

export class ModerationCaseResponseDto {
  @ApiProperty({ example: "case_scaffold" })
  caseId!: string;

  @ApiProperty({ example: "publication_case_scaffold" })
  publicationCaseId!: string;

  @ApiPropertyOptional({ example: "draft_scaffold", nullable: true })
  draftId?: string | null;

  @ApiPropertyOptional({ example: "pending", nullable: true })
  publicationCaseStatus?: string | null;

  @ApiPropertyOptional({ example: "2026-06-13T12:00:00.000Z", nullable: true })
  submittedAt?: string | null;

  @ApiPropertyOptional({ example: "2026-06-13T12:00:00.000Z", nullable: true })
  createdAt?: string | null;

  @ApiPropertyOptional({ type: ModerationDraftSnapshotDto, nullable: true })
  draft?: ModerationDraftSnapshotDto | null;

  @ApiPropertyOptional({ type: Object, nullable: true })
  submittedSnapshot?: Record<string, unknown> | null;

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
  @ApiProperty({ example: "Falta verificación de ubicación" })
  reason!: string;
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

export class ReportSignalResponseDto {
  @ApiProperty({ example: "signal_scaffold" })
  signalId!: string;

  @ApiProperty({ example: "Se reporta contenido repetido" })
  description!: string;

  @ApiPropertyOptional({ example: "evidence://image/123", nullable: true })
  evidenceRef?: string | null;

  @ApiProperty({ example: "2026-06-13T12:00:00.000Z" })
  createdAt!: string;
}

export class ReportResponseDto {
  @ApiProperty({ example: "report_scaffold" })
  reportId!: string;

  @ApiProperty({ example: "evt_001" })
  targetEventId!: string;

  @ApiPropertyOptional({ example: "Concierto al aire libre", nullable: true })
  targetEventTitle?: string | null;

  @ApiProperty({ example: "open" })
  status!: string;

  @ApiProperty({ example: "normal" })
  triagePriority!: string;

  @ApiProperty({ example: "Contenido potencialmente duplicado" })
  reason!: string;

  @ApiPropertyOptional({ example: "Motivo de la última decisión", nullable: true })
  decisionReason?: string | null;

  @ApiPropertyOptional({ example: "2026-06-13T12:00:00.000Z", nullable: true })
  resolvedAt?: string | null;

  @ApiProperty({ type: [ReportSignalResponseDto] })
  signals!: ReportSignalResponseDto[];
}

export class CreateReportRequestDto {
  @ApiProperty({ example: "evt_001" })
  targetEventId!: string;

  @ApiProperty({ example: "Contenido potencialmente duplicado" })
  reason!: string;

  @ApiProperty({ example: "Se observan descripciones muy similares entre dos publicaciones." })
  description!: string;

  @ApiPropertyOptional({ example: "evidence://image/123" })
  evidenceRef?: string;

  @ApiPropertyOptional({ example: "moderator" })
  intakeSource?: string;

  @ApiPropertyOptional({ example: "actor_scaffold" })
  intakeActorAccountId?: string;
}

export class ReportActionRequestDto {
  @ApiProperty({ example: "Se confirmó duplicidad o riesgo para el público." })
  reason!: string;
}

export class ReportActionResponseDto {
  @ApiProperty({ example: "report_scaffold" })
  reportId!: string;

  @ApiProperty({ example: "triaged", enum: ["open", "triaged", "in_review", "waiting_correction", "resolved", "dismissed", "hidden", "escalated"] })
  status!: string;

  @ApiProperty({ example: "normal" })
  triagePriority!: string;

  @ApiPropertyOptional({ example: "Se confirmó duplicidad o riesgo para el público.", nullable: true })
  decisionReason?: string | null;
}

export class EscalationResponseDto {
  @ApiProperty({ example: "escalation_scaffold" })
  escalationId!: string;

  @ApiPropertyOptional({ example: "report_scaffold", nullable: true })
  reportCaseId?: string | null;

  @ApiPropertyOptional({ example: "case_scaffold", nullable: true })
  moderationCaseId?: string | null;

  @ApiProperty({ example: "open" })
  status!: string;

  @ApiProperty({ example: "Escalado por ambigüedad" })
  reason!: string;
}
