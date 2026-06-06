# Database Design

## Technology

- **Engine:** PostgreSQL 16
- **ORM:** Prisma 6
- **Schema:** `backend/prisma/schema.prisma`

## Entity Overview

| Model | Purpose |
| ----- | ------- |
| `Role` | RBAC roles (ADMIN, EDITOR, USER) with JSON permissions |
| `User` | Platform users with hashed passwords |
| `Session` | Active login sessions |
| `RefreshToken` | JWT refresh tokens with rotation family tracking |
| `Project` | Portfolio projects with tech stack and status |
| `ProjectCategory` | Project categorization |
| `CaseStudy` | Detailed project case studies |
| `BlogPost` | Blog content with SEO fields |
| `BlogCategory` | Blog categorization |
| `Tag` | Shared tags for projects and blog posts |
| `Lead` | Inbound contact / project inquiries |
| `Testimonial` | Client testimonials |
| `Resume` | Resume file versions |
| `KnowledgeBase` | AI knowledge base entries (Gemini) |
| `Media` | Images, documents, and assets |
| `Analytics` | Event-based analytics tracking |
| `SiteSettings` | Global site configuration singleton |

## Relationships

See [ERD](./erd.md) for the full relationship diagram.

## Auth Data Model

```
Role 1──* User
User 1──* Session
User 1──* RefreshToken
User 1──* BlogPost (author)
```

## Content Relationships

```
ProjectCategory 1──* Project
Project 1──0..1 CaseStudy
Project *──* Tag (via ProjectTag)
BlogCategory 1──* BlogPost
BlogPost *──* Tag (via BlogPostTag)
Project / CaseStudy / BlogPost 1──* Media
```

## Naming Conventions

- Primary keys: `cuid()`
- Timestamps: `createdAt`, `updatedAt` on mutable entities
- Slugs: unique indexed strings for SEO-friendly URLs
- Soft deletes: not used at this stage; hard delete with cascades on auth relations

## Related

- [ERD](./erd.md)
- [Migrations](./migrations.md)
- [Auth Architecture](../architecture/auth-architecture.md)
