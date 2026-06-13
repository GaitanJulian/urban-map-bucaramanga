import "reflect-metadata";
import { DataSource } from "typeorm";
import { EventCategoryEntity } from "../modules/event-discovery/entities/event-category.entity.js";
import { EventEntity } from "../modules/event-discovery/entities/event.entity.js";
import { EventDraftEntity } from "../modules/event-publication/entities/event-draft.entity.js";
import { PublicationCaseEntity } from "../modules/event-publication/entities/publication-case.entity.js";
import { EventLocationEntity } from "../modules/geolocation-place/entities/event-location.entity.js";
import { ModerationCaseEntity } from "../modules/moderation-trust/entities/moderation-case.entity.js";
import { ModerationDecisionEntity } from "../modules/moderation-trust/entities/moderation-decision.entity.js";
import { ZoneEntity } from "../modules/geolocation-place/entities/zone.entity.js";
import { Release11710000000000 } from "./migrations/1710000000000-release-1-initial.js";
import { Release21725000000000 } from "./migrations/1725000000000-release-2-publication.js";
import { Release21726000000000 } from "./migrations/1726000000000-release-2-submission-control.js";
import { Release21727000000000 } from "./migrations/1727000000000-release-2-moderation-queue.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "urban_map_bucaramanga",
  entities: [
    EventEntity,
    EventCategoryEntity,
    EventLocationEntity,
    ZoneEntity,
    EventDraftEntity,
    PublicationCaseEntity,
    ModerationCaseEntity,
    ModerationDecisionEntity
  ],
  migrations: [Release11710000000000, Release21725000000000, Release21726000000000, Release21727000000000],
  synchronize: false
});
