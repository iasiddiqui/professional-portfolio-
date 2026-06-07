# Portfolio Backend API

Production-ready Express + TypeScript + Prisma foundation for a scalable SaaS portfolio platform.

## Architecture

```
HTTP Request
  │
  ├─ Security: helmet → cors → compression → hpp → sanitize → rate-limit
  │
  ├─ routes/v1/          Versioned API entry (/api/v1)
  │     ├─ /health        Infrastructure health check
  │     └─ /auth          Auth routes (stub — logic pending)
  │
  ├─ controllers/        HTTP adapters (thin layer)
  ├─ services/           Business logic
  ├─ repositories/       Prisma data access
  │
  ├─ middlewares/        Cross-cutting concerns
  ├─ validators/         Zod schemas
  ├─ utils/              Logger, responses, error formatting
  └─ lib/prisma.ts       Database singleton
```

### Layer Rules

| Layer | Responsibility |
| ----- | -------------- |
| Routes | URL mapping, middleware chain |
| Controllers | Parse request, call service, return response |
| Services | Business rules, orchestration |
| Repositories | Database queries via Prisma |

Controllers never call repositories directly.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Language:** TypeScript (strict, ESM)
- **Database:** PostgreSQL + Prisma ORM
- **Validation:** Zod
- **Security:** Helmet, CORS, rate limiting, HPP, XSS sanitization
- **Auth (planned):** JWT + bcrypt
- **Integrations (planned):** Resend, Gemini API

## Prerequisites

- Node.js 20+
- PostgreSQL 16 (local or Docker)

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run dev
```

### Docker (Development)

Hot-reload development stack with PostgreSQL:

```bash
cd backend
cp .env.example .env
docker compose up --build
```

### Docker (Production)

From repository root:

```bash
docker compose up -d postgres backend
```

## Environment Variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `PORT` | Yes | HTTP port (default `4000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Access token secret (≥32 chars) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret (≥32 chars) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `CORS_ORIGIN` | Yes | Allowed frontend origin |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window (default 15 min) |
| `RATE_LIMIT_MAX` | No | Max requests per window (default 100) |

All variables are validated at startup via Zod in `src/config/env.ts`.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server with nodemon + tsx |
| `npm run dev:tsx` | Start dev server with tsx watch |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Create/apply dev migrations |
| `npm run db:seed` | Run seed script |

## API Endpoints (Foundation)

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/` | API root info |
| GET | `/api/v1/health` | Health check |

### Health Response

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-06-07T12:00:00.000Z",
    "environment": "development"
  }
}
```

## Response Format

### Success

```json
{ "success": true, "data": {}, "message": "optional" }
```

### Error

```json
{ "success": false, "message": "...", "errors": [{ "field": "email", "message": "..." }] }
```

### Pagination

```json
{
  "success": true,
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## Project Structure

```
src/
├── app.ts                 Express app factory
├── server.ts              Bootstrap + graceful shutdown
├── config/                Environment validation
├── constants/             HTTP status, API constants
├── controllers/           HTTP handlers (per module)
├── services/              Business logic (per module)
├── repositories/          Data access (per module)
├── routes/v1/             Versioned route aggregator
├── middlewares/           Auth, validation, errors, security
├── validators/            Shared Zod schemas
├── modules/
│   ├── auth/              Auth boilerplate (stub)
│   └── health/            Health check route
├── lib/prisma.ts          Prisma singleton
├── prisma/index.ts        Prisma re-export
├── types/                 Shared TypeScript types
└── utils/                 Logger, responses, helpers
```

## Next Steps

1. Define Prisma schema (User, Portfolio, Project, etc.)
2. Implement auth module (register, login, refresh, logout)
3. Add JWT auth middleware
4. Build domain modules (portfolio, projects, contact)
