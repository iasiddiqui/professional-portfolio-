# System Diagrams

Visual architecture for the Professional Portfolio platform.  
These diagrams render on GitHub and in VS Code/Cursor markdown preview.

Related: [WORKFLOW.md](../WORKFLOW.md) | [PROJECT_GUIDE.md](../PROJECT_GUIDE.md)

---

## 1. System overview (high level)

```mermaid
flowchart TB
    subgraph Users
        V[Visitor]
        A[Admin]
    end

    subgraph Vercel["Vercel — Frontend"]
        NEXT[Next.js 15 App]
        PROXY["/api/proxy/v1/*"]
        NEXT --> PROXY
    end

    subgraph Render["Render — Backend"]
        EXP[Express 5 API]
        MOD[Feature Modules]
        EXP --> MOD
    end

    subgraph Data["Data & Services"]
        NEON[(Neon PostgreSQL)]
        CLD[Cloudinary CDN]
        GEM[Google Gemini]
        RES[Resend Email]
    end

    V -->|Browse SSR pages| NEXT
    A -->|Admin dashboard| NEXT
    PROXY -->|REST + cookies| EXP
    MOD -->|Prisma ORM| NEON
    MOD -->|Upload media| CLD
    MOD -->|Ask Ishan AI| GEM
    MOD -->|Contact emails| RES
    V -->|Load images| CLD
    A -->|Load images| CLD
```

---

## 2. Deployment topology

```mermaid
flowchart LR
    subgraph Internet
        USER[Browser]
    end

    subgraph Vercel
        FE["professional-portfolio-eta-orcin.vercel.app"]
    end

    subgraph Render
        BE["professional-portfolio-bhvq.onrender.com/api/v1"]
    end

    subgraph Neon
        DB[(PostgreSQL)]
    end

    subgraph Cloudinary
        CDN["res.cloudinary.com/dg402dydx"]
    end

    USER --> FE
    FE -->|SSR fetch public API| BE
    FE -->|Proxy admin API| BE
    BE --> DB
    BE --> CDN
    USER -->|Image/video URLs| CDN
```

---

## 3. Backend — request pipeline

```mermaid
flowchart TD
    REQ[HTTP Request] --> H[Helmet]
    H --> CORS[CORS]
    CORS --> CP[Cookie Parser]
    CP --> BODY[JSON / URL-encoded]
    BODY --> SAN[Sanitize]
    SAN --> RL[Rate Limiter]
    RL --> RT{Route type}

    RT -->|/api/v1/public/*| PUB[Public Controller]
    RT -->|/api/v1/auth/*| AUTH[Auth Controller]
    RT -->|/api/v1/* admin| ADM[Admin Controller]

    PUB --> SVC[Service Layer]
    AUTH --> SVC
    ADM --> SVC

    SVC --> REPO[Repository]
    REPO --> PRISMA[Prisma]
    PRISMA --> PG[(PostgreSQL)]

    SVC --> EXT{External?}
    EXT -->|Upload| CLD[Cloudinary]
    EXT -->|AI| GEM[Gemini]
    EXT -->|Email| RES[Resend]

    SVC --> RES_OK[JSON Response success]
    SVC --> ERR[Error Handler]
    ERR --> RES_ERR[JSON Response error]
```

---

## 4. Backend — module map

```mermaid
flowchart TB
    API["/api/v1"]

    API --> AUTH["/auth\nlogin, refresh, me"]
    API --> PUB["/public\nsite, projects, blog"]
    API --> PROJ["/projects\nadmin CRUD"]
    API --> BLOG["/blog\nadmin CRUD"]
    API --> MEDIA["/media\nupload, delete"]
    API --> LEADS["/leads\nCRM pipeline"]
    API --> TEST["/testimonials"]
    API --> RESUME["/resume\nPDF upload"]
    API --> KB["/knowledge-base\nAI content"]
    API --> AI_P["/public/ai/ask"]
    API --> AI_A["/ai/interactions"]
    API --> ANAL["/analytics"]
    API --> SET["/settings"]
    API --> TAGS["/tags"]

    AUTH --> DB[(PostgreSQL)]
    PUB --> DB
    PROJ --> DB
    PROJ --> CLD[Cloudinary]
    BLOG --> DB
    MEDIA --> CLD
    LEADS --> DB
    LEADS --> RES[Resend]
    RESUME --> CLD
    KB --> DB
    AI_P --> GEM[Gemini]
    AI_P --> DB
    ANAL --> DB
    SET --> DB
```

---

## 5. Backend — layered architecture (per module)

```mermaid
flowchart LR
    subgraph HTTP
        R[Routes]
        M[Middleware\nauth, validate, upload]
        C[Controller]
    end

    subgraph Business
        S[Service\nrules + permissions]
        D[DTO Mapper]
    end

    subgraph Data
        REPO[Repository]
        P[Prisma Client]
        DB[(PostgreSQL)]
    end

    R --> M --> C --> S --> REPO --> P --> DB
    S --> D
    D --> C
```

---

## 6. Database — entity relationships

```mermaid
erDiagram
    User ||--o{ BlogPost : writes
    User ||--o{ LeadNote : writes
    User }o--|| Role : has

    Role {
        string id PK
        enum name
        json permissions
    }

    Project ||--o{ Media : has
    Project }o--o| ProjectCategory : in
    Project ||--o{ ProjectTag : tagged

    BlogPost ||--o{ Media : has
    BlogPost }o--o| BlogCategory : in
    BlogPost ||--o{ BlogPostTag : tagged

    Tag ||--o{ ProjectTag : used
    Tag ||--o{ BlogPostTag : used

    Lead ||--o{ LeadNote : has

    Project {
        string id PK
        string slug UK
        enum status
        boolean featured
    }

    BlogPost {
        string id PK
        string slug UK
        boolean published
    }

    Media {
        string id PK
        string url
        enum type
    }

    Lead {
        string id PK
        enum status
        enum source
    }

    SiteSettings {
        string id PK
        json emailTemplates
    }

    KnowledgeBase {
        string id PK
        string category
    }

    AiInteraction {
        string id PK
        enum feature
    }

    Analytics {
        string id PK
        enum type
    }
```

---

## 7. Frontend — app structure

```mermaid
flowchart TB
    subgraph App Router
        ROOT[layout.tsx\nProviders]
        MAIN["(main) Public Site"]
        ADMIN["(admin) Dashboard"]
        AUTH_R["(auth) Login"]
        API_R["api/proxy"]
    end

    ROOT --> MAIN
    ROOT --> ADMIN
    ROOT --> AUTH_R
    ROOT --> API_R

    subgraph Main Pages
        HOME[Home]
        PROJ[Projects]
        BLOG[Blog]
        CONTACT[Contact]
        AI[Ask Ishan]
    end

    subgraph Admin Pages
        DASH[Dashboard]
        AP[Admin Projects]
        AB[Admin Blog]
        AL[Leads]
        AN[Analytics]
        AS[Settings]
    end

    MAIN --> HOME & PROJ & BLOG & CONTACT & AI
    ADMIN --> DASH & AP & AB & AL & AN & AS
```

---

## 8. Frontend — data fetching modes

```mermaid
flowchart TD
    subgraph Public Pages["Public pages — Server Components"]
        SSR[page.tsx on Vercel server]
        PAPI[publicApi.ts]
        DIRECT["fetch NEXT_PUBLIC_API_URL\n/public/*"]
        SSR --> PAPI --> DIRECT
    end

    subgraph Admin Pages["Admin pages — Client Components"]
        CSR[React components]
        RQ[React Query hooks]
        AX[Axios api.ts]
        PROXY["/api/proxy/v1/*"]
        CSR --> RQ --> AX --> PROXY
    end

    PROXY --> BE[Render Backend]
    DIRECT --> BE
```

---

## 9. Authentication sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Next.js Frontend
    participant PX as API Proxy
    participant BE as Express Backend
    participant DB as PostgreSQL

    U->>FE: Enter email + password
    FE->>PX: POST /auth/login
    PX->>BE: Forward request
    BE->>DB: Verify user + bcrypt password
    BE->>DB: Create Session + RefreshToken
    BE->>PX: Set httpOnly cookies + user JSON
    PX->>FE: Cookies stored on Vercel domain
    FE->>U: Redirect to /dashboard

    Note over FE,BE: Later API calls
    FE->>PX: GET /projects (with cookies)
    PX->>BE: Forward with Cookie header
    BE->>BE: authenticate → verify JWT + session
    BE->>FE: Protected data

    Note over FE,BE: Token expired
    FE->>PX: GET /projects → 401
    FE->>PX: POST /auth/refresh-token
    BE->>FE: New cookies
    FE->>PX: Retry GET /projects → 200
```

---

## 10. Media upload flow (end-to-end)

```mermaid
sequenceDiagram
    autonumber
    participant U as Admin
    participant UI as ImageUploadField
    participant PX as API Proxy
    participant BE as media.service
    participant CLD as Cloudinary
    participant DB as PostgreSQL

    U->>UI: Select image file
    UI->>PX: POST /media/upload FormData
    PX->>BE: Forward multipart body
    BE->>BE: multer → memory buffer
    BE->>CLD: upload base64 image
    CLD->>BE: secure_url + public_id
    BE->>DB: INSERT Media row
    BE->>UI: { id, url, mimeType }
    UI->>U: Show Cloudinary preview

    Note over U,DB: On project save
    U->>UI: Submit project form
    UI->>PX: POST /projects { thumbnailMediaId, galleryMediaIds }
    BE->>DB: Link Media → Project
```

---

## 11. Public blog page flow

```mermaid
sequenceDiagram
    autonumber
    participant V as Visitor
    participant VCL as Vercel Next.js
    participant BE as Render API
    participant DB as PostgreSQL
    participant CLD as Cloudinary

    V->>VCL: GET /blog/my-post
    VCL->>BE: GET /public/blog/my-post
    BE->>DB: findBySlug published=true
    DB->>BE: BlogPost + author + tags
    BE->>VCL: JSON post data
    VCL->>VCL: Render HTML + SEO metadata
    VCL->>V: Page HTML
    V->>CLD: Load featured image CDN URL
```

---

## 12. Contact form → lead pipeline

```mermaid
flowchart LR
    A[Visitor fills /contact] --> B[POST /public/contact]
    B --> C[contact.service]
    C --> D[(Lead table NEW)]
    C --> E[Resend admin email]
    C --> F[Resend confirmation email]
    D --> G[Admin /leads pipeline]
    G --> H[Update status]
    G --> I[Add LeadNote]
```

---

## 13. Ask Ishan AI flow

```mermaid
flowchart TD
    Q[User question on /ask-ishan] --> API[POST /public/ai/ask]
    API --> RL[Rate limiter]
    RL --> SVC[ai.service]
    SVC --> KB[(KnowledgeBase DB)]
    SVC --> PROMPT[Build system prompt\nAbout, Skills, Projects, FAQ]
    PROMPT --> GEM[Google Gemini 2.5 Flash]
    GEM --> LOG[(AiInteraction log)]
    GEM --> ANS[Return answer to UI]
```

---

## How to view these diagrams

| Tool | How |
|------|-----|
| **GitHub** | Open this file — Mermaid renders automatically |
| **VS Code / Cursor** | Markdown preview (`Ctrl+Shift+V`) |
| **Mermaid Live** | Copy a diagram block to [mermaid.live](https://mermaid.live) |
| **Export PNG/SVG** | Paste into mermaid.live → Export |

---

## Diagram index

| # | Diagram | Purpose |
|---|---------|---------|
| 1 | System overview | Explain whole platform in one picture |
| 2 | Deployment | Vercel + Render + Neon + Cloudinary |
| 3 | Request pipeline | Every backend middleware step |
| 4 | Module map | All API route groups |
| 5 | Layered architecture | Routes → Service → Repository |
| 6 | Database ERD | Tables and relationships |
| 7 | Frontend structure | App Router route groups |
| 8 | Data fetching | SSR vs client/proxy |
| 9 | Auth sequence | Login, cookies, refresh |
| 10 | Media upload | Cloudinary end-to-end |
| 11 | Blog page | Public SSR flow |
| 12 | Contact/leads | CRM pipeline |
| 13 | Ask Ishan AI | Gemini + knowledge base |
