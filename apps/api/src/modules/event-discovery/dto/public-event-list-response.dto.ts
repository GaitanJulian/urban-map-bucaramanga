import { ApiProperty } from "@nestjs/swagger";
import { PublicEventDto } from "./public-event.dto.js";

export class PublicEventPaginationDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;

  @ApiProperty({ example: 0 })
  totalItems!: number;

  @ApiProperty({ example: 0 })
  totalPages!: number;
}

export class AppliedFiltersDto {
  @ApiProperty({ required: false, example: "music" })
  categoryId?: string;

  @ApiProperty({ required: false, example: "cabecera" })
  zoneId?: string;
}

export class PublicEventListResponseDto {
  @ApiProperty({ type: [PublicEventDto] })
  items!: PublicEventDto[];

  @ApiProperty({ type: PublicEventPaginationDto })
  pagination!: PublicEventPaginationDto;

  @ApiProperty({ type: AppliedFiltersDto })
  appliedFilters!: AppliedFiltersDto;
}
