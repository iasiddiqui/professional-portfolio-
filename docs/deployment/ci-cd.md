# CI/CD Pipeline

> Placeholder — pipeline will be defined when repository is connected to GitHub Actions (or equivalent).

## Proposed Stages

```mermaid
flowchart LR
    Push --> Lint
    Lint --> Typecheck
    Typecheck --> Test
    Test --> Build
    Build --> DeployStaging
    DeployStaging --> DeployProd
```

## Per-App Jobs

| App | Lint | Typecheck | Build | Test |
| --- | ---- | --------- | ----- | ---- |
| Frontend | `pnpm lint` | `pnpm typecheck` | `pnpm build` | TBD |
| Backend | `pnpm lint` | `pnpm typecheck` | `pnpm build` | TBD |

## Database Migrations in CI

Run `pnpm db:migrate:prod` as a pre-deploy step with `DATABASE_URL` from secrets.

## Branch Strategy

- `main` → production
- `develop` → staging
- Feature branches → PR checks only
