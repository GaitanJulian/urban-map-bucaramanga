import type { ActorRole } from "@umb/shared";

export interface Actor {
  id: string;
  displayName: string;
  email: string;
  activeRole: ActorRole;
}
