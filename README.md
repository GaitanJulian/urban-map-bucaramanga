# Urban Map Bucaramanga

Urban Map Bucaramanga is a platform for discovering public events in Bucaramanga and managing their publication through organizer submissions, editorial moderation, and reports. It features an interactive map with filters.

## The problem

In a city like Bucaramanga, local events and activities are scattered across social media, messaging groups, and word of mouth, with no single reliable place to discover them. Urban Map Bucaramanga brings them together in one public catalog and builds editorial trust by showing only reviewed and approved content.

## Key features

- **Public discovery**: search, filters by category, zone, free or paid admission, and date; list and interactive map views (Leaflet); and geographic proximity filtering.
- **Event authoring (Organizer Workspace)**: organizers create, edit, validate, and submit event drafts for review, and track their publication status.
- **Editorial moderation (Moderation Workspace)**: a publication review queue supports approval, rejection, correction requests, and escalation. Approved events are added to the public catalog.
- **Reports and trust management**: internal intake of reports about visible content, with triage, resolution, dismissal, and hiding.
- **Role-based authentication**: email and password login (Better Auth) for `organizer`, `moderator`, and `admin` roles, with session and role guards protecting each operational workspace.
- **Minimal admin panel**: a quick view of curated organizers and links to the other workspaces.

## Tech stack

- **Backend**: Node.js, NestJS, TypeORM
- **Database**: PostgreSQL + PostGIS (spatial proximity and zone queries)
- **Authentication**: Better Auth (email and password, cookie-based sessions)
- **Frontend**: React, Vite, TypeScript, React Router
- **Map**: Leaflet
- **Architecture**: modular monolith (npm workspaces monorepo)

## Architecture

The system is organized into bounded contexts within a modular monolith:

- **Event Discovery** — public read model of approved and visible events, independent of moderation internals.
- **Geolocation & Place** — zones, locations, and spatial rules.
- **Event Publication** — event drafts (`EventDraft`), validation, review submission, and `PublicationCase`.
- **Moderation & Trust** — moderation cases, decisions, reports, and escalation; approval projects content into the public `Event` catalog.
- **Identity & Access** — authentication (Better Auth) and role-based authorization (`organizer`, `moderator`, `admin`).
- **Shared Kernel** — minimal types and concepts shared between modules.

Monorepo structure:

- `apps/api` — public discovery, organizer, moderation, reports, and identity APIs.
- `apps/web` — public discovery interface and organizer, moderation, and admin workspaces.
- `packages/shared` — minimal shared types and utilities.

## Implemented releases

- **Release 1 — Public discovery**: listing, search, filters, map view, and event details backed by a stable public API (`GET /api/v1/events`).
- **Release 2 — Publication, moderation, and identity**: event authoring for organizers, a moderation queue with approval, rejection, and correction requests, report management, role-based authentication (Better Auth), and a minimal admin panel.

## Authentication and roles

Identity & Access uses [Better Auth](https://www.better-auth.com) with email and password authentication. Sessions use an httpOnly cookie issued by `/api/auth/*` (Better Auth's native endpoints) and consumed by the `/api/v2/auth/login`, `/api/v2/auth/logout`, and `/api/v2/auth/me` contract endpoints. Session and role guards protect the v2 endpoints for organizer drafts, moderation cases and reports, and organizer administration.

Environment variables in `.env`:

- `BETTER_AUTH_SECRET` — signing secret (at least 32 characters).
- `BETTER_AUTH_URL` — API base URL (`http://localhost:3001` locally).
- `WEB_APP_URL` — frontend origin allowed by CORS/CSRF (`http://localhost:5173` locally).

### Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Organizer | `organizer@urbanmap.local` | `Organizer#2026` |
| Moderator | `moderator@urbanmap.local` | `Moderator#2026` |
| Administrator | `admin@urbanmap.local` | `Admin#2026` |

These accounts are created with `npm.cmd run db:seed:identity --workspace @umb/api`.

## Requirements

- Node.js 20+
- Docker and Docker Compose

## Installation and sample data

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the database:
   ```powershell
   docker compose up -d postgres
   ```
4. Run migrations and load sample data:
   ```powershell
   npm.cmd run db:migrate --workspace @umb/api
   npm.cmd run db:seed:release1 --workspace @umb/api
   npm.cmd run db:seed:identity --workspace @umb/api
   npm.cmd run db:seed:demo --workspace @umb/api
   ```

`db:seed:release1` loads the catalog and the minimum Release 1 events.
`db:seed:identity` creates the demo accounts for the three roles.
`db:seed:demo` is a separate, idempotent seed that expands the category and Bucaramanga zone/neighborhood catalog and adds around 30 realistic fictional events. These include free and paid cultural, sporting, family, nightlife, and educational events scheduled from today through the coming weeks, giving the map and filters realistic sample data. It can be run repeatedly without creating duplicates.

## Development

```powershell
npm run dev:api
npm run dev:web
```

Default URLs:

- API: `http://localhost:3001`
- Web: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

## Production build

```powershell
npm.cmd run build --workspace @umb/api
npm.cmd run build --workspace @umb/web
```

## Swagger and health check

- API documentation: `http://localhost:3001/docs`
- Health check: `http://localhost:3001/health`
- Public discovery: `http://localhost:3001/api/v1/events`
- Operational endpoints (organizer, moderation, identity, administration): `http://localhost:3001/api/v2/*`

## Demo flows

With the environment running and all three seeds applied (`release1`, `identity`, and `demo`):

1. **Public discovery** (`/`, no session): search, filter by category, zone, free or paid admission, and date, and view events in the list and on the map.
2. **Organizer creates an event** (`/organizer`, organizer session): create, edit, save, and validate a draft, then submit it for review.
3. **Moderator approves or rejects** (`/moderation`, moderator session): the queue displays the submitted case; approval adds it to public discovery, while rejection or a correction request keeps it out.
4. **Reports and hiding** (reports tab in `/moderation`): create a report about a visible event, triage it, and hide the event; the hidden event disappears from discovery.
5. **Minimal admin panel** (`/admin`, administrator session): view curated organizers and quickly access the other workspaces.

## Pending deployment work

The project currently runs locally using Docker Compose (Postgres) and the `dev:api`/`dev:web` commands. The following are not yet available:

- A CI/CD pipeline or production deployment.
- Secret management outside the local `.env` file.
- OAuth, 2FA, magic links, or password recovery in Better Auth.
- Analytics, promotions, payments, external integrations, or image uploads.
- An automated test suite (tests and linting are not yet configured for the API or web app).
