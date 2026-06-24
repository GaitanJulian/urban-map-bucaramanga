import { Injectable } from "@nestjs/common";
import type { ActorRole } from "@umb/shared";
import type { AuthUser } from "./better-auth.js";
import type { ActorResponseDto } from "./dto/identity-access.dto.js";

@Injectable()
export class IdentityAccessService {
  toActorResponse(user: AuthUser): ActorResponseDto {
    return {
      id: user.id,
      displayName: user.name,
      email: user.email,
      activeRole: user.role as ActorRole
    };
  }

  bootstrapOrganizer(organizationName: string) {
    return {
      organizerId: "organizer_scaffold",
      organizationName,
      verificationState: "curated"
    };
  }

  listOrganizers() {
    return [
      {
        organizerId: "organizer_scaffold",
        organizationName: "Organizador Curado",
        verificationState: "curated"
      }
    ];
  }

  updateOrganizer(organizerId: string) {
    return {
      organizerId,
      organizationName: "Organizador Curado",
      verificationState: "curated"
    };
  }
}
