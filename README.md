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
- `/login` - inicio de sesión real (Better Auth) para organizador, moderador y administrador
- `/organizer` - crear, editar, validar y enviar borradores de evento a revisión (requiere sesión de organizador)
- `/moderation` - cola de publicaciones y gestión de reportes (requiere sesión de moderador)

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
4. Ejecuta migraciones y carga datos de ejemplo de Release 1 y usuarios demo de Identity & Access:
   ```powershell
   npm.cmd run db:migrate --workspace @umb/api
   npm.cmd run db:seed:release1 --workspace @umb/api
   npm.cmd run db:seed:identity --workspace @umb/api
   ```

## Autenticación (Better Auth)

Identity & Access usa [Better Auth](https://www.better-auth.com) con email y
contraseña real. La sesión se maneja con una cookie httpOnly emitida por
`/api/auth/*` (superficie nativa de Better Auth) y consumida por los
endpoints de contrato `/api/v2/auth/login`, `/api/v2/auth/logout` y
`/api/v2/auth/me`.

Variables nuevas en `.env`:

- `BETTER_AUTH_SECRET` - secreto de firma (mínimo 32 caracteres).
- `BETTER_AUTH_URL` - URL base del API (`http://localhost:3001` en local).
- `WEB_APP_URL` - origen del frontend permitido por CORS/CSRF (`http://localhost:5173` en local).

Cuentas demo creadas por `npm.cmd run db:seed:identity --workspace @umb/api`:

| Rol | Email | Contraseña |
| --- | --- | --- |
| Organizador | `organizer@urbanmap.local` | `Organizer#2026` |
| Moderador | `moderator@urbanmap.local` | `Moderator#2026` |
| Administrador | `admin@urbanmap.local` | `Admin#2026` |

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

Identity & Access usa autenticación y autorización reales (Better Auth) con
los roles `organizer`, `moderator` y `admin`. No implementa OAuth, 2FA, magic
links ni recuperación de contraseña. Analítica, promociones, pagos, upload de
imágenes y mapas interactivos de autoría no están implementados.
