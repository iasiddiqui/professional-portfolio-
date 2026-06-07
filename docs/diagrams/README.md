# Diagrams

Visual architecture diagrams for the portfolio platform.

## Main diagram file

**[system-diagrams.md](./system-diagrams.md)** — 13 Mermaid diagrams:

1. System overview
2. Deployment topology (Vercel + Render + Neon + Cloudinary)
3. Backend request pipeline
4. Backend module map (all `/api/v1` routes)
5. Layered architecture (Routes → Service → Repository)
6. Database ERD
7. Frontend App Router structure
8. SSR vs client data fetching
9. Authentication sequence
10. Media upload (Cloudinary)
11. Public blog page flow
12. Contact → leads pipeline
13. Ask Ishan AI flow

## How to view

- **GitHub** — diagrams render in markdown automatically
- **Cursor / VS Code** — open `system-diagrams.md` → Markdown preview
- **Export** — copy any diagram to [mermaid.live](https://mermaid.live) → PNG/SVG

## Related docs

- [WORKFLOW.md](../WORKFLOW.md) — step-by-step text workflows
- [PROJECT_GUIDE.md](../PROJECT_GUIDE.md) — tech stack and schema reference
- [database/erd.md](../database/erd.md) — detailed ERD notes

## Formats

| Format | Use case |
| ------ | -------- |
| Mermaid (`.md`) | Version-controlled, renders in GitHub |
| PNG / SVG | Presentations — export from mermaid.live |
| Excalidraw | Collaborative whiteboarding |
