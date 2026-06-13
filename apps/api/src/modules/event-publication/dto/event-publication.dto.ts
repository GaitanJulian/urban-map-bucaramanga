import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { PublicationStatus } from "@umb/shared";

export class DraftResponseDto {
  @ApiProperty({ example: "draft_scaffold" })
  draftId!: string;

  @ApiProperty({ example: "Borrador de Release 2" })
  title!: string;

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
}
