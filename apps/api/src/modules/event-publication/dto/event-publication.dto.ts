import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { PublicationStatus } from "@umb/shared";

export class DraftResponseDto {
  @ApiProperty({ example: "draft_scaffold" })
  draftId!: string;

  @ApiProperty({ example: "Borrador de Release 2" })
  title!: string;

  @ApiProperty({ example: "draft", enum: ["draft", "incomplete", "ready_for_review", "pending", "changes_requested", "approved", "published", "cancelled"] })
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
}

export class UpdateDraftRequestDto {
  @ApiPropertyOptional({ example: "Nuevo título del evento" })
  title?: string;
}

export class CreateDraftRequestDto {
  @ApiPropertyOptional({ example: "Fundacion Cultural Bucaramanga" })
  organizerProfileId?: string;
}
