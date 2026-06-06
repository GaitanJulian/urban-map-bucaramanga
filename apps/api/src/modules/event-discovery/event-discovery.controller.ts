import { Controller, Get } from "@nestjs/common";
import { EventDiscoveryService } from "./event-discovery.service.js";

@Controller("events")
export class EventDiscoveryController {
  constructor(private readonly eventDiscoveryService: EventDiscoveryService) {}

  @Get()
  list() {
    return this.eventDiscoveryService.listVisibleEvents();
  }
}
