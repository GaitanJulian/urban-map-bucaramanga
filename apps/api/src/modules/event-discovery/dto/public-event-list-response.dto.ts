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
  @ApiProperty({ example: "Bucaramanga" })
  scope!: string;

  @ApiProperty({ example: "visible" })
  visibilityState!: string;

  @ApiProperty({ example: ["upcoming", "live"], isArray: true })
  lifecycle!: string[];

  @ApiProperty({ required: false, example: "concierto" })
  q?: string;

  @ApiProperty({ required: false, example: "cat_music" })
  categoryId?: string;

  @ApiProperty({ required: false, example: "zone_cabecera" })
  zoneId?: string;

  @ApiProperty({ required: false, example: "2026-06-01" })
  dateFrom?: string;

  @ApiProperty({ required: false, example: "2026-06-30" })
  dateTo?: string;

  @ApiProperty({ required: false, example: true })
  isFree?: boolean;

  @ApiProperty({ required: false, example: "Gratis" })
  cost?: string;

  @ApiProperty({ required: false, example: 7.119349 })
  nearLat?: number;

  @ApiProperty({ required: false, example: -73.122742 })
  nearLng?: number;

  @ApiProperty({ required: false, example: 3 })
  radiusKm?: number;

  @ApiProperty({ required: false, example: "distance" })
  sort?: string;
}

export class PublicEventListResponseDto {
  @ApiProperty({ type: [PublicEventDto] })
  items!: PublicEventDto[];

  @ApiProperty({ type: PublicEventPaginationDto })
  pagination!: PublicEventPaginationDto;

  @ApiProperty({ type: AppliedFiltersDto })
  appliedFilters!: AppliedFiltersDto;
}
