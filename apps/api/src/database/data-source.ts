import "reflect-metadata";
import { DataSource } from "typeorm";
import { EventCategoryEntity } from "../modules/event-discovery/entities/event-category.entity.js";
import { EventEntity } from "../modules/event-discovery/entities/event.entity.js";
import { EventLocationEntity } from "../modules/geolocation-place/entities/event-location.entity.js";
import { ZoneEntity } from "../modules/geolocation-place/entities/zone.entity.js";
import { Release11710000000000 } from "./migrations/1710000000000-release-1-initial.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "urban_map_bucaramanga",
  entities: [EventEntity, EventCategoryEntity, EventLocationEntity, ZoneEntity],
  migrations: [Release11710000000000],
  synchronize: false
});
