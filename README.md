# Urban Map Bucaramanga

Monorepo modular para el MVP Release 1 de descubrimiento público de eventos en Bucaramanga.

## Stack
- Backend: Node.js + NestJS
- Frontend: React + Vite + TypeScript
- Base de datos: PostgreSQL + PostGIS
- Mapa: Leaflet
- Arquitectura: modular monolith

## Estructura
- `apps/api` - API pública de descubrimiento
- `apps/web` - interfaz pública de descubrimiento
- `packages/shared` - tipos y utilidades compartidas mínimas
- `docs` - especificaciones funcionales y técnicas

## Requisitos
- Node.js 20+
- Docker y Docker Compose

## Instalación
1. Copia `.env.example` a `.env`.
2. Instala dependencias:
   - `npm install`
3. Levanta la base de datos:
   - `docker compose up -d postgres`
4. Ejecuta API y web en desarrollo:
   - `npm run dev:api`
   - `npm run dev:web`

## Swagger
- Documentación del API: `http://localhost:3001/docs`
- Health check: `http://localhost:3001/health`

## Nota
El scaffold solo prepara la estructura base del Release 1. La lógica completa de negocio todavía no está implementada.
