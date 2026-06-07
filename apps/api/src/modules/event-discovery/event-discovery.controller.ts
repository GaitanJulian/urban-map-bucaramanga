import { Controller, Get, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
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
  @ApiBadRequestResponse({
    description: "Invalid filter combination or malformed date/proximity parameters"
  })
  @Get()
  async list(@Query() query: ListEventsQueryDto): Promise<PublicEventListResponseDto> {
    return this.eventDiscoveryService.listVisibleEvents(query);
  }
}
