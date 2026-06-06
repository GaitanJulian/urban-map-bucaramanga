import { Module } from "@nestjs/common";
import { EventDiscoveryController } from "./event-discovery.controller.js";
import { EventDiscoveryService } from "./event-discovery.service.js";

@Module({
  controllers: [EventDiscoveryController],
  providers: [EventDiscoveryService]
})
export class EventDiscoveryModule {}
