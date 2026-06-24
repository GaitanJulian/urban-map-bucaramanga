import { Pool } from "pg";
import { betterAuth } from "better-auth";
import type { ActorRole } from "@umb/shared";

export const authDbPool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "urban_map_bucaramanga"
});

const ACTOR_ROLES: ActorRole[] = ["organizer", "moderator", "admin"];

export const auth = betterAuth({
  database: authDbPool,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: ACTOR_ROLES,
        required: false,
        defaultValue: "organizer",
        input: false
      }
    }
  },
  trustedOrigins: [process.env.WEB_APP_URL ?? "http://localhost:5173"]
});

export type AuthUser = typeof auth.$Infer.Session.user;
