# Grove

AI-powered multi-tenant SaaS platform for specialty retail and boutique makers. Organizations get a branded marketing site, staff dashboard, and an AI-powered service request system that handles content changes in plain language with automatic deployment and rollback.

## Apps

| App | Port | Description |
|-----|------|-------------|
| `apps/web` | 3000 | Marketing site + storefront (Next.js) |
| `apps/dashboard` | 3001 | Staff dashboard (Next.js) |
| `apps/cms` | 3002 | Payload CMS admin (Next.js) |

## Getting Started

**Prerequisites:** Node 20+, pnpm, Docker

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose up -d

# Start all apps
pnpm dev
```

**Required environment variables** (`.env.local` at repo root):

```
DATABASE_URL=postgresql://grove:grove_dev_password@localhost:5432/grove_dev
PAYLOAD_SECRET=your-secret-here
SUPER_ADMIN_EMAIL=admin@example.com
```

## Commands

```bash
pnpm dev              # Start all apps
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm check-types      # Type-check all packages
pnpm test             # Run all tests
pnpm test:coverage    # Run tests with coverage report
pnpm generate:types   # Regenerate Payload TypeScript types
```

## Architecture

Single repo, single Vercel deployment, single Payload instance. Tenant resolved at runtime by hostname via `@payloadcms/plugin-multi-tenant`.

```
apps/
  web/          # Marketing site + storefront
  dashboard/    # Staff dashboard
  cms/          # Payload CMS admin
packages/
  payload/      # Collection definitions, access control, seed data
  ui/           # Shared React component library (Radix UI + Tailwind)
  types/        # Auto-generated Payload TypeScript types
  config/       # Shared tsconfig, eslint, tailwind, test setup
```

## Stack

- **CMS / Backend** — Payload CMS 3 (multi-tenant, draft/publish, versioning)
- **Frontend** — Next.js 15, React 19, Tailwind CSS 4
- **Auth** — Auth0 (org-based, staff + customer connections)
- **Database** — PostgreSQL 16
- **Build** — Turborepo 2 + pnpm workspaces
- **Testing** — Vitest 4 + v8 (100% coverage enforced)
- **Hosting** — Railway (Payload) + Vercel (Next.js apps)
