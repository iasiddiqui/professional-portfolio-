# Database Migrations

## Initial Migration

After pulling the schema, run the initial migration:

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
# Enter migration name: init
npm run db:seed
```

This creates all tables, indexes, and seeds roles + optional admin user.

## Development Workflow

```bash
# 1. Edit prisma/schema.prisma
# 2. Create and apply migration
npm run db:migrate

# 3. Regenerate client if needed
npm run db:generate

# 4. Update docs/database/erd.md if relationships changed
```

## Production Deployment

```bash
npm run db:migrate:prod
npm run db:seed   # only for initial deploy or when seed data changes
```

## Prototyping (Dev Only)

```bash
npm run db:push   # sync schema without migration files
```

> Do not use `db:push` in production. Always use versioned migrations.

## Rollback Policy

- Never edit applied migration SQL files
- Create forward migrations to revert schema changes
- Test migrations against a production data snapshot before deploy

## Migration Checklist

- [ ] Schema validates with `prisma validate`
- [ ] Client regenerated with `db:generate`
- [ ] Migration applied locally
- [ ] Seed runs without errors
- [ ] Typecheck passes
- [ ] ERD documentation updated
