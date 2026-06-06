# System Design

## Entity Relationships (Planned)

```
User 1──1 Portfolio
User 1──* Project
Portfolio 1──* Project (optional association)
ContactMessage *──? User (optional, for logged-in submissions)
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth API
    participant D as Database

    C->>A: POST /auth/login (email, password)
    A->>D: Verify credentials
    D-->>A: User record
    A-->>C: accessToken + refreshToken
    C->>A: GET /protected (Bearer accessToken)
    A-->>C: Resource data
    C->>A: POST /auth/refresh (refreshToken)
    A-->>C: New accessToken
```

## Deployment Topology (Target)

```mermaid
flowchart LR
    User --> CDN[CDN / Vercel]
    CDN --> FE[Next.js Frontend]
    FE --> BE[Express Backend]
    BE --> PG[(PostgreSQL)]
```

## Scalability Considerations

- **Horizontal scaling:** Stateless backend instances behind a load balancer
- **Database:** Connection pooling via PgBouncer in production
- **Caching:** Redis for session/rate-limiting (future phase)
- **File storage:** S3-compatible object storage for portfolio assets (future phase)
