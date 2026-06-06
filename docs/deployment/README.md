# Deployment Guide

## Environments

| Environment | Frontend | Backend | Database |
| ----------- | -------- | ------- | -------- |
| Local | localhost:3000 | localhost:4000 | Docker Postgres |
| Staging | TBD | TBD | Managed Postgres |
| Production | TBD | TBD | Managed Postgres |

## Recommended Platforms

- **Frontend:** Vercel or Cloudflare Pages (Next.js optimized)
- **Backend:** Railway, Render, Fly.io, or AWS ECS
- **Database:** Neon, Supabase, or AWS RDS

## Pre-deploy Checklist

- [ ] Environment variables configured (see [Environments](./environments.md))
- [ ] Database migrations applied
- [ ] CORS origins set to production frontend URL
- [ ] JWT secrets rotated from development defaults
- [ ] Health check endpoint responding

## Related

- [Docker Setup](./docker.md)
- [CI/CD Pipeline](./ci-cd.md)
