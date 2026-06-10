import { Module } from "@nestjs/common";
import { ModerationTrustService } from "./moderation-trust.service.js";
import { ModerationCasesController } from "./moderation-cases.controller.js";
import { ModerationReportsController } from "./moderation-reports.controller.js";

@Module({
  controllers: [ModerationCasesController, ModerationReportsController],
  providers: [ModerationTrustService]
})
export class ModerationTrustModule {}
