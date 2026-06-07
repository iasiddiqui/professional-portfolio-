# Professional Portfolio — Complete Project Guide

> **Purpose:** One document to understand the entire codebase — tech stack, why each choice was made, database schema, folder structure, deployment, and how to explain the project in interviews or reviews.

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [High-level architecture](#2-high-level-architecture)
3. [Tech stack and why](#3-tech-stack-and-why)
4. [Repository structure](#4-repository-structure)
5. [Frontend folder structure](#5-frontend-folder-structure)
6. [Backend folder structure](#6-backend-folder-structure)
7. [Database and Prisma schema](#7-database-and-prisma-schema)
8. [Authentication and security](#8-authentication-and-security)
9. [API design](#9-api-design)
10. [Media uploads (Cloudinary)](#10-media-uploads-cloudinary)
11. [Key features explained](#11-key-features-explained)
12. [Deployment](#12-deployment)
13. [Environment variables](#13-environment-variables)
14. [Common commands](#14-common-commands)
15. [Interview talking points](#15-interview-talking-points)
16. [Related docs](#16-related-docs)

---

## 1. What this project is

A **full-stack professional portfolio platform** with:

- **Public site** — projects, blog, about, services, resume, contact, AI chat (“Ask Ishan”)
- **Admin CMS** — manage content, leads, testimonials, settings, analytics
- **REST API** — Express backend with PostgreSQL
- **Production hosting** — Vercel (frontend) + Render (backend) + Neon (database) + Cloudinary (media)

It is a **decoupled monorepo**: frontend and backend live in one Git repo but deploy independently.

---

## 2. High-level architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                                   │
└─────────────────────────────────┬────────────────────────────────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          │                                               │
          ▼                                               ▼
┌─────────────────────┐                     ┌─────────────────────┐
│  Vercel (Frontend)  │                     │  Render (Backend)   │
│  Next.js 15         │  REST /api/v1       │  Express 5          │
│  React 19           │ ◄─────────────────► │  Node.js            │
│                     │  via proxy + cookies│                     │
└─────────────────────┘                     └──────────┬──────────┘
          │                                              │
          │  SSR / SEO pages                             │  Prisma ORM
          │  Admin dashboard                             │
          │                                              ▼
          │                                   ┌─────────────────────┐
          │                                   │  Neon PostgreSQL    │
          │                                   │  (cloud database)   │
          │                                   └─────────────────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  Cloudinary         │     │  Google Gemini      │     │  Resend             │
│  (images/videos/    │     │  (Ask Ishan AI)     │     │  (contact emails)   │
│   PDFs/resumes)     │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### Request flow (admin upload example)

1. User picks an image in admin → frontend sends `POST /api/proxy/v1/media/upload` (multipart)
2. Next.js **proxy route** forwards the request to Render backend with cookies
3. Backend validates JWT → multer reads file → uploads to **Cloudinary**
4. Backend saves media record in **PostgreSQL** (URL, mimeType, etc.)
5. Frontend receives Cloudinary URL and shows preview

### Request flow (public blog page)

1. User visits `/blog/my-post` on Vercel
2. Next.js **server component** calls `publicApi.getBlogPost(slug)` → Render `/api/v1/public/blog/:slug`
3. Page HTML is rendered on server (good for SEO)
4. Images load from Cloudinary URLs

---

## 3. Tech stack and why

### Frontend

| Technology | Role | Why we use it |
|------------|------|----------------|
| **Next.js 15** | React framework | App Router, SSR/SSG for SEO, API routes (proxy), image optimization |
| **React 19** | UI library | Component model, hooks, server components |
| **TypeScript** | Language | Type safety across API contracts and forms |
| **Tailwind CSS 4** | Styling | Utility-first, fast UI iteration, dark mode |
| **Radix UI** | Headless components | Accessible dialogs, selects, dropdowns |
| **TanStack Query** | Server state | Caching, mutations, loading/error for admin API calls |
| **React Hook Form + Zod** | Forms & validation | Performant forms with shared validation rules |
| **Axios** | HTTP client | Interceptors for auth refresh, FormData uploads |
| **TipTap** | Rich text editor | Blog/content editing in admin |
| **Framer Motion** | Animations | Page transitions, polish on public site |
| **Zustand** | Client state | Lightweight global UI state |
| **Lucide React** | Icons | Consistent icon set |
| **isomorphic-dompurify** | HTML sanitization | Safe rendering of blog HTML content |

### Backend

| Technology | Role | Why we use it |
|------------|------|----------------|
| **Node.js + Express 5** | API server | Mature ecosystem, middleware, REST APIs |
| **TypeScript** | Language | Same language as frontend, fewer runtime bugs |
| **Prisma** | ORM | Type-safe DB access, migrations, schema as source of truth |
| **PostgreSQL** | Database | Relational data, JSON fields, production-grade |
| **Zod** | Validation | Request body/query/params validation |
| **JWT + bcrypt** | Auth | Stateless access tokens + secure password hashing |
| **Multer** | File parsing | Multipart uploads before Cloudinary |
| **Cloudinary** | Media storage | Same files from local + production, CDN URLs |
| **Helmet, CORS, rate-limit** | Security | Headers, origin control, abuse prevention |
| **Google Gemini** | AI | “Ask Ishan” chatbot on portfolio |
| **Resend** | Email | Contact form notifications |

### Infrastructure

| Service | Role | Why |
|---------|------|-----|
| **Vercel** | Frontend host | Optimized for Next.js, CDN, easy env vars |
| **Render** | Backend host | Simple Node deploy, free tier for APIs |
| **Neon** | PostgreSQL | Serverless Postgres, branching, connection pooling |
| **Cloudinary** | Media CDN | Persistent uploads (Render disk is ephemeral) |

---

## 4. Repository structure

```
professional_portfolio/
├── frontend/                 # Next.js app (public site + admin)
├── backend/                  # Express API
├── docs/                     # Documentation (you are here)
│   ├── PROJECT_GUIDE.md      # This file — master reference
│   ├── architecture/         # Deep dives (auth, frontend, backend)
│   ├── database/             # ERD, migrations
│   ├── deployment/           # Docker, CI/CD, env vars
│   └── api/                  # API notes
├── README.md
└── .prettierrc / eslint configs
```

---

## 5. Frontend folder structure

```
frontend/src/
├── app/                      # Next.js App Router (pages & routes)
│   ├── (main)/               # Public portfolio pages
│   │   ├── page.tsx          # Home
│   │   ├── about/
│   │   ├── projects/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── resume/
│   │   ├── ask-ishan/        # AI chat
│   │   └── ...
│   ├── (admin)/              # Protected admin area
│   │   ├── dashboard/
│   │   ├── admin/projects/
│   │   ├── admin/blog/
│   │   ├── leads/
│   │   ├── analytics/
│   │   └── settings/
│   ├── (auth)/               # login, register
│   └── api/
│       └── proxy/[...path]/  # Proxies /api/proxy/v1/* → backend (cookies work same-origin)
│
├── features/                 # Feature-based modules (main organization pattern)
│   ├── auth/                 # Login, guards, auth provider
│   ├── projects/             # Project CRUD, upload fields, hooks
│   ├── blog/                 # Blog posts, categories, tags
│   ├── leads/                # CRM pipeline
│   ├── public/               # Public site components (cards, footer, hero)
│   ├── settings/             # Site settings, email templates
│   ├── analytics/            # Visitor stats dashboard
│   ├── ai/                   # Ask Ishan client
│   └── ...
│
├── components/               # Shared UI (buttons, forms, layout, media)
├── lib/                      # Utilities (api-url, media-url, seo, public-api)
├── constants/                # API endpoints, routes, permissions
├── hooks/                    # Shared React hooks
├── providers/                # Query client, theme
├── services/                 # Axios instance, auth service
├── styles/                   # globals.css, Tailwind
└── types/                    # Shared TypeScript types
```

### Why `features/`?

Each domain (blog, projects, leads) owns its own:

- `components/` — UI for that feature
- `hooks/` — React Query hooks
- `services/` — API calls
- `schemas/` — Zod validation
- `types/` — TypeScript interfaces

This keeps admin and public code discoverable and avoids one giant `components/` folder.

### Important frontend files

| File | Purpose |
|------|---------|
| `app/api/proxy/[...path]/route.ts` | Forwards browser API calls to backend; preserves cookies & file uploads |
| `lib/public-api.ts` | Server-side fetch for public pages (SSR) |
| `lib/media-url.ts` | Resolves Cloudinary vs `/uploads/` URLs |
| `components/media/media-image.tsx` | Safe Next.js Image wrapper for uploads |
| `middleware.ts` | Route protection for admin routes |
| `constants/api.ts` | All API endpoint paths |

---

## 6. Backend folder structure

```
backend/src/
├── server.ts                 # Entry point — starts HTTP server
├── app.ts                    # Express app setup (middleware, routes)
├── config/
│   └── env.ts                # Zod-validated environment variables
├── routes/
│   └── v1/index.ts           # Mounts all /api/v1 routers
├── modules/                  # Feature modules (vertical slices)
│   ├── auth/
│   ├── projects/
│   ├── blog/
│   ├── media/
│   ├── public/               # Unauthenticated public endpoints
│   ├── leads/
│   ├── analytics/
│   ├── ai/
│   ├── settings/
│   └── ...
├── repositories/             # Database access (Prisma queries)
├── middlewares/              # auth, validate, upload, rate-limit, errors
├── lib/                      # prisma, cloudinary, gemini, email
├── utils/                    # storage, upload, logger, api-response
└── validators/               # Shared Zod schemas

backend/prisma/
├── schema.prisma             # Database schema (source of truth)
├── migrations/               # SQL migration history
├── seed.ts                   # Dev seed data (admin user, sample content)
└── data/                     # Seed content (AI knowledge base, etc.)
```

### Backend layer pattern

Each module follows:

```
Route → Controller → Service → Repository → Prisma → PostgreSQL
         ↓
      Validator (Zod)
```

| Layer | Responsibility |
|-------|----------------|
| **Routes** | HTTP method + path + middleware chain |
| **Controller** | Parse request, call service, send response |
| **Service** | Business logic, permissions, orchestration |
| **Repository** | Raw DB queries (reusable Prisma calls) |
| **Validator** | Input validation schemas |

### Why repositories + services?

- **Services** = “what the app does” (publish project, upload media)
- **Repositories** = “how data is stored” (findBySlug, create, delete)
- Easier to test and change DB queries without touching HTTP layer

---

## 7. Database and Prisma schema

**Database:** PostgreSQL hosted on **Neon**

**ORM:** Prisma — schema file: `backend/prisma/schema.prisma`

**Connection:**

- `DATABASE_URL` — pooled connection (app runtime, `-pooler` hostname on Neon)
- `DIRECT_URL` — direct connection (migrations only)

### Schema groups

#### Auth & users

| Model | Purpose |
|-------|---------|
| `Role` | ADMIN / EDITOR / USER with JSON permissions array |
| `User` | Admin users, linked to role |
| `Session` | Active login sessions (hashed token) |
| `RefreshToken` | Rotating refresh tokens with family ID (reuse detection) |

#### Portfolio content

| Model | Purpose |
|-------|---------|
| `Project` | Portfolio projects (title, slug, description, tech stack, status) |
| `ProjectCategory` | Optional grouping for projects |
| `BlogPost` | Blog articles (content, SEO fields, publish state) |
| `BlogCategory` | Blog categories |
| `Tag` | Shared tags for projects and blog posts |
| `ProjectTag` / `BlogPostTag` | Many-to-many join tables |
| `Media` | Images/videos/documents (Cloudinary URL, linked to project or blog) |
| `Testimonial` | Client testimonials |
| `Resume` | PDF resume versions (one active at a time) |
| `KnowledgeBase` | AI knowledge entries for “Ask Ishan” |

#### CRM & leads

| Model | Purpose |
|-------|---------|
| `Lead` | Contact / hire-me / consultation form submissions |
| `LeadNote` | Internal notes on leads by admin users |

#### Platform

| Model | Purpose |
|-------|---------|
| `SiteSettings` | Site name, logo, social links, email templates (JSON) |
| `Analytics` | Visit/page-view events for visitor counter |
| `AiInteraction` | Logged AI prompts/responses for auditing |

### Important enums

| Enum | Values | Used for |
|------|--------|----------|
| `ProjectStatus` | DRAFT, PUBLISHED, ARCHIVED | Project visibility |
| `LeadStatus` | NEW, CONTACTED, IN_PROGRESS, CLOSED | CRM pipeline |
| `LeadSource` | CONTACT, HIRE_ME, CONSULTATION | Where lead came from |
| `MediaType` | IMAGE, DOCUMENT, VIDEO, OTHER | Upload classification |
| `ContentFormat` | MDX, MARKDOWN, HTML | Blog body format |
| `AiFeatureType` | ASK_ISHAN, PROJECT_ESTIMATOR | AI feature tracking |

### Entity relationships (simplified)

```
User ──► BlogPost (author)
User ──► LeadNote

Project ──► Media (gallery + thumbnail)
Project ──► ProjectCategory
Project ◄──► Tag (via ProjectTag)

BlogPost ──► Media
BlogPost ──► BlogCategory
BlogPost ◄──► Tag (via BlogPostTag)

Lead ──► LeadNote
```

See also: [docs/database/erd.md](./database/erd.md)

---

## 8. Authentication and security

### How login works

1. User submits email/password → `POST /api/v1/auth/login`
2. Backend verifies password (bcrypt) → issues **access JWT** + **refresh token**
3. Tokens stored in **httpOnly cookies** (not localStorage — XSS safe)
4. Browser calls API via `/api/proxy/v1/*` so cookies stay same-origin on Vercel
5. On 401, Axios interceptor calls `/auth/refresh-token` and retries

### Authorization

- **Roles:** ADMIN, EDITOR, USER
- **Permissions:** JSON array on Role (e.g. `projects:write`, `blog:publish`)
- **Middleware:** `authenticate` → `requirePermission` on protected routes

### Other security

| Measure | Implementation |
|---------|----------------|
| Rate limiting | express-rate-limit on API, auth, AI, contact |
| HTTP headers | Helmet |
| Input sanitization | Zod validation + HTML sanitization on frontend |
| CORS | Restricted to frontend origin |
| Password hashing | bcryptjs |

See: [docs/architecture/auth-architecture.md](./architecture/auth-architecture.md)

---

## 9. API design

**Base URL:** `/api/v1`

**Response format:**

```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... },
  "meta": { "pagination": { ... } }
}
```

### Route groups

| Prefix | Auth | Purpose |
|--------|------|---------|
| `/public/*` | No | Site content, contact forms, analytics visit tracking |
| `/auth/*` | Mixed | Login, register, refresh, me |
| `/projects`, `/blog`, `/media` | Yes | Admin CMS CRUD |
| `/leads` | Yes | CRM |
| `/settings` | Yes | Site configuration |
| `/analytics` | Yes | Admin analytics dashboard |
| `/public/ai/ask` | No | Ask Ishan chatbot |

See: [docs/api/README.md](./api/README.md)

---

## 10. Media uploads (Cloudinary)

### Why not local disk?

- **Local dev** saves to `backend/uploads/` — only on your machine
- **Render** has ephemeral disk — files disappear on redeploy
- **Cloudinary** gives permanent CDN URLs shared by local + production

### Upload flow

1. Admin uploads file → `POST /api/v1/media/upload`
2. Multer reads file into memory buffer
3. `storage.ts` uploads to Cloudinary (`portfolio/media` or `portfolio/resumes`)
4. DB stores `url` (Cloudinary HTTPS URL) and `filename` (Cloudinary public_id)

### Supported types

| Type | Endpoint | Cloudinary resource |
|------|----------|---------------------|
| Images | `/media/upload` | `image` |
| Videos | `/media/upload` | `video` |
| PDFs (resume) | `/resume/upload` | `raw` |

### Key files

- `backend/src/lib/cloudinary.ts` — Cloudinary SDK wrapper
- `backend/src/utils/storage.ts` — Upload/delete abstraction
- `backend/src/middlewares/upload.middleware.ts` — Multer config
- `frontend/src/lib/media-url.ts` — URL resolution for display

---

## 11. Key features explained

| Feature | Public | Admin | Backend module |
|---------|--------|-------|----------------|
| Projects showcase | `/projects` | `/admin/projects` | `projects`, `media` |
| Blog | `/blog` | `/admin/blog` | `blog`, `blog-categories` |
| Contact / Hire / Consultation | `/contact`, `/hire-me` | `/leads` | `public`, `contact`, `leads` |
| Resume download | `/resume` | `/admin/resume` | `resume` |
| Testimonials | Home page | `/admin/testimonials` | `testimonials` |
| Ask Ishan AI | `/ask-ishan` | `/admin/knowledge-base` | `ai`, `knowledge-base` |
| Visitor count | Footer | `/analytics` | `analytics` |
| Site settings | — | `/settings` | `settings` |
| About page | `/about` | `/admin/about` | `public`, knowledge in DB |

### SEO

- Server-rendered metadata via `generateMetadata()`
- JSON-LD structured data (`lib/seo/json-ld.ts`)
- Sitemap (`app/sitemap.ts`) and RSS feed (`app/feed.xml/route.ts`)

---

## 12. Deployment

| App | Platform | URL pattern |
|-----|----------|-------------|
| Frontend | Vercel | `https://professional-portfolio-eta-orcin.vercel.app` |
| Backend | Render | `https://professional-portfolio-bhvq.onrender.com` |
| Database | Neon | Connection string in env |
| Media | Cloudinary | `https://res.cloudinary.com/<cloud_name>/...` |

### Deploy checklist

1. Push code to GitHub `main`
2. Render auto-deploys backend — set env vars in Render dashboard
3. Vercel auto-deploys frontend — set `NEXT_PUBLIC_*` vars, redeploy
4. Run migrations on production: `npm run db:migrate:prod` (or Render build command)

See: [docs/deployment/README.md](./deployment/README.md)

---

## 13. Environment variables

### Backend (Render)

| Variable | Example / notes |
|----------|-----------------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon pooled URL |
| `DIRECT_URL` | Neon direct URL |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Min 32 chars |
| `CORS_ORIGIN` | Vercel URL (no trailing slash) |
| `PUBLIC_URL` | Render backend URL |
| `CLOUDINARY_CLOUD_NAME` | e.g. `dg402dydx` |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `GEMINI_API_KEY` | Google AI Studio |
| `RESEND_API_KEY` | Email service |

### Frontend (Vercel)

| Variable | Example / notes |
|----------|-----------------|
| `NEXT_PUBLIC_API_URL` | `https://...onrender.com/api/v1` (**must include `/api/v1`**) |
| `NEXT_PUBLIC_APP_URL` | Vercel site URL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as backend cloud name |

Full list: [docs/deployment/environments.md](./deployment/environments.md)

---

## 14. Common commands

### Backend

```bash
cd backend
npm run dev              # Start dev server (port 4000)
npm run db:migrate       # Run migrations (dev)
npm run db:seed          # Seed admin + sample data
npm run db:studio        # Prisma GUI
npm run typecheck        # TypeScript check
```

### Frontend

```bash
cd frontend
npm run dev              # Start Next.js (port 3000)
npm run build            # Production build
npm run typecheck        # TypeScript check
```

---

## 15. Interview talking points

**“Walk me through the architecture.”**  
Decoupled monorepo: Next.js frontend on Vercel, Express API on Render, PostgreSQL on Neon. Frontend uses a same-origin API proxy so httpOnly auth cookies work in production. Media goes to Cloudinary so uploads are shared across environments.

**“Why PostgreSQL + Prisma?”**  
Relational data (users, projects, tags, leads) fits SQL well. Prisma gives type-safe queries and migration history from a single schema file.

**“How does auth work?”**  
JWT access tokens + rotating refresh tokens in httpOnly cookies, bcrypt passwords, role-based permissions stored as JSON on the Role model.

**“How do you handle file uploads?”**  
Multer parses multipart on the server, uploads to Cloudinary, stores the CDN URL in the Media table. Avoids Render’s ephemeral filesystem.

**“How is the frontend organized?”**  
Feature-based folders under `src/features/`, App Router for routes, React Query for server state, Zod + React Hook Form for forms.

**“How is SEO handled?”**  
Server components fetch public data at request time, `generateMetadata` for titles/descriptions, JSON-LD, sitemap, and RSS.

**“What about the AI feature?”**  
Google Gemini with a seeded KnowledgeBase in PostgreSQL. Public endpoint rate-limited; interactions logged in `AiInteraction` table.

---

## 16. Related docs

| Document | Topic |
|----------|-------|
| [WORKFLOW.md](./WORKFLOW.md) | **Backend → frontend step-by-step flows (diagrams)** |
| [architecture/overview.md](./architecture/overview.md) | System context |
| [architecture/frontend-architecture.md](./architecture/frontend-architecture.md) | Frontend patterns |
| [architecture/backend-architecture.md](./architecture/backend-architecture.md) | Backend layers |
| [architecture/auth-architecture.md](./architecture/auth-architecture.md) | Auth deep dive |
| [database/erd.md](./database/erd.md) | Entity relationship diagram |
| [database/migrations.md](./database/migrations.md) | Migration workflow |
| [deployment/README.md](./deployment/README.md) | Deploy guide |

---

*Last updated: June 2026 — reflects Cloudinary media, Neon DB, Vercel + Render deployment.*
