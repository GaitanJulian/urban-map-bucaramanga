import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModerationTrustService } from "./moderation-trust.service.js";
import { ModerationCasesController } from "./moderation-cases.controller.js";
import { ModerationReportsController } from "./moderation-reports.controller.js";
import { ModerationCaseEntity } from "./entities/moderation-case.entity.js";
import { ModerationDecisionEntity } from "./entities/moderation-decision.entity.js";
import { PublicationCaseEntity } from "../event-publication/entities/publication-case.entity.js";
import { EventDraftEntity } from "../event-publication/entities/event-draft.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([ModerationCaseEntity, ModerationDecisionEntity, PublicationCaseEntity, EventDraftEntity])],
  controllers: [ModerationCasesController, ModerationReportsController],
  providers: [ModerationTrustService]
})
export class ModerationTrustModule {}
