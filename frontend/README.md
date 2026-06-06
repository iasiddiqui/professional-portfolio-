# Portfolio Frontend

Next.js 15 frontend foundation for the portfolio platform.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- Framer Motion
- TanStack React Query
- React Hook Form + Zod
- Axios + Zustand

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

```
src/
├── app/              Route groups: (main), (auth), (admin)
├── components/       ui/, layout/, common/, forms/, animations/
├── features/         Domain modules (auth)
├── services/         Axios API client
├── providers/        Theme, Query, Auth, Toast
├── store/            Zustand (auth token, UI state)
├── hooks/            Shared hooks
├── lib/              Utilities (cn, errors)
├── utils/            Formatters, validators, permissions
├── constants/        Routes, API, query keys
├── types/            Shared TypeScript types
└── styles/           Global CSS + theme tokens
```

## Route Groups

| Group | Purpose |
| ----- | ------- |
| `(main)` | Public marketing shell |
| `(auth)` | Login / register |
| `(admin)` | Protected dashboard |

## Auth Flow

1. Login → access token stored in Zustand (persisted)
2. Refresh token in httpOnly cookie (backend)
3. Axios interceptor auto-refreshes on 401
4. `ProtectedRoute`, `RoleGuard`, `PermissionGuard` for access control

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Theme

Light/dark/system modes persisted in `localStorage`.

- Light: `#FFFFFF` bg, `#0A0A0A` text, `#DC2626` accent
- Dark: `#0A0A0A` bg, `#FFFFFF` text, `#EF4444` accent

Toggle via header `ThemeToggle` component.
