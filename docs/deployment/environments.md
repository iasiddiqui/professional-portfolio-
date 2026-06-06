# Environment Variables

## Root `.env.example`

Shared variables for Docker Compose and cross-app reference.

## Backend (`backend/.env`)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NODE_ENV` | Yes | `development` \| `production` \| `test` |
| `PORT` | Yes | HTTP listen port (default `4000`) |
| `API_PREFIX` | Yes | Route prefix (default `/api/v1`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Access token signing secret (≥32 chars) |
| `JWT_EXPIRES_IN` | Yes | Access token TTL (e.g. `7d`) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token TTL (e.g. `30d`) |
| `CORS_ORIGIN` | Yes | Allowed frontend origin |

## Frontend (`frontend/.env.local`)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Public frontend URL (SEO, OG tags) |

## Security Notes

- Never commit `.env` files
- Use platform secret managers in staging/production
- Rotate JWT secrets on compromise
