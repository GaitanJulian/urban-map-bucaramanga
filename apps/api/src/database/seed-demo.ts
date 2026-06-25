import "reflect-metadata";
import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source.js";
import { EventCategoryEntity } from "../modules/event-discovery/entities/event-category.entity.js";
import { EventEntity } from "../modules/event-discovery/entities/event.entity.js";

/**
 * Seed demo adicional e idempotente para presentar Urban Map Bucaramanga como
 * un producto poblado. Solo agrega catalogo y eventos nuevos (ids propios con
 * prefijo `demo`); nunca trunca ni toca las filas creadas por
 * `db:seed:release1` o `db:seed:identity`.
 *
 * Reejecutar este script actualiza (no duplica) sus propias filas via upsert
 * por id, y recalcula las fechas de los eventos relativas al momento de
 * ejecucion para que la demo siempre se vea vigente.
 */

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

interface DemoCategorySeed {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

const demoCategorySeed: DemoCategorySeed[] = [
  { id: "cat_theatre", name: "Teatro", slug: "teatro", sortOrder: 40 },
  { id: "cat_tech", name: "Tecnologia", slug: "tecnologia", sortOrder: 50 },
  { id: "cat_entrepreneurship", name: "Emprendimiento", slug: "emprendimiento", sortOrder: 60 },
  { id: "cat_sports", name: "Deporte", slug: "deporte", sortOrder: 70 },
  { id: "cat_wellness", name: "Bienestar", slug: "bienestar", sortOrder: 80 },
  { id: "cat_family", name: "Familiar", slug: "familiar", sortOrder: 90 },
  { id: "cat_education", name: "Educacion", slug: "educacion", sortOrder: 100 },
  { id: "cat_art", name: "Arte", slug: "arte", sortOrder: 110 },
  { id: "cat_markets", name: "Mercados", slug: "mercados", sortOrder: 120 },
  { id: "cat_community", name: "Comunidad", slug: "comunidad", sortOrder: 130 },
  { id: "cat_nightlife", name: "Vida nocturna", slug: "vida-nocturna", sortOrder: 140 }
];

interface DemoZoneSeed {
  id: string;
  name: string;
  slug: string;
  centerLat: number;
  centerLng: number;
  halfSizeDeg: number;
  sortOrder: number;
}

const demoZoneSeed: DemoZoneSeed[] = [
  { id: "zone_canaveral", name: "Canaveral", slug: "canaveral", centerLat: 7.061, centerLng: -73.0855, halfSizeDeg: 0.008, sortOrder: 30 },
  { id: "zone_provenza", name: "Provenza", slug: "provenza", centerLat: 7.1145, centerLng: -73.1185, halfSizeDeg: 0.008, sortOrder: 40 },
  { id: "zone_sanfrancisco", name: "San Francisco", slug: "san-francisco", centerLat: 7.1258, centerLng: -73.1133, halfSizeDeg: 0.008, sortOrder: 50 },
  { id: "zone_sotomayor", name: "Sotomayor", slug: "sotomayor", centerLat: 7.1227, centerLng: -73.1098, halfSizeDeg: 0.008, sortOrder: 60 },
  { id: "zone_lagoscacique", name: "Lagos del Cacique", slug: "lagos-del-cacique", centerLat: 7.1124, centerLng: -73.1079, halfSizeDeg: 0.008, sortOrder: 70 },
  { id: "zone_realdeminas", name: "Real de Minas", slug: "real-de-minas", centerLat: 7.1335, centerLng: -73.1212, halfSizeDeg: 0.008, sortOrder: 80 },
  { id: "zone_ciudadelarealdeminas", name: "Ciudadela Real de Minas", slug: "ciudadela-real-de-minas", centerLat: 7.1372, centerLng: -73.1232, halfSizeDeg: 0.008, sortOrder: 90 },
  { id: "zone_laaurora", name: "La Aurora", slug: "la-aurora", centerLat: 7.1331, centerLng: -73.1298, halfSizeDeg: 0.008, sortOrder: 100 },
  { id: "zone_garciarovira", name: "Garcia Rovira", slug: "garcia-rovira", centerLat: 7.1186, centerLng: -73.1227, halfSizeDeg: 0.008, sortOrder: 110 },
  { id: "zone_mejoraspublicas", name: "Mejoras Publicas", slug: "mejoras-publicas", centerLat: 7.1219, centerLng: -73.1267, halfSizeDeg: 0.008, sortOrder: 120 },
  { id: "zone_elprado", name: "El Prado", slug: "el-prado", centerLat: 7.1257, centerLng: -73.1187, halfSizeDeg: 0.008, sortOrder: 130 },
  { id: "zone_areametropolitana", name: "Area Metropolitana", slug: "area-metropolitana", centerLat: 7.0631, centerLng: -73.0859, halfSizeDeg: 0.05, sortOrder: 140 }
];

interface DemoEventSeed {
  id: string;
  title: string;
  summary: string;
  description: string;
  categoryId: string;
  zoneId: string;
  venueName: string;
  address: string;
  dayOffset: number;
  startHourOffset: number;
  durationHours: number;
  isFree: boolean;
  costLabel: string;
}

const demoEventSeed: DemoEventSeed[] = [
  {
    id: "evt_demo_001",
    title: "Yoga al amanecer",
    summary: "Sesion de yoga al aire libre para empezar el dia con calma.",
    description:
      "Practica guiada de yoga apta para todos los niveles, con vista al sector de Canaveral. Trae tu propio tapete.",
    categoryId: "cat_wellness",
    zoneId: "zone_canaveral",
    venueName: "Parque Las Palmas",
    address: "Sector Canaveral, area metropolitana",
    dayOffset: 0,
    startHourOffset: -2,
    durationHours: 3,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_002",
    title: "Recorrido en bicicleta nocturno",
    summary: "Rodada urbana nocturna por la ciclorruta de Canaveral.",
    description: "Recorrido grupal en bicicleta con punto de encuentro y acompanamiento durante todo el trayecto.",
    categoryId: "cat_sports",
    zoneId: "zone_canaveral",
    venueName: "Ciclorruta Canaveral",
    address: "Canaveral, area metropolitana",
    dayOffset: 0,
    startHourOffset: 6,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_003",
    title: "Noche de trivia y juegos de mesa",
    summary: "Trivia tematica y juegos de mesa para cerrar el dia entre amigos.",
    description: "Encuentro casual con rondas de trivia, juegos de mesa y premios sorpresa para los ganadores.",
    categoryId: "cat_community",
    zoneId: "zone_sanfrancisco",
    venueName: "Casa Cultural San Francisco",
    address: "Barrio San Francisco",
    dayOffset: 0,
    startHourOffset: 9,
    durationHours: 2,
    isFree: false,
    costLabel: "Cubierto $10.000"
  },
  {
    id: "evt_demo_004",
    title: "Cine al parque",
    summary: "Funcion de cine al aire libre para toda la familia.",
    description: "Proyeccion gratuita en pantalla grande con zona de cobijas y snacks disponibles para comprar.",
    categoryId: "cat_family",
    zoneId: "zone_garciarovira",
    venueName: "Parque Garcia Rovira",
    address: "Parque Garcia Rovira, centro",
    dayOffset: 1,
    startHourOffset: 10,
    durationHours: 3,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_005",
    title: "Caminata familiar por senderos urbanos",
    summary: "Caminata guiada apta para ninos y adultos por senderos de Cabecera.",
    description: "Recorrido de baja dificultad con paradas educativas sobre flora local y puntos de hidratacion.",
    categoryId: "cat_family",
    zoneId: "zone_cabecera",
    venueName: "Sendero Cabecera del Llano",
    address: "Cabecera del Llano",
    dayOffset: 2,
    startHourOffset: 9,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_006",
    title: "Mercado creativo local",
    summary: "Mercado de emprendedores con diseno, moda y arte hecho en la ciudad.",
    description: "Mas de treinta expositores locales de diseno, moda, decoracion y arte en un solo espacio al aire libre.",
    categoryId: "cat_markets",
    zoneId: "zone_provenza",
    venueName: "Plazoleta Provenza",
    address: "Provenza",
    dayOffset: 2,
    startHourOffset: 10,
    durationHours: 6,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_007",
    title: "Caminata urbana al atardecer",
    summary: "Caminata ligera por El Prado para ver el atardecer en grupo.",
    description: "Plan tranquilo de caminata urbana con punto final en mirador para disfrutar del atardecer.",
    categoryId: "cat_wellness",
    zoneId: "zone_elprado",
    venueName: "Parque El Prado",
    address: "El Prado",
    dayOffset: 3,
    startHourOffset: 16,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_008",
    title: "Ruta cultural por el centro",
    summary: "Recorrido guiado por los hitos historicos del centro de la ciudad.",
    description: "Caminata guiada por arquitectura, plazas y museos del centro historico con guia local.",
    categoryId: "cat_culture",
    zoneId: "zone_centro",
    venueName: "Centro Historico",
    address: "Centro de Bucaramanga",
    dayOffset: 4,
    startHourOffset: 9,
    durationHours: 3,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_009",
    title: "Taller de fotografia movil",
    summary: "Aprende a tomar mejores fotos con tu celular en un taller practico.",
    description: "Taller practico de composicion, luz y edicion movil pensado para principiantes.",
    categoryId: "cat_education",
    zoneId: "zone_lagoscacique",
    venueName: "Centro Comercial Lagos del Cacique",
    address: "Lagos del Cacique",
    dayOffset: 5,
    startHourOffset: 14,
    durationHours: 3,
    isFree: false,
    costLabel: "$35.000"
  },
  {
    id: "evt_demo_010",
    title: "Feria de emprendimientos locales",
    summary: "Feria con productos y servicios de emprendedores de la ciudad.",
    description: "Espacio de exhibicion y venta para emprendimientos locales de varios sectores, con musica en vivo.",
    categoryId: "cat_entrepreneurship",
    zoneId: "zone_ciudadelarealdeminas",
    venueName: "Plaza Ciudadela Real de Minas",
    address: "Ciudadela Real de Minas",
    dayOffset: 6,
    startHourOffset: 9,
    durationHours: 5,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_011",
    title: "Noche de jazz en la ciudad",
    summary: "Concierto intimo de jazz con artistas locales.",
    description: "Velada de jazz con un trio local en un formato intimo, ideal para una salida nocturna tranquila.",
    categoryId: "cat_music",
    zoneId: "zone_centro",
    venueName: "Teatro Santander",
    address: "Centro de Bucaramanga",
    dayOffset: 7,
    startHourOffset: 19,
    durationHours: 3,
    isFree: false,
    costLabel: "$35.000"
  },
  {
    id: "evt_demo_012",
    title: "Concierto de musica andina",
    summary: "Concierto de musica andina colombiana con agrupacion local.",
    description: "Repertorio de musica andina con instrumentos tradicionales interpretado por una agrupacion local.",
    categoryId: "cat_music",
    zoneId: "zone_elprado",
    venueName: "Auditorio El Prado",
    address: "El Prado",
    dayOffset: 8,
    startHourOffset: 19,
    durationHours: 3,
    isFree: false,
    costLabel: "$30.000"
  },
  {
    id: "evt_demo_013",
    title: "Obra de teatro independiente",
    summary: "Montaje de teatro independiente producido por un colectivo local.",
    description: "Puesta en escena de un colectivo de teatro independiente de la ciudad, con cupo limitado.",
    categoryId: "cat_theatre",
    zoneId: "zone_sanfrancisco",
    venueName: "Sala Cultural San Francisco",
    address: "San Francisco",
    dayOffset: 9,
    startHourOffset: 19,
    durationHours: 2,
    isFree: false,
    costLabel: "$25.000"
  },
  {
    id: "evt_demo_014",
    title: "Encuentro de tecnologia y startups",
    summary: "Encuentro de la comunidad tech local con charlas y networking.",
    description: "Charlas cortas de fundadores locales seguidas de un espacio de networking para la comunidad tech.",
    categoryId: "cat_tech",
    zoneId: "zone_realdeminas",
    venueName: "Centro Empresarial Real de Minas",
    address: "Real de Minas",
    dayOffset: 10,
    startHourOffset: 8,
    durationHours: 6,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_015",
    title: "Velada de poesia y arte urbano",
    summary: "Lectura de poesia y muestra de arte urbano de creadores locales.",
    description: "Espacio abierto de lectura de poesia acompanado de una muestra de arte urbano en vivo.",
    categoryId: "cat_art",
    zoneId: "zone_mejoraspublicas",
    venueName: "Casa de la Cultura Mejoras Publicas",
    address: "Mejoras Publicas",
    dayOffset: 12,
    startHourOffset: 18,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_016",
    title: "Torneo barrial de microfutbol",
    summary: "Torneo amistoso de microfutbol entre equipos del barrio.",
    description: "Torneo relampago de microfutbol con premiacion para el equipo ganador y plan familiar alrededor.",
    categoryId: "cat_sports",
    zoneId: "zone_sotomayor",
    venueName: "Polideportivo Sotomayor",
    address: "Sotomayor",
    dayOffset: 13,
    startHourOffset: 14,
    durationHours: 4,
    isFree: false,
    costLabel: "Inscripcion $15.000"
  },
  {
    id: "evt_demo_017",
    title: "Festival gastronomico de sabores santandereanos",
    summary: "Festival de comida tipica santandereana con varios puestos locales.",
    description: "Muestra gastronomica con platos tipicos santandereanos preparados por cocineros y restaurantes locales.",
    categoryId: "cat_food",
    zoneId: "zone_centro",
    venueName: "Parque de los Ninos",
    address: "Centro de Bucaramanga",
    dayOffset: 14,
    startHourOffset: 10,
    durationHours: 8,
    isFree: false,
    costLabel: "Entrada $15.000"
  },
  {
    id: "evt_demo_018",
    title: "Feria de adopcion y bienestar animal",
    summary: "Feria de adopcion responsable con jornada de bienestar animal.",
    description: "Jornada de adopcion responsable con fundaciones locales y charlas sobre cuidado y bienestar animal.",
    categoryId: "cat_community",
    zoneId: "zone_laaurora",
    venueName: "Parque La Aurora",
    address: "La Aurora",
    dayOffset: 15,
    startHourOffset: 9,
    durationHours: 4,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_019",
    title: "Noche de stand-up comedy",
    summary: "Noche de comedia en vivo con varios comediantes locales.",
    description: "Lineup de comediantes locales en un formato de noche de comedia con cupo limitado.",
    categoryId: "cat_nightlife",
    zoneId: "zone_centro",
    venueName: "Teatro Santander",
    address: "Centro de Bucaramanga",
    dayOffset: 16,
    startHourOffset: 20,
    durationHours: 2,
    isFree: false,
    costLabel: "$40.000"
  },
  {
    id: "evt_demo_020",
    title: "Taller de emprendimiento digital",
    summary: "Taller practico para lanzar un negocio digital desde cero.",
    description: "Taller de medio dia sobre validacion de idea, marca y primeros pasos para vender en linea.",
    categoryId: "cat_entrepreneurship",
    zoneId: "zone_realdeminas",
    venueName: "Centro Empresarial Real de Minas",
    address: "Real de Minas",
    dayOffset: 18,
    startHourOffset: 15,
    durationHours: 3,
    isFree: false,
    costLabel: "$45.000"
  },
  {
    id: "evt_demo_021",
    title: "Feria del libro y la lectura",
    summary: "Feria del libro con autores y editoriales locales.",
    description: "Feria de varios dias con venta de libros, presentaciones de autores locales y actividades infantiles.",
    categoryId: "cat_education",
    zoneId: "zone_centro",
    venueName: "Plaza Civica",
    address: "Centro de Bucaramanga",
    dayOffset: 19,
    startHourOffset: 9,
    durationHours: 6,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_022",
    title: "Conversatorio sobre cultura ciudadana",
    summary: "Charla abierta sobre cultura ciudadana y convivencia urbana.",
    description: "Conversatorio comunitario con panelistas locales sobre convivencia y cultura ciudadana.",
    categoryId: "cat_community",
    zoneId: "zone_garciarovira",
    venueName: "Biblioteca Publica Gabriel Turbay",
    address: "Parque Garcia Rovira",
    dayOffset: 20,
    startHourOffset: 17,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_023",
    title: "Festival de cortometrajes locales",
    summary: "Muestra de cortometrajes producidos por cineastas de la ciudad.",
    description: "Seleccion de cortometrajes locales con conversatorio posterior junto a los directores.",
    categoryId: "cat_culture",
    zoneId: "zone_provenza",
    venueName: "Cine Club Provenza",
    address: "Provenza",
    dayOffset: 21,
    startHourOffset: 18,
    durationHours: 4,
    isFree: false,
    costLabel: "$20.000"
  },
  {
    id: "evt_demo_024",
    title: "Mercado nocturno de comidas del mundo",
    summary: "Mercado nocturno con puestos de comida de distintas cocinas.",
    description: "Mercado de comida nocturno con puestos variados, musica en vivo y zona de mesas compartidas.",
    categoryId: "cat_nightlife",
    zoneId: "zone_lagoscacique",
    venueName: "Explanada Lagos del Cacique",
    address: "Lagos del Cacique",
    dayOffset: 22,
    startHourOffset: 18,
    durationHours: 5,
    isFree: false,
    costLabel: "Entrada $10.000"
  },
  {
    id: "evt_demo_025",
    title: "Charla de innovacion y tecnologia civica",
    summary: "Charla sobre proyectos de tecnologia aplicados a problemas urbanos.",
    description: "Charla abierta sobre iniciativas de tecnologia civica y datos abiertos en la region.",
    categoryId: "cat_tech",
    zoneId: "zone_ciudadelarealdeminas",
    venueName: "Centro de Innovacion Real de Minas",
    address: "Ciudadela Real de Minas",
    dayOffset: 23,
    startHourOffset: 16,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_026",
    title: "Exposicion de arte contemporaneo local",
    summary: "Exposicion colectiva de artistas visuales locales.",
    description: "Muestra colectiva de pintura, fotografia e instalacion de artistas emergentes de la ciudad.",
    categoryId: "cat_art",
    zoneId: "zone_elprado",
    venueName: "Galeria El Prado",
    address: "El Prado",
    dayOffset: 24,
    startHourOffset: 10,
    durationHours: 6,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_027",
    title: "Clase abierta de baile popular",
    summary: "Clase gratuita de baile popular para todos los niveles.",
    description: "Clase abierta y gratuita de ritmos populares colombianos, sin necesidad de pareja ni experiencia previa.",
    categoryId: "cat_culture",
    zoneId: "zone_mejoraspublicas",
    venueName: "Casa de la Cultura Mejoras Publicas",
    address: "Mejoras Publicas",
    dayOffset: 25,
    startHourOffset: 17,
    durationHours: 2,
    isFree: true,
    costLabel: "Gratis"
  },
  {
    id: "evt_demo_028",
    title: "Encuentro de emprendedoras santandereanas",
    summary: "Encuentro de networking para mujeres emprendedoras de la region.",
    description: "Espacio de networking y mentoria entre emprendedoras santandereanas de distintos sectores.",
    categoryId: "cat_entrepreneurship",
    zoneId: "zone_sotomayor",
    venueName: "Centro de Convenciones Sotomayor",
    address: "Sotomayor",
    dayOffset: 26,
    startHourOffset: 9,
    durationHours: 4,
    isFree: false,
    costLabel: "$30.000"
  },
  {
    id: "evt_demo_029",
    title: "Maraton urbana 10K",
    summary: "Carrera urbana de 10 kilometros abierta al publico.",
    description: "Carrera atletica de 10K por vias del area metropolitana con hidratacion y cronometraje oficial.",
    categoryId: "cat_sports",
    zoneId: "zone_areametropolitana",
    venueName: "Parque Las Palmas",
    address: "Area Metropolitana de Bucaramanga",
    dayOffset: 27,
    startHourOffset: 6,
    durationHours: 4,
    isFree: false,
    costLabel: "Inscripcion $50.000"
  },
  {
    id: "evt_demo_030",
    title: "Taller de bienestar y mindfulness",
    summary: "Taller practico de respiracion y mindfulness para reducir el estres.",
    description: "Taller vivencial de tecnicas de respiracion y mindfulness orientado a la vida diaria.",
    categoryId: "cat_wellness",
    zoneId: "zone_laaurora",
    venueName: "Centro Holistico La Aurora",
    address: "La Aurora",
    dayOffset: 28,
    startHourOffset: 16,
    durationHours: 2,
    isFree: false,
    costLabel: "$25.000"
  }
];

function jitter(index: number, scaleDeg: number): { dLat: number; dLng: number } {
  const dLat = ((index % 3) - 1) * scaleDeg;
  const dLng = (((index * 7) % 5) - 2) * scaleDeg;
  return { dLat, dLng };
}

function squarePolygonWkt(centerLat: number, centerLng: number, halfSizeDeg: number): string {
  const minLat = centerLat - halfSizeDeg;
  const maxLat = centerLat + halfSizeDeg;
  const minLng = centerLng - halfSizeDeg;
  const maxLng = centerLng + halfSizeDeg;

  return `MULTIPOLYGON(((${minLng} ${minLat},${maxLng} ${minLat},${maxLng} ${maxLat},${minLng} ${maxLat},${minLng} ${minLat})))`;
}

async function upsertDemoCategories(dataSource: DataSource): Promise<void> {
  const categoryRepository = dataSource.getRepository(EventCategoryEntity);

  await categoryRepository.upsert(
    demoCategorySeed.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: true,
      sortOrder: category.sortOrder
    })),
    ["id"]
  );
}

async function upsertDemoZones(dataSource: DataSource): Promise<void> {
  for (const zone of demoZoneSeed) {
    const wkt = squarePolygonWkt(zone.centerLat, zone.centerLng, zone.halfSizeDeg);

    await dataSource.query(
      `
      INSERT INTO zones (id, name, slug, boundary_type, boundary_geometry, is_active, sort_order)
      VALUES ($1, $2, $3, 'polygon', ST_GeomFromText($4, 4326), true, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        boundary_geometry = EXCLUDED.boundary_geometry,
        sort_order = EXCLUDED.sort_order
      `,
      [zone.id, zone.name, zone.slug, wkt, zone.sortOrder]
    );
  }
}

// Centros existentes de Release 1 (no se upsertean, solo se usan para ubicar
// los eventos demo que reutilizan esas zonas) calculados a partir del
// bounding box definido en seed-release1.ts.
const existingZoneCenters: Pick<DemoZoneSeed, "id" | "centerLat" | "centerLng" | "halfSizeDeg">[] = [
  { id: "zone_cabecera", centerLat: 7.12, centerLng: -73.124, halfSizeDeg: 0.007 },
  { id: "zone_centro", centerLat: 7.11, centerLng: -73.1225, halfSizeDeg: 0.0065 }
];

async function upsertDemoLocationsAndEvents(dataSource: DataSource): Promise<void> {
  const now = Date.now();
  const eventRepository = dataSource.getRepository(EventEntity);
  const zoneById = new Map(
    [...demoZoneSeed, ...existingZoneCenters].map((zone) => [zone.id, zone] as const)
  );

  for (let i = 0; i < demoEventSeed.length; i += 1) {
    const eventSeed = demoEventSeed[i];
    const zone = zoneById.get(eventSeed.zoneId);
    if (!zone) {
      throw new Error(`Zona demo desconocida: ${eventSeed.zoneId}`);
    }

    const { dLat, dLng } = jitter(i, zone.halfSizeDeg / 3);
    const latitude = zone.centerLat + dLat;
    const longitude = zone.centerLng + dLng;
    const locationId = eventSeed.id.replace("evt_demo_", "loc_demo_");

    await dataSource.query(
      `
      INSERT INTO event_locations (id, label, address_text, zone_id, point_geometry, latitude, longitude, precision_level, approximation_note, city_name)
      VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $6, $5, 'neighborhood', $7, 'Bucaramanga')
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        address_text = EXCLUDED.address_text,
        zone_id = EXCLUDED.zone_id,
        point_geometry = EXCLUDED.point_geometry,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        approximation_note = EXCLUDED.approximation_note
      `,
      [locationId, eventSeed.venueName, eventSeed.address, eventSeed.zoneId, longitude, latitude, "Ubicacion aproximada a nivel de barrio."]
    );

    const startsAt = new Date(now + eventSeed.dayOffset * DAY_MS + eventSeed.startHourOffset * HOUR_MS);
    const endsAt = new Date(startsAt.getTime() + eventSeed.durationHours * HOUR_MS);
    const status: "upcoming" | "live" = startsAt.getTime() <= now && endsAt.getTime() >= now ? "live" : "upcoming";

    await eventRepository.upsert(
      {
        id: eventSeed.id,
        title: eventSeed.title,
        slug: slugify(eventSeed.title),
        summary: eventSeed.summary,
        description: eventSeed.description,
        categoryId: eventSeed.categoryId,
        locationId,
        zoneId: eventSeed.zoneId,
        status,
        visibilityState: "visible",
        startsAt,
        endsAt,
        costLabel: eventSeed.costLabel,
        isFree: eventSeed.isFree,
        isApproximateLocation: true,
        isCurated: false
      },
      ["id"]
    );
  }
}

async function seedDemoData(dataSource: DataSource): Promise<void> {
  await upsertDemoCategories(dataSource);
  await upsertDemoZones(dataSource);
  await upsertDemoLocationsAndEvents(dataSource);

  console.log(
    `Seed demo aplicado: ${demoCategorySeed.length} categorias, ${demoZoneSeed.length} zonas y ${demoEventSeed.length} eventos demo.`
  );
}

async function main() {
  await AppDataSource.initialize();
  await seedDemoData(AppDataSource);
  await AppDataSource.destroy();
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
