# Portfolio Platform

A scalable, production-ready portfolio platform with a decoupled **Next.js 15** frontend and **Express + Prisma** backend.

## Repository Structure

```
.
├── frontend/     # Next.js 15 App Router (UI, client state, API consumption)
├── backend/      # Express REST API (auth, business logic, data access)
└── docs/         # Architecture, API, database, and deployment documentation
```

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Shadcn UI, Framer Motion, React Query, React Hook Form, Zod, Axios |
| Backend  | Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT |
| Infra    | Docker Compose (PostgreSQL), optional containerized apps |

## Prerequisites

- Node.js 20+
- pnpm 9+ (recommended) or npm
- Docker & Docker Compose (for local PostgreSQL)

## Quick Start

```bash
# 1. Clone and configure environment
cp .env.example .env

# 2. Start PostgreSQL
docker compose up -d postgres

# 3. Backend
cd backend
pnpm install
pnpm db:generate
pnpm dev

# 4. Frontend (separate terminal)
cd frontend
pnpm install
pnpm dev
```

| Service  | URL |
| -------- | --- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:4000/api/v1 |
| Postgres | localhost:5432 |

## Documentation

**Start here:** [Complete Project Guide](./docs/PROJECT_GUIDE.md) — tech stack, DB, folder structure, deployment.

**Workflows:** [Backend → Frontend flows](./docs/WORKFLOW.md) — step-by-step diagrams for every module.

See also [`docs/`](./docs/):

- [Architecture Overview](./docs/architecture/overview.md)
- [API Documentation](./docs/api/README.md)
- [Database Design](./docs/database/README.md)
- [Deployment Guide](./docs/deployment/README.md)

## Development Order

1. Backend foundation (config, Prisma schema, auth module)
2. Core API modules (portfolio, projects, contact)
3. Frontend shell (layout, providers, API client)
4. Feature modules (auth → portfolio → projects → contact)
5. Polish (animations, SEO, error boundaries)
6. Deployment pipeline

## License

Private — all rights reserved.
