# Frontend Architecture

## Stack

- **Framework:** Next.js 15 App Router (React Server Components + Client Components)
- **Styling:** Tailwind CSS v4 + Shadcn UI design tokens
- **Animation:** Framer Motion (client-side transitions)
- **Server State:** TanStack React Query (caching, invalidation, optimistic updates)
- **Forms:** React Hook Form + Zod resolvers
- **HTTP:** Axios with interceptors for auth tokens and error normalization
- **Client State:** Zustand (UI state, auth session metadata)

## Route Groups

| Group | Path prefix | Purpose |
| ----- | ----------- | ------- |
| `(public)` | `/`, `/about`, `/projects`, `/contact` | Marketing and portfolio display |
| `(auth)` | `/login`, `/register` | Authentication flows |
| `(dashboard)` | `/dashboard/*` | Authenticated admin/content management |

## Data Flow

```
Page/Component → Custom Hook → React Query → Service (Axios) → Backend API
                     ↓
              Zustand (local UI state)
```

## Folder Responsibilities

See root README and project scaffold for the full tree. Key conventions:

- **`features/`** — Domain-specific UI logic (components, hooks, schemas, types) co-located per feature
- **`components/`** — Shared, domain-agnostic UI (layout shells, form primitives, Shadcn wrappers)
- **`services/`** — Axios instance and API endpoint functions (no React imports)
- **`providers/`** — React context wrappers (QueryClient, theme, auth)
- **`store/`** — Zustand slices for cross-cutting client state

## Rendering Strategy

| Content type | Strategy |
| ------------ | -------- |
| Public portfolio pages | SSG/ISR where possible for SEO and performance |
| Dashboard | Client-rendered with React Query |
| Auth pages | Client components with form validation |
