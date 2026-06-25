# Urban Map Bucaramanga

Urban Map Bucaramanga es una plataforma para descubrir eventos públicos en
Bucaramanga y operar su publicación de forma controlada: autoría por
organizadores, moderación editorial y gestión de reportes, sobre un mapa
interactivo con filtros reales.

## El problema

En una ciudad intermedia como Bucaramanga, la oferta de planes, cultura y
eventos locales está dispersa entre redes sociales, grupos de mensajería y
boca a boca, sin un lugar único y confiable para descubrirla. Urban Map
Bucaramanga centraliza esa oferta en un solo inventario público, y resuelve
el problema de confianza editorial: solo el contenido revisado y aprobado
llega a las personas que buscan qué hacer en la ciudad.

## Features principales

- **Descubrimiento público**: búsqueda, filtros por categoría, zona,
  gratis/pago y fecha, vista de lista y mapa interactivo (Leaflet), y
  filtrado por proximidad geográfica.
- **Autoría de eventos (Organizer Workspace)**: los organizadores crean,
  editan, validan y envían borradores de evento a revisión, con seguimiento
  de estado de publicación.
- **Moderación editorial (Moderation Workspace)**: cola de casos de
  publicación con aprobación, rechazo, solicitud de corrección y escalado;
  una aprobación proyecta el evento hacia el inventario público.
- **Gestión de reportes y confianza**: intake interno de reportes sobre
  contenido visible, con triage, resolución, descarte y ocultamiento.
- **Autenticación real con roles**: login con email y contraseña (Better
  Auth) para los roles `organizer`, `moderator` y `admin`, con guards de
  sesión y rol protegiendo cada superficie operativa.
- **Panel de administración mínimo**: vista rápida de organizadores curados
  y accesos directos a los demás workspaces.

## Stack técnico

- **Backend**: Node.js, NestJS, TypeORM
- **Base de datos**: PostgreSQL + PostGIS (consultas espaciales de
  proximidad y zonas)
- **Autenticación**: Better Auth (email y contraseña, sesión por cookie)
- **Frontend**: React, Vite, TypeScript, React Router
- **Mapa**: Leaflet
- **Arquitectura**: monolito modular (monorepo de workspaces npm)

## Arquitectura

El sistema se organiza en bounded contexts dentro de un monolito modular:

- **Event Discovery** — read model público de eventos aprobados y
  visibles; no conoce detalles internos de moderación.
- **Geolocation & Place** — zonas, ubicaciones y reglas espaciales.
- **Event Publication** — borradores de evento (`EventDraft`), validación,
  envío a revisión y `PublicationCase`.
- **Moderation & Trust** — casos de moderación, decisiones, reportes y
  escalado; una aprobación proyecta el contenido al `Event` público.
- **Identity & Access** — autenticación real (Better Auth) y autorización
  por rol (`organizer`, `moderator`, `admin`).
- **Shared Kernel** — tipos y conceptos mínimos compartidos entre módulos.

Estructura del monorepo:

- `apps/api` — API de descubrimiento público y de organizador,
  moderación, reportes e identidad.
- `apps/web` — interfaz pública de descubrimiento y workspaces de
  organizador, moderación y administración.
- `packages/shared` — tipos y utilidades compartidas mínimas.
- `docs` — especificaciones funcionales, de arquitectura y evidencia de
  validación por slice.

## Releases implementados

- **Release 1 — Discovery público**: listado, búsqueda, filtros, vista de
  mapa y detalle de evento sobre una API pública estable
  (`GET /api/v1/events`).
- **Release 2 — Publicación, moderación e identidad**: authoring de
  eventos para organizadores, cola de moderación con aprobación/rechazo/
  corrección, gestión de reportes, autenticación real con roles (Better
  Auth) y un panel de administración mínimo.

## Autenticación y roles

Identity & Access usa [Better Auth](https://www.better-auth.com) con email
y contraseña reales. La sesión se maneja con una cookie httpOnly emitida
por `/api/auth/*` (superficie nativa de Better Auth) y consumida por los
endpoints de contrato `/api/v2/auth/login`, `/api/v2/auth/logout` y
`/api/v2/auth/me`. Los guards de sesión y rol protegen los endpoints v2 de
borradores de organizador, casos/reportes de moderación y administración
de organizadores.

Variables nuevas en `.env`:

- `BETTER_AUTH_SECRET` — secreto de firma (mínimo 32 caracteres).
- `BETTER_AUTH_URL` — URL base del API (`http://localhost:3001` en local).
- `WEB_APP_URL` — origen del frontend permitido por CORS/CSRF
  (`http://localhost:5173` en local).

### Credenciales demo

| Rol | Email | Contraseña |
| --- | --- | --- |
| Organizador | `organizer@urbanmap.local` | `Organizer#2026` |
| Moderador | `moderator@urbanmap.local` | `Moderator#2026` |
| Administrador | `admin@urbanmap.local` | `Admin#2026` |

Estas cuentas se crean con `npm.cmd run db:seed:identity --workspace @umb/api`.

## Requisitos

- Node.js 20+
- Docker y Docker Compose

## Instalación y datos de ejemplo

1. Copia `.env.example` a `.env`.
2. Instala dependencias:
   ```powershell
   npm install
   ```
3. Levanta la base de datos:
   ```powershell
   docker compose up -d postgres
   ```
4. Ejecuta migraciones y carga los datos de ejemplo:
   ```powershell
   npm.cmd run db:migrate --workspace @umb/api
   npm.cmd run db:seed:release1 --workspace @umb/api
   npm.cmd run db:seed:identity --workspace @umb/api
   npm.cmd run db:seed:demo --workspace @umb/api
   ```

`db:seed:release1` carga el catálogo y los eventos mínimos de Release 1.
`db:seed:identity` crea las cuentas demo de los tres roles.
`db:seed:demo` es un seed adicional, idempotente y separado: amplía el
catálogo de categorías y zonas/barrios de Bucaramanga, y agrega alrededor
de 30 eventos ficticios realistas (gratis y pagos, culturales, deportivos,
familiares, nocturnos y educativos) repartidos entre hoy y las próximas
semanas, para que el mapa y los filtros se vean poblados como en un
producto real. Puede ejecutarse varias veces sin duplicar datos.

## Desarrollo

```powershell
npm run dev:api
npm run dev:web
```

URLs por defecto:

- API: `http://localhost:3001`
- Web: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

## Build de producción

```powershell
npm.cmd run build --workspace @umb/api
npm.cmd run build --workspace @umb/web
```

## Swagger y health check

- Documentación del API: `http://localhost:3001/docs`
- Health check: `http://localhost:3001/health`
- Descubrimiento público: `http://localhost:3001/api/v1/events`
- Endpoints operativos (organizador, moderación, identidad,
  administración): `http://localhost:3001/api/v2/*`

## Flujos de demo

Con el entorno levantado y los tres seeds aplicados (`release1`, `identity`
y `demo`):

1. **Discovery público** (`/`, sin sesión): buscar, filtrar por categoría,
   zona, gratis/pago y fecha, y ver los eventos en lista y en el mapa.
2. **Organizer crea un evento** (`/organizer`, sesión de organizador):
   crear un borrador, editarlo, guardarlo, validarlo y enviarlo a revisión.
3. **Moderator aprueba o rechaza** (`/moderation`, sesión de moderador): la
   cola muestra el caso enviado; aprobarlo lo proyecta a discovery público,
   rechazarlo o pedir corrección lo mantiene fuera.
4. **Reportes y ocultamiento** (pestaña de reportes en `/moderation`):
   crear un reporte sobre un evento visible, hacer triage y ocultarlo;
   el evento oculto desaparece de discovery.
5. **Panel admin mínimo** (`/admin`, sesión de administrador): ver los
   organizadores curados y acceder rápidamente a los demás workspaces.

## Documentación adicional

- `docs/DEMO-READY-CHECKLIST.md` — flujos de demo principales y su
  validación.
- `docs/release-2/implementation/DEMO-DATA-AND-BRANDING.md` — seed demo y
  pulido de marca/copy.
- `CLAUDE-HANDOFF.md` — contexto operativo completo del proyecto (estado
  funcional, arquitectura, limitaciones conocidas).
- `docs/release-2/` — especificaciones y evidencia de implementación de
  Release 2.

## Notas de despliegue pendiente

El proyecto corre hoy en local mediante Docker Compose (Postgres) y los
comandos `dev:api`/`dev:web`. No hay todavía:

- Pipeline de CI/CD ni despliegue a un entorno productivo.
- Gestión de secretos fuera de `.env` local.
- OAuth, 2FA, magic links ni recuperación de contraseña en Better Auth.
- Analítica, promociones, pagos, integraciones externas ni upload de
  imágenes.
- Suite de tests automatizados (API y web no tienen tests ni lint
  configurados todavía).
