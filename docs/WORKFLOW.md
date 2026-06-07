# Application Workflows — Backend → Frontend

> Step-by-step flows for how data moves through the system. Read **Part 1 (Backend)** first, then **Part 2 (Frontend)**.

Related: [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | [architecture/overview.md](./architecture/overview.md) | **[Visual diagrams](./diagrams/system-diagrams.md)**

---

## Table of contents

**Part 1 — Backend**
1. [Server startup](#1-backend-server-startup)
2. [Every HTTP request pipeline](#2-backend-every-http-request-pipeline)
3. [Layer pattern (all modules)](#3-backend-layer-pattern-all-modules)
4. [Auth workflow](#4-backend-auth-workflow)
5. [Public content workflow](#5-backend-public-content-workflow)
6. [Admin CRUD workflow (projects example)](#6-backend-admin-crud-workflow-projects)
7. [Media upload workflow](#7-backend-media-upload-workflow)
8. [Contact & leads workflow](#8-backend-contact--leads-workflow)
9. [Ask Ishan AI workflow](#9-backend-ask-ishan-ai-workflow)
10. [Analytics workflow](#10-backend-analytics-workflow)
11. [Error handling workflow](#11-backend-error-handling)

**Part 2 — Frontend**
12. [App bootstrap](#12-frontend-app-bootstrap)
13. [Routing & layouts](#13-frontend-routing--layouts)
14. [API client & proxy](#14-frontend-api-client--proxy)
15. [Public page workflow (SSR)](#15-frontend-public-page-workflow-ssr)
16. [Admin page workflow (CSR)](#16-frontend-admin-page-workflow-csr)
17. [Auth workflow (frontend)](#17-frontend-auth-workflow)
18. [Form + mutation workflow](#18-frontend-form--mutation-workflow)
19. [Media upload workflow (frontend)](#19-frontend-media-upload-workflow)

**End-to-end**
20. [Full journey maps](#20-full-end-to-end-journey-maps)

---

# Part 1 — Backend

## 1. Backend server startup

**Entry file:** `backend/src/server.ts`

```mermaid
flowchart TD
    A[server.ts starts] --> B[Load dotenv + validate env.ts]
    B --> C[connectDatabase via Prisma]
    C --> D[createApp from app.ts]
    D --> E[Listen on PORT default 4000]
    E --> F[Schedule auth cleanup hourly]
    F --> G[Server ready /api/v1]

    H[SIGTERM / SIGINT] --> I[Close HTTP server]
    I --> J[disconnectDatabase]
    J --> K[Exit process]
```

| Step | File | What happens |
|------|------|--------------|
| 1 | `server.ts` | Loads environment variables |
| 2 | `config/env.ts` | Zod validates all required env vars; exits if invalid |
| 3 | `lib/prisma.ts` | Connects to PostgreSQL (Neon) |
| 4 | `app.ts` | Builds Express app with middleware + routes |
| 5 | `server.ts` | Starts listening; logs port and environment |

---

## 2. Backend every HTTP request pipeline

**Every request** passes through this chain before reaching a module:

```mermaid
flowchart TD
    REQ[Incoming HTTP Request] --> HELMET[helmet - security headers]
    HELMET --> CORS[cors - check CORS_ORIGIN]
    CORS --> COMP[compression]
    COMP --> HPP[hpp - HTTP param pollution protection]
    HPP --> COOKIE[cookie-parser]
    COOKIE --> JSON[express.json + urlencoded]
    JSON --> SAN[sanitizeRequest]
    SAN --> LOG[morgan logging]
    LOG --> RATE{Path under /api/v1?}
    RATE -->|Yes| RL[apiRateLimiter]
    RATE -->|No e.g. /uploads| STATIC[Static files or health]
    RL --> ROUTER[apiRouter → v1Router → module route]
    ROUTER --> MOD[Module middleware chain]
    MOD --> CTRL[Controller]
    CTRL --> OK[sendSuccess JSON response]
    CTRL --> ERR[errorHandler]
    ERR --> RES[Error JSON response]
```

### Route mounting (`routes/v1/index.ts`)

```
/api/v1
├── /auth              → authRouter
├── /public            → publicRouter (no auth)
├── /public/ai         → aiPublicRouter
├── /projects          → projectsRouter
├── /blog              → blogRouter
├── /blog/categories   → blogCategoriesRouter
├── /media             → mediaRouter
├── /leads             → leadsRouter
├── /testimonials      → testimonialsRouter
├── /resume            → resumeRouter
├── /knowledge-base    → knowledgeBaseRouter
├── /analytics         → analyticsRouter
├── /settings          → settingsRouter
├── /tags              → tagsRouter
└── /ai                → aiAdminRouter
```

---

## 3. Backend layer pattern (all modules)

Every feature module follows the same internal flow:

```mermaid
flowchart LR
    R[Routes] --> M[Middlewares]
    M --> V[Validator Zod]
    V --> C[Controller]
    C --> S[Service]
    S --> REPO[Repository]
    REPO --> P[Prisma]
    P --> DB[(PostgreSQL)]
```

| Layer | Responsibility | Example file |
|-------|----------------|--------------|
| **Routes** | HTTP method + path + middleware stack | `projects.routes.ts` |
| **Validator** | Zod schema for body/query/params | `projects.validator.ts` |
| **Controller** | Read req, call service, format response | `projects.controller.ts` |
| **Service** | Business rules, permissions checks | `projects.service.ts` |
| **Repository** | Database queries only | `project.repository.ts` |
| **DTO** | Map DB models → API shape | `projects.dto.ts` |

### Typical admin route middleware chain

```
authorizeStrict(PERMISSIONS.XYZ)   →  authenticate + requirePermission
validateBody / validateQuery       →  Zod parse
controller.action                  →  asyncHandler wraps try/catch
```

---

## 4. Backend auth workflow

### Login

```mermaid
sequenceDiagram
    participant C as Client
    participant R as auth.routes
    participant Ctrl as auth.controller
    participant S as auth.service
    participant DB as PostgreSQL

    C->>R: POST /api/v1/auth/login {email, password}
    R->>R: authCredentialRateLimiter
    R->>R: validateBody(loginSchema)
    R->>Ctrl: login()
    Ctrl->>S: login(credentials)
    S->>DB: Find user by email + role
    S->>S: bcrypt.compare(password)
    S->>DB: Create Session + RefreshToken
    S->>S: Sign JWT access token
    Ctrl->>C: Set httpOnly cookies + { user }
```

### Authenticated request

```mermaid
flowchart TD
    A[Request with access cookie] --> B[authenticate middleware]
    B --> C[extractAccessToken from cookie/header]
    C --> D[verifyAccessToken JWT]
    D --> E[Find session by hash in DB]
    E --> F[Load user + role permissions]
    F --> G[req.user = AuthUser]
    G --> H[Next middleware / controller]
```

### Refresh token

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Axios interceptor
    participant R as POST /auth/refresh-token
    participant S as auth.service

    C->>A: API call returns 401
    A->>R: POST refresh-token (refresh cookie)
    R->>S: Rotate refresh token family
    S->>S: Issue new access + refresh cookies
    A->>C: Retry original request
```

---

## 5. Backend public content workflow

**No authentication.** Used by the public portfolio site (SSR from Next.js).

```mermaid
flowchart TD
    FE[Next.js Server Component] -->|GET /api/v1/public/...| PUB[public.routes]
    PUB --> V[validateQuery / validateParams]
    V --> PC[public.controller]
    PC --> PS[public.service]
    PS --> REPO[Various repositories]
    REPO --> DB[(PostgreSQL)]
    PS --> DTO[public.dto - map to public shape]
    DTO --> JSON[JSON response - only published data]
```

### Public endpoints

| Endpoint | Returns |
|----------|---------|
| `GET /public/site` | Site name, description, logo, social links |
| `GET /public/about` | About page sections |
| `GET /public/projects` | Published projects list |
| `GET /public/projects/:slug` | Single published project + media |
| `GET /public/blog` | Published blog posts |
| `GET /public/blog/:slug` | Single published post |
| `GET /public/testimonials` | Testimonials |
| `GET /public/resume` | Active resume PDF URL |
| `GET /public/services` | Services content |
| `GET /public/analytics/stats` | Visitor count |
| `POST /public/analytics/visit` | Record a visit |

---

## 6. Backend admin CRUD workflow (projects)

```mermaid
sequenceDiagram
    participant A as Admin UI
    participant R as projects.routes
    participant Ctrl as projects.controller
    participant S as projects.service
    participant PR as project.repository
    participant MR as media.repository
    participant DB as PostgreSQL

    A->>R: POST /api/v1/projects
    R->>R: authorizeStrict(PROJECTS_WRITE)
    R->>R: validateBody(createProjectSchema)
    R->>Ctrl: create()
    Ctrl->>S: create(input, permissions)
    S->>S: Check permissions + validate media IDs
    S->>PR: create project row
    S->>MR: attachToProject media IDs
    PR->>DB: INSERT Project
    MR->>DB: UPDATE Media.projectId
    S->>Ctrl: ProjectDto
    Ctrl->>A: 201 { success, data }
```

### Project delete (includes media cleanup)

```
DELETE /projects/:id
  → projects.service.delete()
  → projectRepository.delete()
  → For each media: deleteStoredFile() (Cloudinary or local)
  → mediaRepository.delete()
```

---

## 7. Backend media upload workflow

```mermaid
flowchart TD
    A[POST /api/v1/media/upload multipart] --> B[authenticate]
    B --> C[requireAnyPermission MEDIA/PROJECTS/BLOG write]
    C --> D[uploadSingleMedia - multer memoryStorage]
    D --> E[validateQuery uploadMediaQuerySchema]
    E --> F[media.controller.upload]
    F --> G[media.service.upload]
    G --> H{Cloudinary configured?}
    H -->|Yes| I[uploadToCloudinary buffer]
    H -->|No| J[Write to backend/uploads/]
    I --> K[mediaRepository.create url + public_id]
    J --> K
    K --> L[201 Return ProjectMediaDto]
```

| Field stored | Cloudinary | Local fallback |
|--------------|------------|----------------|
| `url` | `https://res.cloudinary.com/...` | `http://localhost:4000/uploads/uuid.jpg` |
| `filename` | Cloudinary public_id | UUID filename |
| `type` | IMAGE / VIDEO / DOCUMENT | Same |

**Resume PDF upload:** Same flow via `POST /api/v1/resume/upload` → folder `portfolio/resumes` → resource type `raw`.

---

## 8. Backend contact & leads workflow

```mermaid
sequenceDiagram
    participant U as Visitor
    participant P as POST /public/contact
    participant CS as contact.service
    participant LR as lead.repository
    participant E as Resend email
    participant DB as PostgreSQL

    U->>P: Contact form JSON
    P->>P: contactRateLimiter + validateBody
    P->>CS: submitContact()
    CS->>LR: Create Lead row status=NEW
    CS->>E: Send admin notification email
    CS->>E: Send user confirmation email
    CS->>LR: Update email sent flags
    CS->>U: 201 success message
```

### Admin lead management

```
GET  /api/v1/leads          → list/filter leads
GET  /api/v1/leads/:id      → lead detail + notes
PATCH /api/v1/leads/:id     → update status (NEW → CONTACTED → CLOSED)
POST /api/v1/leads/:id/notes → add internal note
```

---

## 9. Backend Ask Ishan AI workflow

```mermaid
flowchart TD
    A[POST /public/ai/ask] --> B[aiRateLimiter]
    B --> C[validateBody askIshanSchema]
    C --> D[ai.controller.askIshan]
    D --> E[ai.service.askIshan]
    E --> F[Load KnowledgeBase from DB by category]
    F --> G[Build system prompt with portfolio context]
    G --> H[Google Gemini API gemini-2.5-flash]
    H --> I[Save AiInteraction log]
    I --> J[Return answer JSON]
```

**Knowledge base admin:** `CRUD /api/v1/knowledge-base` — content seeded for About, Skills, Projects, FAQ, etc.

---

## 10. Backend analytics workflow

```mermaid
flowchart LR
    subgraph Public
        V[Visitor lands on site] --> T[visitor-tracker.tsx]
        T --> P[POST /public/analytics/visit]
        P --> DB[(Analytics table)]
    end

    subgraph Admin
        A[GET /analytics/overview] --> S[analytics.service]
        S --> DB
        S --> D[Stats DTO for dashboard]
    end

    subgraph Footer
        F[GET /public/analytics/stats] --> C[Visitor count display]
    end
```

---

## 11. Backend error handling

```mermaid
flowchart TD
    ERR[Error thrown] --> TYPE{Error type?}
    TYPE -->|AppError| A[Use statusCode + message]
    TYPE -->|ZodError| B[422 Validation failed + field errors]
    TYPE -->|MulterError| C[422 File too large / bad upload]
    TYPE -->|SyntaxError JSON| D[400 Invalid JSON]
    TYPE -->|Other| E[500 Log stack + message]
    A --> F[formatErrorResponse JSON]
    B --> F
    C --> F
    D --> F
    E --> F
```

**Response shape:**
```json
{ "success": false, "message": "...", "errors": { "field": ["..."] } }
```

---

# Part 2 — Frontend

## 12. Frontend app bootstrap

**Entry:** `frontend/src/app/layout.tsx`

```mermaid
flowchart TD
    A[Browser requests page] --> B[Next.js App Router]
    B --> C[layout.tsx - RootLayout]
    C --> D[generateMetadata - SEO from API]
    C --> E[AppProviders]
    E --> F[ErrorBoundary]
    F --> G[ThemeProvider - dark/light]
    G --> H[QueryProvider - React Query]
    H --> I[AuthProvider - session on load]
    I --> J[Page component renders]
    J --> K[ToastProvider]
```

---

## 13. Frontend routing & layouts

```
frontend/src/app/
├── layout.tsx              # Root: providers, fonts, global CSS
├── (main)/                 # Public portfolio layout
│   ├── layout.tsx          # Header + footer + visitor tracker
│   ├── page.tsx            # Home
│   ├── projects/
│   ├── blog/
│   ├── contact/
│   └── ask-ishan/
├── (admin)/                # Admin shell layout
│   ├── layout.tsx          # Sidebar + breadcrumbs
│   ├── dashboard/
│   ├── admin/projects/
│   ├── admin/blog/
│   ├── leads/
│   └── settings/
├── (auth)/                 # Login / register (minimal layout)
└── api/proxy/[...path]/    # Backend proxy route
```

### Middleware gate (`middleware.ts`)

```mermaid
flowchart TD
    A[Request to /admin, /dashboard, /leads, etc.] --> B{Auth cookies present?}
    B -->|No| C[Redirect to /login?next=...]
    B -->|Yes| D[Allow through - AuthProvider validates session]
```

---

## 14. Frontend API client & proxy

### Why a proxy?

Browser calls **`/api/proxy/v1/*`** (same origin on Vercel) instead of Render directly. This keeps **httpOnly auth cookies** working in production.

```mermaid
flowchart LR
    subgraph Browser
        AX[Axios api client]
    end

    subgraph Vercel
        PX["/api/proxy/v1/* route.ts"]
    end

    subgraph Render
        API["/api/v1/* Express"]
    end

    AX -->|withCredentials cookies| PX
    PX -->|forwards headers + body| API
    API --> PX
    PX --> AX
```

| Context | Base URL | Used by |
|---------|----------|---------|
| Browser (client) | `/api/proxy/v1` | Admin hooks, forms, axios |
| Server (SSR) | `NEXT_PUBLIC_API_URL` directly | `publicApi`, `generateMetadata` |

**Key files:**
- `services/api.ts` — Axios instance + 401 refresh interceptor
- `app/api/proxy/[...path]/route.ts` — forwards GET/POST/PATCH/DELETE
- `lib/public-api.ts` — server-side fetch for public pages
- `constants/api.ts` — all endpoint paths

---

## 15. Frontend public page workflow (SSR)

Example: **`/projects/my-project`**

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js Server
    participant PA as publicApi
    participant API as Render /public/projects/:slug
    participant P as page.tsx

    B->>N: GET /projects/my-project
    N->>P: ProjectDetailPage (Server Component)
    P->>PA: getProject(slug)
    PA->>API: fetch SERVER_API_URL/public/projects/slug
    API->>PA: JSON project data
    PA->>P: PublicProject typed data
    P->>P: resolveMediaUrl for Cloudinary images
    P->>P: Render HTML + JSON-LD
    P->>B: Full HTML response SEO-ready
```

### Public data fetching pattern

```typescript
// Server Component (runs on Vercel at request time)
const project = await publicApi.getProject(slug);
return <article>...</article>;
```

- Revalidates every 60 seconds (`revalidate: 60` in publicApi)
- Images via `MediaImage` component (Cloudinary-safe)

---

## 16. Frontend admin page workflow (CSR)

Example: **`/admin/projects`** list + edit

```mermaid
flowchart TD
    A[Admin page - Client Component] --> B[useProjects hook]
    B --> C[React Query useQuery]
    C --> D[projects.service.list]
    D --> E[axios GET /api/proxy/v1/projects]
    E --> F[Proxy → Render]
    F --> G[JSON paginated list]
    G --> H[Render ProjectsTable]

    I[User clicks Edit] --> J[Navigate to /admin/projects/id/edit]
    J --> K[ProjectForm + React Hook Form]
    K --> L[useMutation on submit]
    L --> M[PATCH /api/proxy/v1/projects/id]
```

### Admin feature file flow

```
page.tsx (thin)
  └── FeatureView component
        ├── hooks/use-projects.ts      (React Query)
        ├── services/projects.service.ts (API calls)
        ├── schemas/project.schemas.ts (Zod)
        └── components/project-form.tsx (UI + form)
```

---

## 17. Frontend auth workflow

```mermaid
sequenceDiagram
    participant U as User
    participant L as /login page
    participant AP as AuthProvider
    participant AX as auth.service
    participant API as POST /auth/login

    U->>L: Submit email + password
    L->>AP: login(payload)
    AP->>AX: authService.login()
    AX->>API: via proxy
    API->>AX: Set cookies + user JSON
    AX->>AP: setUser in Zustand store
    AP->>U: Redirect to /dashboard

    Note over AP: On app load refreshSession calls GET /auth/me
```

**Permission checks in UI:**
```typescript
const { hasPermission } = useAuth();
if (hasPermission('projects:write')) { /* show edit button */ }
```

---

## 18. Frontend form + mutation workflow

Standard pattern for admin create/update:

```mermaid
flowchart TD
    A[User fills form] --> B[React Hook Form + Zod resolver]
    B --> C[Submit handler]
    C --> D[useMutation mutationFn]
    D --> E[feature.service.create/update]
    E --> F[axios POST/PATCH via proxy]
    F --> G{Success?}
    G -->|Yes| H[toast.success + invalidateQueries + redirect]
    G -->|No| I[toast.error getErrorMessage]
```

---

## 19. Frontend media upload workflow

```mermaid
sequenceDiagram
    participant U as Admin user
    participant F as ImageUploadField
    participant MS as mediaService.upload
    participant PX as /api/proxy/v1/media/upload
    participant BE as media.service + Cloudinary
    participant UI as Preview update

    U->>F: Choose file
    F->>MS: FormData with file
    MS->>PX: POST multipart
    PX->>BE: Forward binary body
    BE->>BE: Upload to Cloudinary
    BE->>MS: { url, id, mimeType }
    MS->>F: ProjectMedia object
    F->>UI: MediaImage shows Cloudinary URL
    F->>U: onChange(media) updates form state
```

On project save → form sends `thumbnailMediaId` + `galleryMediaIds` → backend links media to project.

---

# Part 3 — End-to-end journey maps

## Journey 1: Visitor reads a blog post

```
1. Browser → Vercel GET /blog/my-slug
2. Next.js Server → publicApi.getBlogPost(slug)
3. Render GET /api/v1/public/blog/my-slug
4. public.service → blogRepository.findBySlug (published only)
5. HTML rendered with title, content, featured image
6. Browser loads Cloudinary image URL
7. visitor-tracker records POST /public/analytics/visit
```

## Journey 2: Admin publishes a new project

```
1. Login → cookies set via proxy
2. /admin/projects/new → ProjectForm
3. Upload thumbnail → POST /media/upload → Cloudinary URL returned
4. Upload gallery images → same flow
5. Submit form → POST /projects with media IDs
6. projects.service creates Project + links Media
7. Set status PUBLISHED → PATCH /projects/:id/status
8. Public site → GET /public/projects shows new project (SSR)
```

## Journey 3: Visitor submits contact form

```
1. /contact page → ContactForm (client)
2. POST /api/proxy/v1/public/contact
3. contact.service → Lead in DB + Resend emails
4. Admin sees lead at /leads pipeline
5. Admin updates status + adds notes
```

## Journey 4: Ask Ishan AI question

```
1. /ask-ishan page → chat UI
2. POST /api/proxy/v1/public/ai/ask { message }
3. ai.service loads KnowledgeBase from DB
4. Gemini generates answer with portfolio context
5. AiInteraction logged
6. Answer displayed in chat
```

---

## Quick reference: which file to open

| I want to understand… | Backend | Frontend |
|----------------------|---------|----------|
| Server boot | `server.ts`, `app.ts` | `app/layout.tsx` |
| Route list | `routes/v1/index.ts` | `app/**/page.tsx` |
| Auth | `modules/auth/` | `features/auth/` |
| Public API | `modules/public/` | `lib/public-api.ts` |
| Projects | `modules/projects/` | `features/projects/` |
| Blog | `modules/blog/` | `features/blog/` |
| Uploads | `modules/media/`, `lib/cloudinary.ts` | `image-upload-field.tsx` |
| DB schema | `prisma/schema.prisma` | — |
| Proxy | — | `app/api/proxy/[...path]/route.ts` |
| SEO | — | `lib/seo/` |

---

*See also: [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for tech stack and schema details.*
