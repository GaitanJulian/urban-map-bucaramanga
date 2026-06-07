import { Module } from "@nestjs/common";
import { EventDetailController } from "./event-detail.controller.js";
import { EventDiscoveryController } from "./event-discovery.controller.js";
import { EventDiscoveryService } from "./event-discovery.service.js";

@Module({
  controllers: [EventDiscoveryController, EventDetailController],
  providers: [EventDiscoveryService]
})
export class EventDiscoveryModule {}
