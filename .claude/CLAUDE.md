# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Grove** is a white-label multi-tenant SaaS platform for specialty retail and boutique makers. Organizations get a branded marketing site and staff dashboard, powered by Payload CMS.

**Core architecture:** One repo, one Vercel deployment, one Payload instance. Tenant resolved at runtime by hostname. No forks.

## Current Focus: MVP

**Goal:** Get one client live with a working storefront.

We are NOT building the AI layer, service request system, payment processing, or chatbot yet. Those come after real usage patterns emerge from a live client. See `.claude/docs/mvp.md` for the full scope.

**What exists today:**
- Payload CMS with multi-tenant plugin and all collections defined + tested
- 10 UI primitives (Button, Card, Input, etc.) in packages/ui
- Auth0 Terraform infrastructure (in review)
- CI pipeline (GitHub Actions)
- Scaffolded Next.js apps (web, dashboard, cms) — mostly empty

**What's next:**
1. Hostname-based tenant resolution middleware in apps/web
2. Marketing site rendering products/pages from Payload by tenant
3. Staff auth flow (Auth0 login -> dashboard)
4. BrandConfig-driven theming (colors, logo, typography per tenant)
5. Seed data from first client's Excel files
6. Deploy to Vercel + Railway

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

### Per-package testing

```bash
cd packages/ui && pnpm test            # React component tests
cd packages/payload && pnpm test       # Collection/access control tests
cd packages/payload && pnpm test collections/products.test.ts  # Single file
```

### Database

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
  payload/      # Collection definitions, access control, seed data
  ui/           # Shared React components (Radix UI + Tailwind)
  types/        # Auto-generated Payload TypeScript types (committed)
  config/       # Shared tsconfig, eslint, tailwind, and test setup
```

### Key source files

- `packages/payload/src/access.ts` — Centralized access control helpers
- `packages/payload/src/collections/` — All Payload collection definitions + tests
- `packages/payload/src/seed.ts` — Dev seed script
- `packages/payload/src/index.ts` — Payload config with multi-tenant plugin
- `packages/ui/src/components/` — UI primitives
- `packages/ui/src/lib/utils.ts` — cn() utility
- `packages/types/src/payload-types.ts` — Auto-generated types

### Multi-Tenancy

Uses `@payloadcms/plugin-multi-tenant`:
- **Global** (not scoped): `tenants`, `users`
- **Tenant-scoped**: `sites`, `brand-configs`, `products`, `pages`, `media`, `customers`, `site-memberships`, `service-requests`

### Domain Model (MVP subset)

```
Org (tenant)
├── User (many, staff only)
│   └── SiteMembership → Site + Role
├── Site (many, usually 1)
│   ├── BrandConfig (1:1, isGlobal)
│   ├── Product (many, draft/publish)
│   ├── Page (many, draft/publish)
│   └── Media (many, per-site)
```

### Staff Roles

| Role | Scope | Description |
|------|-------|-------------|
| Owner | Org-level | Sees everything, manages billing |
| Manager | Multi-site | Manages workers, approves changes |
| Worker | Site-scoped | Day-to-day operations |

### Testing

**100% function and line coverage** enforced by Vitest thresholds.

## Stack

| Layer | Service |
|-------|---------|
| Auth | Auth0 (org-based, staff connection) |
| CMS + Backend | Payload CMS 3 (multi-tenant plugin) |
| Backend Hosting | Railway |
| Frontend Hosting | Vercel |
| Build | Turborepo 2 + pnpm |
| Testing | Vitest 4.1 + v8 |

## Key Environment Variables

```
DATABASE_URL=postgresql://grove:grove_dev_password@localhost:5432/grove_dev
PAYLOAD_SECRET=your-secret-here
SUPER_ADMIN_EMAIL=admin@example.com
```

## Key Decisions

- **No forks** — single codebase, runtime tenant resolution
- **Payload CMS** — TypeScript-native, no vendor dependency
- **Auth0 Organizations** — org-based auth isolation
- **Draft/publish** — Payload native versioning
- **Manual first** — no AI layer until real patterns emerge
- **100% test coverage** — enforced on all packages

## Reference Docs

Deeper context lives in `.claude/docs/`:
- `mvp.md` — MVP scope, what's in/out, definition of done
- `architecture.md` — Full system design from Notion
- `domain-model.md` — All entities, relationships, Payload mapping
- `notion-links.md` — Quick-reference Notion URLs and board IDs

## Notion Project Board

| Field | Value |
|-------|-------|
| URL | https://www.notion.so/7be2c45841954399b92ced74a494e3c8 |
| Data Source | `collection://c2294908-28ff-4da9-9fee-5b45061427b5` |
