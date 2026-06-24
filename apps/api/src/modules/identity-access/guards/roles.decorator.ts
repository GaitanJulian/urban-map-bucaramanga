import { SetMetadata } from "@nestjs/common";
import type { ActorRole } from "@umb/shared";

export const ROLES_KEY = "umb_actor_roles";

export const Roles = (...roles: ActorRole[]) => SetMetadata(ROLES_KEY, roles);
