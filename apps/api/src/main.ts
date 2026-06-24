import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { RequestMethod, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { toNodeHandler } from "better-auth/node";
import { AppModule } from "./app.module.js";
import { auth } from "./modules/identity-access/better-auth.js";

async function bootstrap() {
  const webAppUrl = process.env.WEB_APP_URL ?? "http://localhost:5173";

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: webAppUrl,
      credentials: true
    },
    bodyParser: false
  });

  // Better Auth needs the raw, unparsed request body for its own routes, so it is
  // mounted directly on the underlying Express instance before Nest's json() parser.
  // Public self-registration is intentionally not offered: only the seeded demo
  // accounts (organizer/moderator/admin) exist, so sign-up is blocked here.
  const authHandler = toNodeHandler(auth);
  app.getHttpAdapter().getInstance().all("/api/auth/*", (req, res, next) => {
    if (req.path.startsWith("/api/auth/sign-up")) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    void authHandler(req, res).catch(next);
  });
  app.use(express.json());

  app.setGlobalPrefix("api", {
    exclude: [{ path: "health", method: RequestMethod.GET }]
  });
  app.enableVersioning({
    type: VersioningType.URI
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Mapa de Eventos Bucaramanga API")
    .setVersion("Release 1")
    .setDescription("API pública de descubrimiento de eventos para el MVP Release 1.")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, swaggerDocument);

  const port = Number(process.env.API_PORT ?? 3001);
  const host = process.env.API_HOST ?? "0.0.0.0";

  await app.listen(port, host);
}

void bootstrap();
