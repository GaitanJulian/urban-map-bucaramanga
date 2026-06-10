import { Body, Controller, Get, Param, Patch, Post, Version } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IdentityAccessService } from "./identity-access.service.js";
import {
  BootstrapOrganizerRequestDto,
  OrganizerListItemDto,
  UpdateOrganizerRequestDto
} from "./dto/identity-access.dto.js";

@ApiTags("Identity Access")
@Controller("admin/organizers")
export class AdminOrganizersController {
  constructor(private readonly identityAccessService: IdentityAccessService) {}

  @Version("2")
  @Post("bootstrap")
  @ApiOperation({ summary: "Bootstrap curated organizers for the Release 2 scaffold" })
  @ApiCreatedResponse({ type: OrganizerListItemDto })
  bootstrap(@Body() body: BootstrapOrganizerRequestDto): OrganizerListItemDto {
    return this.identityAccessService.bootstrapOrganizer(body.organizationName);
  }

  @Version("2")
  @Get()
  @ApiOperation({ summary: "List curated organizers" })
  @ApiOkResponse({ type: OrganizerListItemDto, isArray: true })
  list(): OrganizerListItemDto[] {
    return this.identityAccessService.listOrganizers();
  }

  @Version("2")
  @Patch(":organizerId")
  @ApiOperation({ summary: "Update organizer scaffold state" })
  @ApiOkResponse({ type: OrganizerListItemDto })
  update(@Param("organizerId") organizerId: string, @Body() _body: UpdateOrganizerRequestDto): OrganizerListItemDto {
    return this.identityAccessService.updateOrganizer(organizerId);
  }
}
