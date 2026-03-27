# MVP Scope

## Goal

Get **one client** live with a **working storefront** served from Payload CMS. Everything else is deferred.

## What's IN scope

### 1. Tenant Resolution (apps/web)
- Vercel middleware reads hostname
- Looks up Site in Payload by domain field
- Sets tenant context for the request
- Falls back to 404/landing if no match

### 2. Marketing Site (apps/web)
- Renders products from Payload, scoped to tenant
- Renders pages from Payload (homepage, about, etc.)
- BrandConfig drives theming: colors, logo, typography, favicon
- Responsive, accessible, SEO basics (meta tags, OG)
- Product detail pages with images from Media collection

### 3. Staff Auth (apps/dashboard)
- Auth0 login with Next.js SDK
- Session includes orgId, siteId, role
- Middleware protects dashboard routes
- Role-based access (Owner sees everything, Workers scoped to sites)

### 4. Basic Dashboard (apps/dashboard)
- Product list view (read-only to start, CRUD later)
- BrandConfig editor (logo, colors, typography)
- Media upload
- Staff can preview marketing site changes

### 5. Seed & Deploy
- Seed script populates first client: Org, Site, BrandConfig, Products from Excel
- Deploy apps/web to Vercel with wildcard subdomain
- Deploy Payload to Railway
- Configure Auth0 org for first client

## What's OUT of scope (deferred)

- Payment processing (Authorize.net) — no checkout needed yet
- AI agent / request interpretation — manual first
- MCP server — no AI layer yet
- Service request system — just use Payload admin directly
- Chatbot UI — not until AI layer exists
- Customer auth — storefront is public for MVP
- Storybook — nice to have, not blocking
- Structured logging (Pino) — console.log is fine for now
- Error tracking (Sentry) — add when deployed
- Billing management — manual invoicing for first client
- Orders / transactions — no e-commerce checkout yet
- Eval harness / few-shot injection — AI layer stuff

## Definition of Done

1. First client's products visible at `clientname.platform.com`
2. BrandConfig (logo, colors) applied to their storefront
3. Staff can log into dashboard and see their products
4. Staff can edit BrandConfig and see changes on the storefront
5. Deployed to Vercel (web) + Railway (Payload)
6. `pnpm lint && pnpm check-types && pnpm test` all pass with 100% coverage

## MVP Tickets (Notion Board)

Foundation phase tickets are mostly Done. The remaining MVP work maps to:

| What | Notion Ticket | Status |
|------|--------------|--------|
| Auth0 setup | PLT-20 (`326fcd29ea3481a1ac94d0281e36fd50`) | Review |
| Hostname middleware | PLT-15 (`326fcd29ea348163962acd99b9983c12`) | To build |
| Site collection | PLT-16 (`326fcd29ea34818b94ddd37ac948c0c3`) | To build |
| BrandConfig collection | PLT-17 (`326fcd29ea3481578587ce844e6c60bd`) | To build |
| Staff auth flow | PLT-21 (`326fcd29ea348109b2abc79d4c8c924d`) | To build |
| SiteMembership | PLT-22 (`326fcd29ea34815fac45e6ae7fb913bc`) | To build |
| Marketing site template | Storefront Shell epic | To build |
| Tailwind config | PLT-100 (`32bfcd29ea348144a91fece3ed58c637`) | To build |
| Token system | PLT-101 (`32bfcd29ea348160bd09f1307410d177`) | To build |
