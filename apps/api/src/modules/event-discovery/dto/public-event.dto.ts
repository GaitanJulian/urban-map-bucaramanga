import { ApiProperty } from "@nestjs/swagger";

export class EventCategoryDto {
  @ApiProperty({ example: "music" })
  id!: string;

  @ApiProperty({ example: "Música" })
  name!: string;
}

export class EventZoneDto {
  @ApiProperty({ example: "cabecera" })
  id!: string;

  @ApiProperty({ example: "Cabecera del Llano" })
  name!: string;
}

export class EventLocationDto {
  @ApiProperty({ example: "Teatro Santander" })
  label!: string;

  @ApiProperty({ example: "Carrera 14 #33-30" })
  addressText!: string;

  @ApiProperty({ example: 7.119349 })
  latitude!: number;

  @ApiProperty({ example: -73.122742 })
  longitude!: number;

  @ApiProperty({ example: "neighborhood" })
  precisionLevel!: string;

  @ApiProperty({ example: true })
  isApproximateLocation!: boolean;
}

export class PublicEventDto {
  @ApiProperty({ example: "evt_001" })
  id!: string;

  @ApiProperty({ example: "Concierto al aire libre" })
  title!: string;

  @ApiProperty({ example: "concierto-al-aire-libre" })
  slug!: string;

  @ApiProperty({ example: "Un plan cultural para este fin de semana." })
  summary!: string;

  @ApiProperty({ type: EventCategoryDto })
  category!: EventCategoryDto;

  @ApiProperty({ type: EventLocationDto })
  location!: EventLocationDto;

  @ApiProperty({ type: EventZoneDto })
  zone!: EventZoneDto;

  @ApiProperty({ example: "upcoming" })
  status!: string;

  @ApiProperty({ example: "visible" })
  visibilityState!: string;

  @ApiProperty({ example: "2026-06-20T19:00:00.000Z" })
  startsAt!: string;

  @ApiProperty({ example: "2026-06-20T22:00:00.000Z" })
  endsAt!: string;

  @ApiProperty({ example: "Gratis" })
  costLabel!: string;

  @ApiProperty({ example: true })
  isFree!: boolean;
}
