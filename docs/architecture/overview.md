# Architecture Overview

## System Context

The portfolio platform is a **decoupled monorepo** with two independently deployable applications:

```
┌─────────────┐       REST/JSON        ┌─────────────┐       Prisma        ┌────────────┐
│   Frontend  │ ◄──────────────────► │   Backend   │ ◄─────────────────► │ PostgreSQL │
│  Next.js 15 │      JWT Auth         │   Express   │                     │            │
└─────────────┘                       └─────────────┘                     └────────────┘
```

## Design Principles

| Principle | Implementation |
| --------- | -------------- |
| Separation of concerns | Frontend handles presentation; backend handles business rules and persistence |
| Feature-based organization | Both apps group code by domain (auth, portfolio, projects, contact) |
| Layered backend | Routes → Controllers → Services → Repositories → Database |
| Type safety end-to-end | TypeScript + Zod (frontend) + Zod (backend) + Prisma types |
| API versioning | All endpoints under `/api/v1` |

## Communication

- **Protocol:** HTTPS REST with JSON payloads
- **Authentication:** JWT access tokens (Bearer header) + refresh token rotation
- **Error format:** Consistent `{ success, message, errors?, data? }` envelope

## Related Documents

- [Frontend Architecture](./frontend-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [System Design](./system-design.md)
