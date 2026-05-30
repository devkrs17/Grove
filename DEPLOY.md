# Deploying Grove (Vercel + managed Postgres)

Grove is a single Next.js app (`apps/web`) with Payload CMS, the storefront, and
the API routes all embedded. So a deploy is: **one app + one Postgres + blob
storage + a domain.**

This guide targets **Vercel** for hosting and **Neon** Postgres (what Vercel's
Storage tab provisions). Any managed Postgres works — just supply its URL.

---

## 1. Vercel project settings

In the Vercel project (Settings → General):

- **Root Directory:** `apps/web`
- **Framework Preset:** Next.js
- **Install / Build commands:** leave on the defaults (Vercel detects pnpm +
  the workspace and runs `next build`).

## 2. Provision Postgres

Vercel → **Storage → Create Database → Neon**. This injects connection-string
env vars into the project. Two of them matter:

- **Pooled** (host contains `-pooler`) → used by the app at runtime.
- **Unpooled / non-pooling** → used for migrations + seeding.

The app reads `DATABASE_URL`, falling back to `POSTGRES_URL`. Make sure **one of
those points at the pooled URL**. (If the integration only created
`POSTGRES_URL`, you're fine — no rename needed.)

## 3. Blob storage for media

Vercel → **Storage → Create → Blob**. It injects `BLOB_READ_WRITE_TOKEN`.
When that var is present, Payload stores uploads in Blob automatically; without
it, uploads go to local disk (fine for local dev, **breaks on Vercel** — the
filesystem there is ephemeral). So set it before uploading any media.

## 4. Environment variables (Settings → Environment Variables, Production)

| Var | Value |
|-----|-------|
| `DATABASE_URL` *(or `POSTGRES_URL`)* | pooled Postgres URL |
| `PAYLOAD_SECRET` | a long random string |
| `SUPER_ADMIN_EMAIL` | your admin email (grants cross-tenant access) |
| `BLOB_READ_WRITE_TOKEN` | from Blob storage (step 3) |
| `PAYLOAD_DB_PUSH` | `true` for the first deploy (see step 5) |

## 5. Get the schema into the database

The Postgres adapter only auto-creates tables in dev. For production pick one:

### Path A — quickest (no migration files)
Set **`PAYLOAD_DB_PUSH=true`**. On first boot Payload creates/syncs the schema,
and `onInit` seeds the demo data (Highgrove) because the DB has no users yet.
Deploy, open the site once to trigger the boot, done.

> Good for getting live fast. For ongoing production you should switch to
> migrations (Path B) so schema changes are reviewed and reversible.

### Path B — migrations (recommended once live)
Generate a migration locally against your DB, commit it, then run it. Use the
**unpooled** URL for these.

```bash
cd apps/web
vercel link                                  # once
vercel env pull .env.production.local        # grabs the injected URLs

# generate (uses your dev or a branch DB):
DATABASE_URL="<unpooled-url>" pnpm migrate:create

# commit apps/web/src/migrations/*, then apply:
DATABASE_URL="<unpooled-url>" pnpm migrate
```

With migrations committed, leave `PAYLOAD_DB_PUSH` unset.

## 6. Seed data (if not relying on the auto-seed)

```bash
cd apps/web
DATABASE_URL="<unpooled-url>" pnpm seed       # idempotent
```

The seed is also run automatically by `onInit` on first boot when there are no
users yet, so Path A covers this for the first deploy.

## 7. Create your admin user

Visit `https://<your-app>/admin`. The first account you create is the admin.
(Use the same address as `SUPER_ADMIN_EMAIL` to get cross-tenant access.)

## 8. Domain + tenant resolution

The storefront resolves the tenant from the **hostname** (`src/middleware.ts`)
by matching it against each Site's `domain` field.

1. Add your domain in Vercel → Settings → Domains (e.g. `highgrove.example.com`,
   or a wildcard `*.example.com` for many tenants).
2. In `/admin`, set the Site's `domain` to that exact hostname.
3. Visit it — middleware resolves the tenant and the storefront renders its
   products/brand.

---

## Smoke test

- [ ] `/admin` loads and you can log in
- [ ] Storefront renders products for the tenant's domain
- [ ] A media upload in `/admin` persists after a redeploy (confirms Blob)
- [ ] BrandConfig edit shows on the storefront

## Local dev (no cloud needed)

```bash
pnpm docker:up    # Postgres + app, auto-seeded
```
