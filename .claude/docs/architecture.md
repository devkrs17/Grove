# Architecture

> Distilled from the Notion Architecture page. Source: https://www.notion.so/320fcd29ea3481949585e871144c8334

## Core Principle

One repo. One Vercel deployment. One Payload instance. Tenant resolved at runtime by hostname. No forks.

Payload's multi-tenant plugin handles data isolation at the row level. BrandConfig is a per-tenant singleton via `isGlobal: true`. Content changes use Payload's native draft/publish/versioning.

Git/PRs are only for platform-level code changes (new features, bug fixes, schema updates).

## Repo Structure

```
apps/
  web/          # Marketing site + storefront (Next.js, Vercel, port 3000)
  dashboard/    # Staff dashboard (Next.js, Vercel, port 3001)
  cms/          # Payload CMS admin (Next.js, port 3002)
packages/
  payload/      # Payload CMS config, collections, plugins (Railway)
  ui/           # Shared component library (Radix UI + Tailwind)
  config/       # Shared config (eslint, tsconfig, tailwind)
  types/        # Auto-generated Payload TypeScript types
```

## Stack

| Layer | Service | Purpose |
|-------|---------|---------|
| Auth | Auth0 | Two connections: staff (dashboard) + customer (storefront). Org-based isolation |
| CMS + Backend | Payload CMS 3 | Multi-tenant plugin, REST/GraphQL, draft/publish, versioning |
| Backend Hosting | Railway | Single Payload instance serving all tenants |
| Frontend Hosting | Vercel | Single deployment. Middleware resolves tenant from hostname |
| Build | Turborepo 2 | Monorepo orchestration + pnpm workspaces |

## How Tenant Resolution Works

1. Client visits `clientname.platform.com` or `www.clientdomain.com`
2. Vercel middleware extracts hostname
3. Looks up Site in Payload by domain
4. Sets tenant context for the request
5. All Payload queries automatically scoped to that tenant

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| No forks | Fork-per-tenant doesn't scale past ~10 clients |
| Payload CMS | TypeScript-native, self-hosted, no per-seat costs |
| Payload multi-tenant plugin | Row-level tenant isolation, first-party support |
| Draft/publish for content | Payload native versioning, no PR pipeline needed |
| Hostname-based resolution | Vercel middleware + Payload domain lookup |
| Two Auth0 connections | Staff and customer are completely separate auth systems |
| Turborepo | Standard monorepo tooling |
| Manual service requests first | Build AI layer after real patterns emerge |

## Open Questions (from Notion)

- How does org provisioning get triggered — manual by us or self-serve?
- Single Railway instance vs. Payload Cloud — cost/scaling tradeoffs?
- How does Vercel handle wildcard subdomains + custom domains simultaneously?
- How does Next.js preview mode work with Payload drafts in multi-tenant context?
