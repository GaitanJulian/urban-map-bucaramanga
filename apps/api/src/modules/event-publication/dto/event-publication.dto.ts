import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { PublicationStatus } from "@umb/shared";

export class DraftResponseDto {
  @ApiProperty({ example: "draft_scaffold" })
  draftId!: string;

  @ApiProperty({ example: "Borrador de Release 2" })
  title!: string;

  @ApiPropertyOptional({ example: "Resumen corto del evento", nullable: true })
  summary?: string | null;

  @ApiPropertyOptional({ example: "Descripcion larga del borrador", nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ example: "cat_music", nullable: true })
  categoryId?: string | null;

  @ApiPropertyOptional({ example: "zone_cabecera", nullable: true })
  zoneId?: string | null;

  @ApiPropertyOptional({ example: "Teatro Santander", nullable: true })
  venueName?: string | null;

  @ApiPropertyOptional({ example: "Calle 33 #18-60", nullable: true })
  address?: string | null;

  @ApiPropertyOptional({ example: "2026-06-21T19:00:00.000Z", nullable: true })
  startsAt?: string | null;

  @ApiPropertyOptional({ example: "2026-06-21T22:00:00.000Z", nullable: true })
  endsAt?: string | null;

  @ApiPropertyOptional({ example: true })
  isFree?: boolean;

  @ApiPropertyOptional({ example: "Gratis", nullable: true })
  costLabel?: string | null;

  @ApiPropertyOptional({ example: "organizer_scaffold" })
  organizerProfileId?: string | null;

  @ApiPropertyOptional({ example: "publication_case_scaffold" })
  publicationCaseId?: string | null;

  @ApiPropertyOptional({ example: "submitted", nullable: true })
  publicationCaseStatus?: string | null;

  @ApiProperty({
    example: "draft",
    enum: ["draft", "incomplete", "ready_for_review", "pending", "changes_requested", "approved", "published", "cancelled"]
  })
  publicationStatus!: PublicationStatus;
}

export class DraftValidationResponseDto {
  @ApiProperty({ example: "draft_scaffold" })
  draftId!: string;

  @ApiProperty({ example: false })
  isValid!: boolean;

  @ApiProperty({ type: [String] })
  issues!: string[];
}

export class DraftMutationResponseDto {
  @ApiProperty({ example: "draft_scaffold" })
  draftId!: string;

  @ApiPropertyOptional({ example: true })
  saved?: boolean;

  @ApiPropertyOptional({ example: "pending" })
  publicationStatus?: PublicationStatus;

  @ApiPropertyOptional({ example: "publication_case_scaffold" })
  publicationCaseId?: string | null;

  @ApiPropertyOptional({ example: "submitted", nullable: true })
  publicationCaseStatus?: string | null;
}

export class UpdateDraftRequestDto {
  @ApiPropertyOptional({ example: "Nuevo titulo del evento" })
  title?: string;

  @ApiPropertyOptional({ example: "Resumen corto del evento" })
  summary?: string;

  @ApiPropertyOptional({ example: "Descripcion larga del borrador" })
  description?: string;

  @ApiPropertyOptional({ example: "cat_music" })
  categoryId?: string;

  @ApiPropertyOptional({ example: "zone_cabecera" })
  zoneId?: string;

  @ApiPropertyOptional({ example: "Teatro Santander" })
  venueName?: string;

  @ApiPropertyOptional({ example: "Calle 33 #18-60" })
  address?: string;

  @ApiPropertyOptional({ example: "2026-06-21T19:00:00.000Z" })
  startsAt?: string;

  @ApiPropertyOptional({ example: "2026-06-21T22:00:00.000Z" })
  endsAt?: string;

  @ApiPropertyOptional({ example: true })
  isFree?: boolean;

  @ApiPropertyOptional({ example: "Gratis" })
  costLabel?: string;
}

export class CreateDraftRequestDto {
  @ApiPropertyOptional({ example: "Fundacion Cultural Bucaramanga" })
  organizerProfileId?: string;

  @ApiPropertyOptional({ example: "Borrador de Release 2" })
  title?: string;

  @ApiPropertyOptional({ example: "Resumen corto del evento" })
  summary?: string;

  @ApiPropertyOptional({ example: "Descripcion larga del borrador" })
  description?: string;

  @ApiPropertyOptional({ example: "cat_music" })
  categoryId?: string;

  @ApiPropertyOptional({ example: "zone_cabecera" })
  zoneId?: string;

  @ApiPropertyOptional({ example: "Teatro Santander" })
  venueName?: string;

  @ApiPropertyOptional({ example: "Calle 33 #18-60" })
  address?: string;

  @ApiPropertyOptional({ example: "2026-06-21T19:00:00.000Z" })
  startsAt?: string;

  @ApiPropertyOptional({ example: "2026-06-21T22:00:00.000Z" })
  endsAt?: string;

  @ApiPropertyOptional({ example: true })
  isFree?: boolean;

  @ApiPropertyOptional({ example: "Gratis" })
  costLabel?: string;
}
