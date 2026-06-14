import { Injectable } from "@nestjs/common";
import type { ActorRole } from "@umb/shared";

@Injectable()
export class IdentityAccessService {
  login(email: string, role: ActorRole = "organizer") {
    return {
      accessToken: `scaffold-token-for-${email}`,
      actor: {
        id: "actor_scaffold",
        displayName: "Scaffold Actor",
        email,
        activeRole: role
      }
    };
  }

  currentActor() {
    return {
      id: "actor_scaffold",
      displayName: "Scaffold Actor",
      email: "scaffold@urbanmap.local",
      activeRole: "organizer" as const
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
