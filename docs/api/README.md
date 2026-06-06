# API Documentation

Base URL: `http://localhost:4000/api/v1`

## Response Envelope

### Success

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

### Paginated

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

---

## Auth Endpoints

Base path: `/api/v1/auth`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/register` | No | Create account (USER role) |
| POST | `/login` | No | Login and receive tokens |
| POST | `/refresh-token` | Cookie/Body | Rotate tokens |
| POST | `/logout` | Yes | Revoke session and clear cookie |
| GET | `/me` | Yes | Current user profile |
| PATCH | `/change-password` | Yes | Change password, revoke sessions |

### POST /auth/register

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "USER", "permissions": [] },
    "accessToken": "eyJ...",
    "expiresIn": "7d",
    "expiresInSeconds": 604800
  }
}
```

Sets `refresh_token` httpOnly cookie.

### POST /auth/login

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

**Response (200):** Same shape as register.

### POST /auth/refresh-token

**Cookie:** `refresh_token` (preferred)

**Body (optional fallback):**
```json
{ "refreshToken": "eyJ..." }
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJ...",
    "expiresIn": "7d",
    "expiresInSeconds": 604800
  }
}
```

### POST /auth/logout

**Header:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{ "success": true, "message": "Logout successful", "data": null }
```

### GET /auth/me

**Header:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "permissions": ["projects:read", "projects:write"],
    "isActive": true
  }
}
```

### PATCH /auth/change-password

**Header:** `Authorization: Bearer <accessToken>`

**Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456",
  "confirmPassword": "NewPass456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again.",
  "data": null
}
```

---

## Infrastructure

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/` | No | API root info |
| GET | `/health` | No | Health check |

See [Auth Architecture](../architecture/auth-architecture.md) for security details.
