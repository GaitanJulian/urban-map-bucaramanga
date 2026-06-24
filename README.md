# Urban Map Bucaramanga

Monorepo modular para descubrir eventos públicos en Bucaramanga y operar su
publicación controlada (autoría, moderación y reportes).

## Stack

- Backend: Node.js + NestJS + TypeORM
- Frontend: React + Vite + TypeScript
- Base de datos: PostgreSQL + PostGIS
- Mapa: Leaflet
- Arquitectura: monolito modular

## Estructura

- `apps/api` - API de descubrimiento (Release 1) y de organizador/moderación/reportes (Release 2)
- `apps/web` - interfaz pública de descubrimiento y workspaces de organizador y moderación
- `packages/shared` - tipos y utilidades compartidas mínimas
- `docs` - especificaciones funcionales, de arquitectura y evidencia de validación

## Rutas frontend

- `/` - descubrimiento público de eventos (Release 1)
- `/login` - acceso mínimo a los workspaces (sin autenticación real todavía)
- `/organizer` - crear, editar, validar y enviar borradores de evento a revisión
- `/moderation` - cola de publicaciones y gestión de reportes

## Requisitos

- Node.js 20+
- Docker y Docker Compose

## Instalación

1. Copia `.env.example` a `.env`.
2. Instala dependencias:
   ```powershell
   npm install
   ```
3. Levanta la base de datos:
   ```powershell
   docker compose up -d postgres
   ```
4. Ejecuta migraciones y carga datos de ejemplo de Release 1:
   ```powershell
   npm.cmd run db:migrate --workspace @umb/api
   npm.cmd run db:seed:release1 --workspace @umb/api
   ```

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
- Endpoints operativos de Release 2: `http://localhost:3001/api/v2/*`

## Documentación adicional

- `docs/DEMO-READY-CHECKLIST.md` - flujos de demo principales y su validación.
- `CLAUDE-HANDOFF.md` - contexto operativo completo del proyecto (estado funcional, arquitectura, limitaciones conocidas).
- `docs/release-2/` - especificaciones y evidencia de implementación de Release 2.

## Nota

Identity & Access sigue siendo un scaffold mínimo: no hay autenticación ni
autorización reales todavía. Auth, analítica, promociones, pagos, upload de
imágenes y mapas interactivos de autoría no están implementados.
