import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventPublicationService } from "./event-publication.service.js";
import { OrganizerDraftsController } from "./organizer-drafts.controller.js";
import { EventDraftEntity } from "./entities/event-draft.entity.js";
import { PublicationCaseEntity } from "./entities/publication-case.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([EventDraftEntity, PublicationCaseEntity])],
  controllers: [OrganizerDraftsController],
  providers: [EventPublicationService]
})
export class EventPublicationModule {}
