import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { ActorRole } from "@umb/shared";

export class LoginRequestDto {
  @ApiProperty({ example: "organizer@urbanmap.local" })
  email!: string;

  @ApiProperty({ example: "Organizer#2026" })
  password!: string;
}

export class ActorResponseDto {
  @ApiProperty({ example: "actor_scaffold" })
  id!: string;

  @ApiProperty({ example: "Scaffold Actor" })
  displayName!: string;

  @ApiProperty({ example: "organizer@urbanmap.local" })
  email!: string;

  @ApiProperty({ example: "organizer", enum: ["organizer", "moderator", "admin"] })
  activeRole!: ActorRole;
}


export class BootstrapOrganizerRequestDto {
  @ApiProperty({ example: "Fundacion Cultural Bucaramanga" })
  organizationName!: string;
}

export class OrganizerListItemDto {
  @ApiProperty({ example: "organizer_scaffold" })
  organizerId!: string;

  @ApiProperty({ example: "Organizador Curado" })
  organizationName!: string;

  @ApiProperty({ example: "curated" })
  verificationState!: string;
}

export class UpdateOrganizerRequestDto {
  @ApiPropertyOptional({ example: "active" })
  status?: string;
}
