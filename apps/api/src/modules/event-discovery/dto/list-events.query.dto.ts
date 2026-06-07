import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListEventsQueryDto {
  @ApiPropertyOptional({ description: "Basic text search across title, summary, description, location, category and zone", example: "concierto" })
  q?: string;

  @ApiPropertyOptional({ description: "Category identifier", example: "cat_music" })
  categoryId?: string;

  @ApiPropertyOptional({ description: "Zone identifier", example: "zone_cabecera" })
  zoneId?: string;

  @ApiPropertyOptional({ description: "Start date filter in YYYY-MM-DD format", example: "2026-06-07" })
  dateFrom?: string;

  @ApiPropertyOptional({ description: "End date filter in YYYY-MM-DD format", example: "2026-06-30" })
  dateTo?: string;

  @ApiPropertyOptional({ description: "Free indicator", example: true, type: Boolean })
  isFree?: boolean;

  @ApiPropertyOptional({ description: "Cost label or cost intent such as free/paid", example: "Gratis" })
  cost?: string;

  @ApiPropertyOptional({ description: "Latitude for proximity search", example: 7.119349, type: Number })
  nearLat?: number;

  @ApiPropertyOptional({ description: "Longitude for proximity search", example: -73.122742, type: Number })
  nearLng?: number;

  @ApiPropertyOptional({ description: "Radius in kilometers", example: 3, type: Number })
  radiusKm?: number;

  @ApiPropertyOptional({ description: "Page number", example: 1, type: Number })
  page?: number;

  @ApiPropertyOptional({ description: "Page size", example: 20, type: Number })
  pageSize?: number;

  @ApiPropertyOptional({ description: "Sort mode", example: "relevance" })
  sort?: string;
}
