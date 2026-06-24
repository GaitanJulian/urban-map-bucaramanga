import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth, AuthUser } from "./better-auth.js";
import { IdentityAccessService } from "./identity-access.service.js";
import { ActorResponseDto, LoginRequestDto } from "./dto/identity-access.dto.js";

@ApiTags("Identity Access")
@Controller("auth")
export class AuthController {
  constructor(private readonly identityAccessService: IdentityAccessService) {}

  @Version("2")
  @Post("login")
  @ApiOperation({ summary: "Login real con email y contraseña via Better Auth" })
  @ApiOkResponse({ type: ActorResponseDto })
  @ApiUnauthorizedResponse({ description: "Credenciales invalidas" })
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ActorResponseDto> {
    let signInResponse: globalThis.Response;

    try {
      signInResponse = await auth.api.signInEmail({
        body: { email: body.email, password: body.password },
        asResponse: true
      });
    } catch {
      throw new UnauthorizedException("Credenciales invalidas. Verifica el email y la contrasena.");
    }

    const payload = (await signInResponse.json().catch(() => null)) as { user?: AuthUser } | null;

    if (!signInResponse.ok || !payload?.user) {
      throw new UnauthorizedException("Credenciales invalidas. Verifica el email y la contrasena.");
    }

    copySetCookieHeaders(signInResponse, res);
    return this.identityAccessService.toActorResponse(payload.user);
  }

  @Version("2")
  @Post("logout")
  @ApiOperation({ summary: "Logout real: invalida la sesion activa" })
  @ApiOkResponse({ description: "Sesion cerrada" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const signOutResponse = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true
    });

    copySetCookieHeaders(signOutResponse, res);
    return { ok: true };
  }

  @Version("2")
  @Get("me")
  @ApiOperation({ summary: "Actor autenticado actual via sesion real de Better Auth" })
  @ApiOkResponse({ type: ActorResponseDto })
  @ApiUnauthorizedResponse({ description: "No hay una sesion activa o expiro" })
  async me(@Req() req: Request): Promise<ActorResponseDto> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
      throw new UnauthorizedException("No hay una sesion activa o expiro. Inicia sesion de nuevo.");
    }

    return this.identityAccessService.toActorResponse(session.user as AuthUser);
  }
}

function copySetCookieHeaders(source: globalThis.Response, res: Response): void {
  const headers = source.headers as Headers & { getSetCookie?: () => string[] };
  const setCookies = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];

  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      res.append("Set-Cookie", cookie);
    }
    return;
  }

  const singleSetCookie = source.headers.get("set-cookie");
  if (singleSetCookie) {
    res.append("Set-Cookie", singleSetCookie);
  }
}
