import { Module } from "@nestjs/common";
import { AdminOrganizersController } from "./admin-organizers.controller.js";
import { AuthController } from "./auth.controller.js";
import { IdentityAccessService } from "./identity-access.service.js";

@Module({
  controllers: [AuthController, AdminOrganizersController],
  providers: [IdentityAccessService]
})
export class IdentityAccessModule {}
