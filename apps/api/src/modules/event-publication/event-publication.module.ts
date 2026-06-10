import { Module } from "@nestjs/common";
import { EventPublicationService } from "./event-publication.service.js";
import { OrganizerDraftsController } from "./organizer-drafts.controller.js";

@Module({
  controllers: [OrganizerDraftsController],
  providers: [EventPublicationService]
})
export class EventPublicationModule {}
