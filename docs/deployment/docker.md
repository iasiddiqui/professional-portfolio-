# Docker

## Local PostgreSQL

From the repository root:

```bash
cp .env.example .env
docker compose up -d postgres
```

Verify:

```bash
docker compose ps
docker compose logs postgres
```

## Full Stack (Future)

Uncomment `backend` and `frontend` services in root `docker-compose.yml` once Dockerfiles are added.

## Production

Production deployments should use managed database services rather than containerized Postgres for reliability and automated backups.
