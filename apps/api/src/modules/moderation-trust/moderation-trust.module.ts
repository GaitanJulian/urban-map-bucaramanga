import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModerationTrustService } from "./moderation-trust.service.js";
import { ModerationCasesController } from "./moderation-cases.controller.js";
import { ModerationReportsController } from "./moderation-reports.controller.js";
import { ModerationCaseEntity } from "./entities/moderation-case.entity.js";
import { ModerationDecisionEntity } from "./entities/moderation-decision.entity.js";
import { PublicationCaseEntity } from "../event-publication/entities/publication-case.entity.js";
import { EventDraftEntity } from "../event-publication/entities/event-draft.entity.js";
import { ReportCaseEntity } from "./entities/report-case.entity.js";
import { ReportSignalEntity } from "./entities/report-signal.entity.js";
import { EscalationEntity } from "./entities/escalation.entity.js";
import { EventEntity } from "../event-discovery/entities/event.entity.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModerationCaseEntity,
      ModerationDecisionEntity,
      PublicationCaseEntity,
      EventDraftEntity,
      ReportCaseEntity,
      ReportSignalEntity,
      EscalationEntity,
      EventEntity
    ])
  ],
  controllers: [ModerationCasesController, ModerationReportsController],
  providers: [ModerationTrustService]
})
export class ModerationTrustModule {}
