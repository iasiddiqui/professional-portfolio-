# Backend Architecture

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **ORM:** Prisma (PostgreSQL)
- **Validation:** Zod
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing

## Layered Architecture

```
HTTP Request
    ↓
Routes          — URL mapping, middleware chain, version prefix
    ↓
Controllers     — Parse request, call service, format HTTP response
    ↓
Services        — Business logic, orchestration, authorization checks
    ↓
Repositories    — Data access abstraction over Prisma
    ↓
Database        — PostgreSQL via Prisma Client
```

## Module Structure

Each domain module under `src/modules/` may contain:

```
modules/portfolio/
├── portfolio.controller.ts   (optional — or use top-level controllers/)
├── portfolio.service.ts
├── portfolio.repository.ts
├── portfolio.routes.ts
├── portfolio.validator.ts
└── portfolio.types.ts
```

Top-level `controllers/`, `services/`, `repositories/` folders hold shared or cross-module handlers when module-local files are not used.

## Cross-Cutting Concerns

| Concern | Location |
| ------- | -------- |
| Environment config | `src/config/` |
| Auth middleware | `src/middlewares/auth.middleware.ts` |
| Error handling | `src/middlewares/error.middleware.ts` |
| Request validation | `src/validators/` + `src/middlewares/validate.middleware.ts` |
| Logging | Morgan + structured logger (future) |

## API Conventions

- Base path: `/api/v1`
- RESTful resource naming: `/portfolios`, `/projects`, `/contact-messages`
- Pagination: `?page=1&limit=20`
- Sorting: `?sort=createdAt&order=desc`
