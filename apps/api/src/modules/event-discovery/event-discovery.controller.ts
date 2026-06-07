import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { EventDiscoveryService } from "./event-discovery.service.js";
import { ListEventsQueryDto } from "./dto/list-events.query.dto.js";
import { PublicEventListResponseDto } from "./dto/public-event-list-response.dto.js";

@ApiTags("Events")
@Controller("events")
export class EventDiscoveryController {
  constructor(private readonly eventDiscoveryService: EventDiscoveryService) {}

  @ApiOperation({ summary: "List visible events" })
  @ApiOkResponse({
    description: "Visible events for discovery",
    type: PublicEventListResponseDto
  })
  @Get()
  async list(@Query() query: ListEventsQueryDto) {
    return this.eventDiscoveryService.listVisibleEvents(query);
  }
}
