import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthResponseDto } from "./health-response.dto.js";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({
    description: "Service health status",
    type: HealthResponseDto
  })
  @Get()
  check() {
    return {
      status: "ok",
      service: "api"
    };
  }
}
