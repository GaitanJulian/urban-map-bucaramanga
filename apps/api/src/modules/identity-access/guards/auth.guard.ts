import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { auth } from "../better-auth.js";
import { fromNodeHeaders } from "better-auth/node";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers)
    });

    if (!session) {
      throw new UnauthorizedException("No hay una sesión activa o expiró. Inicia sesión de nuevo.");
    }

    request.authSession = session.session;
    request.user = session.user;

    return true;
  }
}
