import { Body, Controller, Get, Post, Version } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IdentityAccessService } from "./identity-access.service.js";
import { ActorResponseDto, LoginRequestDto, LoginResponseDto } from "./dto/identity-access.dto.js";

@ApiTags("Identity Access")
@Controller("auth")
export class AuthController {
  constructor(private readonly identityAccessService: IdentityAccessService) {}

  @Version("2")
  @Post("login")
  @ApiOperation({ summary: "Login placeholder for Release 2 scaffold" })
  @ApiCreatedResponse({ type: LoginResponseDto })
  login(@Body() body: LoginRequestDto): LoginResponseDto {
    return this.identityAccessService.login(body.email, body.role);
  }

  @Version("2")
  @Post("logout")
  @ApiOperation({ summary: "Logout placeholder for Release 2 scaffold" })
  @ApiOkResponse({ description: "Session closed" })
  logout() {
    return { ok: true };
  }

  @Version("2")
  @Get("me")
  @ApiOperation({ summary: "Current actor placeholder for Release 2 scaffold" })
  @ApiOkResponse({ type: ActorResponseDto })
  me(): ActorResponseDto {
    return this.identityAccessService.currentActor();
  }
}
