import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListEventsQueryDto {
  @ApiPropertyOptional({ description: "Search keyword", example: "concierto" })
  q?: string;

  @ApiPropertyOptional({ description: "Category identifier", example: "music" })
  categoryId?: string;

  @ApiPropertyOptional({ description: "Zone identifier", example: "cabecera" })
  zoneId?: string;

  @ApiPropertyOptional({ description: "Start date filter", example: "2026-06-07" })
  dateFrom?: string;

  @ApiPropertyOptional({ description: "End date filter", example: "2026-06-30" })
  dateTo?: string;

  @ApiPropertyOptional({ description: "Free indicator", example: true })
  isFree?: boolean;

  @ApiPropertyOptional({ description: "Cost label", example: "Gratis" })
  cost?: string;

  @ApiPropertyOptional({ description: "Latitude for proximity search", example: 7.119349 })
  nearLat?: number;

  @ApiPropertyOptional({ description: "Longitude for proximity search", example: -73.122742 })
  nearLng?: number;

  @ApiPropertyOptional({ description: "Radius in kilometers", example: 3 })
  radiusKm?: number;

  @ApiPropertyOptional({ description: "Page number", example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: "Page size", example: 20 })
  pageSize?: number;

  @ApiPropertyOptional({ description: "Sort mode", example: "relevance" })
  sort?: string;
}
