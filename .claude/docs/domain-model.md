# Domain Model

> Distilled from the Notion Domain Model page. Source: https://www.notion.so/321fcd29ea34817fbb25cd1914cad856

## Entity Relationship

```
Org (tenant)
├── User (many, staff only)
│   └── SiteMembership → Site + Role (many)
├── Site (many, usually 1)
│   ├── BrandConfig (1:1, isGlobal)
│   ├── Product (many, draft/publish)
│   ├── Page (many, draft/publish)
│   ├── Media (many, per-site)
│   └── Customer (many)
└── ServiceRequest (many)
    └── optionally scoped to Site
```

## Platform Layer (universal)

### Org (tenant)
Top-level container. Maps to a Payload tenant and an Auth0 organization.
- Plan, billing status, provisioning state
- Owns one or more Sites and Users
- Resolved by hostname at runtime

### User (staff only)
Belongs to exactly one Org. Accesses the dashboard. Auth0 staff connection.
- Access granted per-Site via SiteMembership
- Roles: Owner (org-level), Manager (multi-site), Worker (site-scoped)
- Owner has implicit access — no SiteMembership needed

### SiteMembership
Join entity: User + Site + Role.
- A User can have different roles on different Sites

### Site
A storefront. Belongs to an Org.
- Domain (subdomain or custom), status, theme variant
- Has its own BrandConfig, Pages, Products, Media
- 1:1 with Org for most clients, supports 1:many

## Tenant Layer (per-site data)

### Product
- Typed core fields: name, description, price, status, images, slug
- Configurable `customAttributes` per vertical (glass art: medium, artist; candles: scent, burnTime)
- Status lifecycle: draft -> active -> sold -> archived (owner-configurable)
- Draft/publish enabled

### Page
- Title, slug, content blocks, SEO metadata
- Draft/publish enabled

### Media
- Images and files, strictly per-Site
- Used by Products, Pages, BrandConfig

### BrandConfig
- `isGlobal: true` — singleton per tenant
- Colors, logo, typography, favicon, site title, metadata
- Drives white-label theming — same platform, different look

### Customer (deferred for MVP)
- End user of storefront, separate Auth0 connection
- Per-Site accounts, not shared across Sites

### ServiceRequest (deferred for MVP)
- Change request: type, tier (low/high), status, outcome
- Low tier -> Payload draft. High tier -> human via codebase PR

## Payload Collection Mapping

| Entity | Collection | Tenant-Scoped | Draft/Publish |
|--------|-----------|---------------|---------------|
| Org | `tenants` | No (IS the tenant) | No |
| User | `users` | No (global) | No |
| Site | `sites` | Yes | No |
| SiteMembership | `site-memberships` | Yes | No |
| Product | `products` | Yes (per-Site) | Yes |
| Page | `pages` | Yes (per-Site) | Yes |
| Media | `media` | Yes (per-Site) | No |
| BrandConfig | `brand-configs` | Yes (isGlobal) | No |
| Customer | `customers` | Yes (per-Site) | No |
| ServiceRequest | `service-requests` | Yes | No |

## Auth Model

- **Staff** (Owner, Manager, Worker) -> staff Auth0 connection -> dashboard
- **Customer** -> customer Auth0 connection -> storefront (deferred)
- Completely separate user pools, login flows, and sessions

## Access Control

Centralized in `packages/payload/src/access.ts`:
- `isAuthenticated` — any logged-in user
- `isSuperAdmin` — matches `SUPER_ADMIN_EMAIL` env var

All collections explicitly declare access rules.
