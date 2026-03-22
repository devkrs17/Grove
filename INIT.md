# Grove — White-Label SaaS Platform

> AI-Powered Change Management for Org-Based Web Dashboards

## Overview

A multi-tenant SaaS platform that provisions organizations a branded marketing site and internal inventory dashboard — then differentiates through an AI-powered service request system that lets clients submit changes in plain language and see them deployed automatically, with rollbacks at every step.

**Target vertical:** Specialty retail, art dealers, and boutique makers.

---

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
| Project Board | https://www.notion.so/7be2c45841954399b92ced74a494e3c8 |
| Clients | https://www.notion.so/320fcd29ea34819c9774c77260fb5bdd |

---

## Architecture: Single Codebase, Multi-Tenant

One repo. One Vercel deployment. One Payload instance. Tenant resolved at runtime by hostname. **No forks.**

- Payload multi-tenant plugin handles row-level data isolation
- BrandConfig is a per-tenant singleton (`isGlobal: true`)
- Content changes use Payload draft/publish/versioning (not Git PRs)
- Git/PRs are only for platform-level code changes (new features, bug fixes, schema updates)

---

## Stack

| Layer | Service | Purpose |
|-------|---------|---------|
| Auth | Auth0 | Two connections: staff (dashboard) + customer (storefront). Org-based isolation |
| CMS + Backend API | Payload CMS | Multi-tenant plugin. Collections, REST/GraphQL API, draft/publish, versioning |
| Backend Hosting | Railway | Single Payload instance serving all tenants |
| Frontend Hosting | Vercel | Single deployment. Middleware resolves tenant from hostname. Preview mode for drafts |
| Repo | GitHub | Single monorepo. PRs for platform changes only |
| AI Agent | Custom | Request interpretation → Payload API draft creation |
| Action Protocol | MCP Servers | Exposes Payload actions to AI agent and chatbot |
| Monorepo | Turborepo | Build orchestration, shared packages |

---

## Repo Structure

```
platform/
├── apps/
│   ├── web/            # Marketing site + storefront (Next.js, Vercel)
│   └── dashboard/      # Staff dashboard (Next.js, Vercel)
├── packages/
│   ├── payload/        # Payload CMS config, collections, plugins (Railway)
│   ├── ui/             # Shared component library
│   ├── config/         # Shared config (eslint, tsconfig, tailwind)
│   └── types/          # Shared TypeScript types
└── .github/
    └── workflows/      # CI/CD for platform changes only
```

---

## Domain Model

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
| Owner | Org-level | Sees everything, manages billing, acts across all Sites. Implicit access |
| Manager | Multi-site | Assigned to specific Sites. Manages workers, approves changes |
| Worker | Site-scoped | Assigned to one or more Sites. Day-to-day operations |

### Auth Model

- **Staff** (Owner, Manager, Worker) → staff Auth0 connection → dashboard
- **Customer** → customer Auth0 connection → storefront
- Completely separate user pools, login flows, and session handling

### Payload Collection Mapping

| Entity | Payload Type | Multi-tenant Scoped | Draft/Publish |
|--------|-------------|---------------------|---------------|
| Org | Collection (tenants) | No — IS the tenant | No |
| Site | Collection | Yes | No |
| User | Auth collection | Yes | No |
| SiteMembership | Collection | Yes | No |
| Customer | Collection | Yes (per-Site) | No |
| Product | Collection | Yes (per-Site) | Yes |
| Page | Collection | Yes (per-Site) | Yes |
| Media | Upload collection | Yes (per-Site) | No |
| BrandConfig | Collection (isGlobal) | Yes (per-Site) | No |
| ServiceRequest | Collection | Yes | No |

---

## Service Request System (Core Value Proposition)

### Low Tier (AI handles)

1. Client submits request via chatbot or dashboard form
2. AI interprets intent, identifies target collection and fields
3. AI calls Payload REST API to create a **draft** version
4. Next.js preview mode renders the draft for the client
5. Client approves → draft publishes → live instantly
6. Client rejects → draft discarded
7. Rollback = revert to any previous version in Payload

### High Tier (human handles)

1. Request logged, routed to human
2. Developer makes platform-level change in the codebase
3. PR → CI/CD → deployed via Vercel
4. Affects all tenants (platform change)

> **Early stage (1-2 clients):** Service requests handled manually via form + email/Slack notification. Build AI automation after real patterns emerge.

---

## Tenant Resolution Flow

1. Client visits `clientname.platform.com` or `www.clientdomain.com`
2. Vercel middleware extracts hostname
3. Looks up Site in Payload by domain
4. Sets tenant context for the request
5. All Payload queries automatically scoped to that tenant

---

## Onboarding Flow

1. Org signs up → configure brand (logo, colors, typography) via Payload CMS
2. Admin uploads CSV of users → two roles: customers and workers
3. Admin uploads CSV of products → seeds marketing site and inventory dashboard
4. Platform creates Org + Auth0 tenant, configures domain, seeds BrandConfig
5. Workers get dashboard access; customers directed to storefront

---

## Key Decisions (Settled)

- **No forks** — single codebase, Payload multi-tenant plugin, runtime tenant resolution
- **Payload CMS** over Sanity — TypeScript-native, no vendor dependency, no per-seat costs
- **Auth0 Organizations** — familiar, org-based auth is exactly what it's built for
- **Railway** for backend — simple, affordable, fits per-org provisioning model
- **Vercel** for frontend — preview deployments, no infra to manage
- **Draft/publish for content** — Payload native versioning replaces PR-based staging
- **Manual service requests first** — build AI layer after real patterns emerge
- **Turborepo** for monorepo tooling
- **Atomic service requests** — one intent, one request
- **100% test coverage** — all code must have 100% function and line coverage. Vitest with v8 provider, thresholds enforced in CI

---

## Open Questions

- [ ] Single Railway instance vs. Payload Cloud — cost/scaling tradeoffs?
- [ ] How does Vercel handle wildcard subdomains + custom domains simultaneously?
- [ ] How does Next.js preview mode work with Payload drafts in multi-tenant context?
- [ ] DB choice for Payload — Postgres vs MongoDB?
- [ ] Org provisioning — manual by us or self-serve?
- [ ] What additional staff roles might emerge?
- [ ] How does AI CSV parsing for customAttributes work?
- [ ] Auction-mode statuses — presets or owner-defined?

---

## Open Source References

| Project | Relevance | Link |
|---------|-----------|------|
| Convex Chef | Agent loop architecture, tool scoping, write-check-fix pattern | https://github.com/get-convex/chef |
| GitHub MCP Server | MCP tool structure, auth, dynamic discovery | https://github.com/github/github-mcp-server |
| Decap CMS | Config-driven content model concepts | https://github.com/decapcms/decap-cms |
| Qodo PR Agent | Platform change validation, single-call validation pattern | https://github.com/qodo-ai/pr-agent |

---

## Roadmap

### Now — Foundation
- [ ] Finalize product name and GitHub org
- [ ] Initialize Turborepo monorepo (PLT-9)
- [ ] Configure shared packages (PLT-12)
- [ ] Local dev environment with hot reload (PLT-13)
- [ ] Payload CMS with multi-tenant plugin (PLT-14)
- [ ] Org collection / tenant entity (PLT-15)
- [ ] Auth0 tenant setup with staff connection (PLT-20)
- [ ] Hostname-based tenant resolution middleware
- [ ] Marketing site base template
- [ ] Dashboard base template
- [ ] First client onboarding (manual)

### Next — Service Layer
- [ ] Service request form in dashboard
- [ ] ServiceRequest collection in Payload
- [ ] Email/Slack notification for incoming requests
- [ ] Draft/preview flow (Payload draft mode + Next.js preview)
- [ ] Publish/reject workflow
- [ ] Rollback via Payload versioning

### Later — AI & Automation
- [ ] AI agent for request interpretation and Payload draft creation
- [ ] MCP server exposing Payload actions
- [ ] Embedded chatbot UI in dashboard
- [ ] AI CSV parsing for onboarding
- [ ] Draft validation via LLM check

---

## First Ticket: PLT-9 — Initialize Turborepo Monorepo

**Priority:** P0 - Critical | **Size:** M | **Dependencies:** None

**Acceptance Criteria:**
- Turborepo monorepo initialized with structure: `apps/web` (Next.js), `apps/dashboard` (Next.js), `packages/payload` (Payload CMS config), `packages/ui` (shared components), `packages/config` (eslint, tsconfig, tailwind), `packages/types` (shared TS types)
- All packages resolve correctly
- `turbo dev` starts all apps
- `turbo build` succeeds with no errors
