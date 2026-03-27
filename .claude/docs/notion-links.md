# Notion Quick Reference

## Workspace Pages

| Page | URL |
|------|-----|
| HQ (root) | https://www.notion.so/320fcd29ea348065bac6e182a997afc6 |
| Strategy | https://www.notion.so/320fcd29ea3481058ddcc40776c4026f |
| Project Brief | https://www.notion.so/320fcd29ea348029ad8ccfa4cec7d044 |
| Architecture | https://www.notion.so/320fcd29ea3481949585e871144c8334 |
| Domain Model | https://www.notion.so/321fcd29ea34817fbb25cd1914cad856 |
| Decisions Log | https://www.notion.so/320fcd29ea3481ee88c7ef97ef7d5528 |
| Roadmap | https://www.notion.so/320fcd29ea3481ab9238d07b5e39ceab |
| Tech (hub) | https://www.notion.so/321fcd29ea348194b6c4e5e17bb72c55 |
| AI OS | https://www.notion.so/330fcd29ea3481688ae7ec4b9b9297a9 |
| Quality | https://www.notion.so/330fcd29ea348125ac3cc40e462e5294 |
| Clients | https://www.notion.so/330fcd29ea34816396a4c1d4d13ebcd8 |

## Project Board

| Field | Value |
|-------|-------|
| Database URL | https://www.notion.so/7be2c45841954399b92ced74a494e3c8 |
| Data Source ID | `collection://c2294908-28ff-4da9-9fee-5b45061427b5` |
| Todo List Data Source | `collection://320fcd29-ea34-80f9-b318-000b945bc908` |

## Board Schema

- **Status:** Backlog, To Do, In Progress, Review, Done, Blocked
- **Phase:** Foundation, Storefront, Dashboard, Service Layer, AI Layer, SEO
- **Priority:** P0 - Critical, P1 - High, P2 - Medium, P3 - Low
- **Size:** XS, S, M, L, XL
- **Type:** Epic, Story, Task, Spike, Bug
- **Vertical Slice:** Product Catalog, Inventory Dashboard, Storefront Shell, Brand Config, Auth & Orgs, Service Request, AI Layer, Infrastructure
- **Ticket ID:** Auto-increment, prefix PLT-

## Key Ticket IDs (for direct fetch)

| Ticket | Page ID | Status |
|--------|---------|--------|
| PLT-14: Payload CMS setup | `326fcd29-ea34-816c-a5c6-dbba57f33ba2` | Done |
| PLT-20: Auth0 tenant setup | `326fcd29-ea34-81a1-ac94-d0281e36fd50` | Review |
| PLT-103: CI pipeline | `32bfcd29-ea34-8195-8b51-de392d2d564f` | Done |
| PLT-114: Seed script | `32bfcd29-ea34-81f5-af9d-d29dfdf8cc28` | Done |
| PLT-154: Access control audit | `32bfcd29-ea34-816e-8312-e4201e79d645` | Done |

## API Notes

- `view://` URLs CANNOT be fetched — use notion-search on data source or fetch pages by ID
- notion-search is semantic, not property-filtered — fetch pages individually to check Status/Phase
- The data source for the main board is `collection://c2294908-28ff-4da9-9fee-5b45061427b5`
