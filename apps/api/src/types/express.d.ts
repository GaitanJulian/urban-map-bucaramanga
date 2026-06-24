import type { AuthUser } from "../modules/identity-access/better-auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      authSession?: {
        id: string;
        userId: string;
        expiresAt: Date;
        token: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
      };
    }
  }
}

export {};
