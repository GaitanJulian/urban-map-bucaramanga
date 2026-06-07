import "reflect-metadata";
import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source.js";
import { EventCategoryEntity } from "../modules/event-discovery/entities/event-category.entity.js";
import { EventEntity } from "../modules/event-discovery/entities/event.entity.js";
import { EventLocationEntity } from "../modules/geolocation-place/entities/event-location.entity.js";
import { ZoneEntity } from "../modules/geolocation-place/entities/zone.entity.js";

const now = Date.now();

const categorySeed = [
  { id: "cat_music", name: "Musica", slug: "musica", sortOrder: 10 },
  { id: "cat_culture", name: "Cultura", slug: "cultura", sortOrder: 20 },
  { id: "cat_food", name: "Gastronomia", slug: "gastronomia", sortOrder: 30 }
];

const zoneSeed = [
  {
    id: "zone_cabecera",
    name: "Cabecera del Llano",
    slug: "cabecera-del-llano",
    boundaryType: "polygon" as const,
    boundaryGeometry:
      "SRID=4326;MULTIPOLYGON(((-73.131 7.113,-73.117 7.113,-73.117 7.127,-73.131 7.127,-73.131 7.113)))",
    sortOrder: 10
  },
  {
    id: "zone_centro",
    name: "Centro",
    slug: "centro",
    boundaryType: "polygon" as const,
    boundaryGeometry:
      "SRID=4326;MULTIPOLYGON(((-73.129 7.104,-73.116 7.104,-73.116 7.116,-73.129 7.116,-73.129 7.104)))",
    sortOrder: 20
  }
];

const locationSeed = [
  {
    id: "loc_001",
    label: "Teatro Santander",
    addressText: "Carrera 14 #33-30",
    zoneId: "zone_cabecera",
    latitude: 7.119349,
    longitude: -73.122742,
    precisionLevel: "neighborhood" as const,
    approximationNote: "Ubicacion aproximada a nivel de barrio.",
    cityName: "Bucaramanga"
  },
  {
    id: "loc_002",
    label: "Plaza de la Democracia",
    addressText: "Centro de Bucaramanga",
    zoneId: "zone_centro",
    latitude: 7.117644,
    longitude: -73.119913,
    precisionLevel: "zone" as const,
    approximationNote: "Ubicacion aproximada por zona.",
    cityName: "Bucaramanga"
  }
];

const eventSeed = [
  {
    id: "evt_001",
    title: "Concierto al aire libre",
    slug: "concierto-al-aire-libre",
    summary: "Un plan cultural para este fin de semana.",
    description: "Evento curado para el MVP de descubrimiento publico.",
    categoryId: "cat_music",
    locationId: "loc_001",
    zoneId: "zone_cabecera",
    status: "upcoming" as const,
    visibilityState: "visible" as const,
    startsAt: new Date(now + 1000 * 60 * 60 * 24 * 7),
    endsAt: new Date(now + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 3),
    costLabel: "Gratis",
    isFree: true,
    isApproximateLocation: true,
    isCurated: true
  },
  {
    id: "evt_002",
    title: "Muestra gastronomica local",
    slug: "muestra-gastronomica-local",
    summary: "Planes de comida y encuentro en el centro.",
    description: "Segundo evento curado de ejemplo para el Release 1.",
    categoryId: "cat_food",
    locationId: "loc_002",
    zoneId: "zone_centro",
    status: "live" as const,
    visibilityState: "visible" as const,
    startsAt: new Date(now - 1000 * 60 * 60),
    endsAt: new Date(now + 1000 * 60 * 60 * 2),
    costLabel: "Desde $20.000",
    isFree: false,
    isApproximateLocation: true,
    isCurated: true
  }
];

async function seedDatabase(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(EventCategoryEntity);
  const zoneRepository = dataSource.getRepository(ZoneEntity);
  const locationRepository = dataSource.getRepository(EventLocationEntity);
  const eventRepository = dataSource.getRepository(EventEntity);

  await dataSource.query(`TRUNCATE TABLE events, event_locations, zones, event_categories RESTART IDENTITY CASCADE`);

  await categoryRepository.save(categorySeed);

  for (const zone of zoneSeed) {
    await zoneRepository
      .createQueryBuilder()
      .insert()
      .values({
        ...zone,
        boundaryGeometry: () => `ST_GeomFromText('${zone.boundaryGeometry.replace("SRID=4326;", "")}', 4326)`
      })
      .execute();
  }

  for (const location of locationSeed) {
    await locationRepository
      .createQueryBuilder()
      .insert()
      .values({
        ...location,
        pointGeometry: () => `ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)`
      })
      .execute();
  }

  await eventRepository.save(eventSeed);
}

async function main() {
  await AppDataSource.initialize();
  await seedDatabase(AppDataSource);
  await AppDataSource.destroy();
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
