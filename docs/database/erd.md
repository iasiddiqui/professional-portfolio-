# Entity Relationship Diagram

```mermaid
erDiagram
    Role ||--o{ User : assigns
    User ||--o{ Session : has
    User ||--o{ RefreshToken : has
    User ||--o{ BlogPost : authors

    ProjectCategory ||--o{ Project : categorizes
    Project ||--o| CaseStudy : details
    Project ||--o{ Media : assets
    Project }o--o{ Tag : tagged

    BlogCategory ||--o{ BlogPost : categorizes
    BlogPost }o--o{ Tag : tagged
    BlogPost ||--o{ Media : assets

    CaseStudy ||--o{ Media : assets

    Role {
        string id PK
        enum name UK
        json permissions
    }

    User {
        string id PK
        string email UK
        string password
        string roleId FK
        boolean isActive
    }

    Session {
        string id PK
        string userId FK
        string tokenHash UK
        datetime expiresAt
    }

    RefreshToken {
        string id PK
        string userId FK
        string tokenHash UK
        string familyId
        datetime expiresAt
        datetime revokedAt
    }

    Project {
        string id PK
        string slug UK
        enum status
        boolean featured
    }

    Lead {
        string id PK
        enum status
        string email
    }

    Analytics {
        string id PK
        enum type
        string path
    }
```

## Enums

| Enum | Values |
| ---- | ------ |
| `RoleName` | ADMIN, EDITOR, USER |
| `ProjectStatus` | DRAFT, PUBLISHED, ARCHIVED |
| `LeadStatus` | NEW, CONTACTED, IN_PROGRESS, CLOSED |
| `MediaType` | IMAGE, DOCUMENT, VIDEO, OTHER |
| `AnalyticsEventType` | VISIT, PAGE_VIEW, CONTACT_REQUEST, DOWNLOAD |
