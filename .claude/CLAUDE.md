# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Grove** is an AI-powered multi-tenant SaaS platform for specialty retail and boutique makers. Organizations get a branded marketing site, staff dashboard, and an AI-powered service request system that handles content changes in plain language with automatic deployment and rollback.

**Core architecture:** One repo, one Vercel deployment, one Payload instance. Tenant resolved at runtime by hostname. No forks.

## Notion Workspace

| Page | Link |
|------|------|
| HQ (root) | https://www.notion.so/320fcd29ea348065bac6e182a997afc6 |
| Strategy | https://www.notion.so/320fcd29ea3481058ddcc40776c4026f |
| Project Brief | https://www.notion.so/320fcd29ea348029ad8ccfa4cec7d044 |
| Architecture | https://www.notion.so/320fcd29ea3481949585e871144c8334 |
| Domain Model | https://www.notion.so/321fcd29ea34817fbb25cd1914cad856 |
| Decisions Log | https://www.notion.so/320fcd29ea3481ee88c7ef97ef7d5528 |
| Roadmap | https://www.notion.so/320fcd29ea3481ab9238d07b5e39ceab |
| Tech (hub) | https://www.notion.so/321fcd29ea348194b6c4e5e17bb72c55 |
| **Project Board** | https://www.notion.so/7be2c45841954399b92ced74a494e3c8 |

## Commands

All commands run from the repo root via Turborepo unless noted.

```bash
pnpm dev              # Start all apps (web:3000, dashboard:3001, cms:3002)
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm check-types      # Type-check all packages
pnpm test             # Run all tests
pnpm test:coverage    # Run tests with coverage report
pnpm generate:types   # Generate Payload TypeScript types into @grove/types
```

### Running tests in a specific package

```bash
cd packages/ui && pnpm test            # React component tests only
cd packages/payload && pnpm test       # Collection/access control tests only
cd packages/ui && pnpm test:watch      # Watch mode

# Run a single test file
cd packages/payload && pnpm test collections/products.test.ts
```

### Database (required for CMS)

```bash
docker-compose up -d   # Start PostgreSQL 16
```

## Architecture

**Monorepo** managed with Turborepo and pnpm workspaces.

```
apps/
  web/          # Marketing site + storefront (Next.js, port 3000)
  dashboard/    # Staff dashboard (Next.js, port 3001)
  cms/          # Payload CMS admin (Next.js, port 3002)
packages/
  payload/      # Payload collection definitions, access control, seed data
  ui/           # Shared React component library (Radix UI + Tailwind)
  types/        # Auto-generated Payload TypeScript types (versioned in git)
  config/       # Shared tsconfig, eslint, tailwind, and test setup
```

### Multi-Tenancy

Uses `@payloadcms/plugin-multi-tenant` which auto-scopes all queries by tenant at the Payload CMS level. Collections are either:
- **Global** (not scoped): `tenants`, `users`
- **Tenant-scoped**: all others (sites, products, pages, customers, media, service-requests, etc.)

### Domain Model

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

### Staff Roles

| Role | Scope | Description |
|------|-------|-------------|
| Owner | Org-level | Sees everything, manages billing, acts across all Sites |
| Manager | Multi-site | Assigned to specific Sites. Manages workers, approves changes |
| Worker | Site-scoped | Assigned to one or more Sites. Day-to-day operations |

### Access Control

Centralized in `packages/payload/src/access.ts`:
- `isAuthenticated` — any logged-in user
- `isSuperAdmin` — users matching the `SUPER_ADMIN_EMAIL` env var

Every collection explicitly declares its access rules using these helpers.

### Type Generation

Payload CMS auto-generates TypeScript types. The output is `packages/types/src/payload-types.ts` (committed to git). Run `pnpm generate:types` after modifying collection schemas.

### Draft/Publish Pattern

`products` and `pages` collections support Payload's versioning (draft/publish). Service requests validate drafts before publishing and support rollback via Payload's version history.

### Testing

**Coverage requirement: 100% function and line coverage** (enforced by Vitest thresholds).

- `packages/ui` — Vitest + jsdom + React Testing Library
- `packages/payload` — Vitest + Node environment

## Stack

| Layer | Service | Purpose |
|-------|---------|---------|
| Auth | Auth0 | Two connections: staff (dashboard) + customer (storefront). Org-based isolation |
| CMS + Backend | Payload CMS 3 | Multi-tenant plugin, REST/GraphQL, draft/publish, versioning |
| Backend Hosting | Railway | Single Payload instance serving all tenants |
| Frontend Hosting | Vercel | Single deployment. Middleware resolves tenant from hostname |
| Build | Turborepo 2 | Monorepo orchestration and task caching |
| Testing | Vitest 4.1 + v8 | Unit/integration tests, 100% coverage enforced |

## Key Environment Variables

```
DATABASE_URL=postgresql://grove:grove_dev_password@localhost:5432/grove_dev
PAYLOAD_SECRET=your-secret-here
SUPER_ADMIN_EMAIL=admin@example.com
```

## Key Decisions

- **No forks** — single codebase, Payload multi-tenant plugin, runtime tenant resolution
- **Payload CMS** over Sanity — TypeScript-native, no vendor dependency, no per-seat costs
- **Auth0 Organizations** — org-based auth is exactly what it's built for
- **Draft/publish for content** — Payload native versioning replaces PR-based staging
- **Manual service requests first** — build AI layer after real patterns emerge
- **100% test coverage** — all code must have 100% function and line coverage
