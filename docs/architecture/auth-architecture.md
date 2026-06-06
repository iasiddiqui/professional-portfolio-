# Authentication Architecture

## Overview

JWT-based authentication with refresh token rotation, httpOnly cookies, and role-based access control (RBAC).

```
Client                    API                         Database
  │                        │                              │
  ├── POST /login ────────►│── validate credentials ─────►│ User + Role
  │                        │◄── user + permissions ───────│
  │                        │── create Session ───────────►│ Session
  │                        │── store RefreshToken hash ──►│ RefreshToken
  │◄── accessToken (body) ─│                              │
  │◄── refreshToken (cookie)                              │
  │                        │                              │
  ├── GET /protected ─────►│── authenticate middleware ──►│ verify JWT
  │   Authorization: Bearer│── requirePermission ────────►│ check permissions
  │                        │                              │
  ├── POST /refresh-token ►│── verify refresh JWT ───────►│ find + rotate token
  │◄── new accessToken ────│◄── revoke old, issue new ───►│ RefreshToken
  │◄── new refresh cookie ─│                              │
```

## Token Strategy

| Token | Storage | Lifetime | Purpose |
| ----- | ------- | -------- | ------- |
| Access Token | Response body / memory | Short (default 7d) | API authorization header |
| Refresh Token | httpOnly secure cookie | Long (default 30d) | Obtain new access tokens |

Both tokens are JWTs. Refresh tokens are also hashed (SHA-256) and stored in the database for revocation and rotation.

## Token Rotation

On each refresh request:

1. Verify JWT signature and expiry
2. Look up token hash in `RefreshToken` table
3. Reject if revoked, expired, or family mismatch
4. Revoke the used token
5. Issue new access + refresh tokens within the same `familyId`
6. If a revoked token is reused → revoke entire family (reuse detection)

## Session Management

Each login creates a `Session` record with:

- Hashed session ID (linked to JWT payload)
- User agent and IP address
- Expiry aligned with refresh token lifetime

Logout revokes the refresh token family and deletes the session.

Password change revokes all refresh tokens and sessions for the user.

## RBAC Structure

### Roles

| Role | Description |
| ---- | ----------- |
| `ADMIN` | Full platform access |
| `EDITOR` | Content management (projects, blog, leads, media) |
| `USER` | Read-only access to public content |

### Permissions

Granular permissions defined in `src/constants/permissions.ts`:

```
resource:action   e.g. projects:write, blog:publish, analytics:read
```

Stored as JSON array on the `Role` model. Embedded in the access token JWT payload for fast authorization checks.

### Middleware

| Middleware | Purpose |
| ---------- | ------- |
| `authenticate` | Verify Bearer access token, attach `req.user` |
| `requireRole(...roles)` | Restrict by role name |
| `requirePermission(...perms)` | Require all listed permissions |
| `requireAnyPermission(...perms)` | Require at least one permission |

## Security Measures

- Passwords hashed with bcrypt (12 rounds)
- Refresh tokens in httpOnly, secure (production), sameSite cookies
- Rate limiting on all auth endpoints
- XSS request sanitization before route handlers
- Token family revocation on suspected reuse
- Account deactivation check on login and refresh

## File Structure

```
src/modules/auth/
├── auth.controller.ts    HTTP handlers
├── auth.service.ts       Business logic
├── auth.repository.ts    Prisma data access
├── auth.routes.ts        Route definitions
└── auth.validator.ts     Zod schemas

src/middlewares/
├── auth.middleware.ts    JWT verification
└── role.middleware.ts    RBAC guards

src/utils/
├── password.ts           bcrypt helpers
├── token.ts              JWT sign/verify
├── hash-token.ts         SHA-256 token hashing
└── cookie.ts             Secure cookie helpers
```
