import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PublicEventDto } from "./dto/public-event.dto.js";

@ApiTags("Events")
@Controller("events")
export class EventDetailController {
  @ApiOperation({ summary: "Get event detail" })
  @ApiOkResponse({
    description: "Public event detail",
    type: PublicEventDto
  })
  @Get(":idOrSlug")
  getDetail(@Param("idOrSlug") _idOrSlug: string) {
    return {};
  }
}
