import "reflect-metadata";
import { DataSource } from "typeorm";
import { EventCategoryEntity } from "../modules/event-discovery/entities/event-category.entity.js";
import { EventEntity } from "../modules/event-discovery/entities/event.entity.js";
import { EventDraftEntity } from "../modules/event-publication/entities/event-draft.entity.js";
import { PublicationCaseEntity } from "../modules/event-publication/entities/publication-case.entity.js";
import { EventLocationEntity } from "../modules/geolocation-place/entities/event-location.entity.js";
import { ModerationCaseEntity } from "../modules/moderation-trust/entities/moderation-case.entity.js";
import { ModerationDecisionEntity } from "../modules/moderation-trust/entities/moderation-decision.entity.js";
import { ReportCaseEntity } from "../modules/moderation-trust/entities/report-case.entity.js";
import { ReportSignalEntity } from "../modules/moderation-trust/entities/report-signal.entity.js";
import { EscalationEntity } from "../modules/moderation-trust/entities/escalation.entity.js";
import { ZoneEntity } from "../modules/geolocation-place/entities/zone.entity.js";
import { Release11710000000000 } from "./migrations/1710000000000-release-1-initial.js";
import { Release21725000000000 } from "./migrations/1725000000000-release-2-publication.js";
import { Release21726000000000 } from "./migrations/1726000000000-release-2-submission-control.js";
import { Release21727000000000 } from "./migrations/1727000000000-release-2-moderation-queue.js";
import { Release21728000000000 } from "./migrations/1728000000000-release-2-trust-resolution.js";
import { Release21729000000000 } from "./migrations/1729000000000-release-2-discovery-provenance.js";
import { Release21730000000000 } from "./migrations/1730000000000-release-2-draft-event-details.js";
import { Release21731000000000 } from "./migrations/1731000000000-release-2-identity-access.js";

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
    ModerationDecisionEntity,
    ReportCaseEntity,
    ReportSignalEntity,
    EscalationEntity
  ],
  migrations: [
    Release11710000000000,
    Release21725000000000,
    Release21726000000000,
    Release21727000000000,
    Release21728000000000,
    Release21729000000000,
    Release21730000000000,
    Release21731000000000
  ],
  synchronize: false
});
