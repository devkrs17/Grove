Walk through the steps to onboard a new client (tenant) into Grove.

The storefront is data-driven: once a tenant's records exist in Payload, the
branded site renders with **no code changes**. Theming comes from BrandConfig
(injected as CSS variables by `StorefrontRoot`), and per-vertical sections
(e.g. lab-report COAs) are toggled by BrandConfig flags. So onboarding is
"create the right rows," not "fork the app."

## Prerequisites
- Client's product data (Excel/CSV)
- Client's brand colors (a dark/primary and an accent/secondary, as hex)
- (When auth is wired) Auth0 tenant + org

## Onboarding Steps

1. **Create the Tenant**
   - Payload admin → Tenants → Create. Set `name` and a URL-safe `slug`
     (e.g. `acme`). The slug is how the storefront resolves the tenant by host
     and is the fallback key used throughout.

2. **Create the Site**
   - Tenants own one Site (usually). Set its `domain`
     (`acme.grove.dev` or a custom domain) and status active, scoped to the
     tenant.

3. **Configure BrandConfig — this is what themes the store**
   BrandConfig is consumed at runtime: `StorefrontRoot` reads it and injects CSS
   custom properties onto the `.storefront` root, so editing these fields
   re-skins the live site (and the admin **Live Preview**) immediately.
   - **`primaryColor`** → `--ink`: the dominant brand color (body text, borders,
     dark buttons, footer). Use the client's near-black/brand-dark hex.
   - **`secondaryColor`** → `--lime`: the accent (highlights, price pills, CTAs,
     the nav dot). Use the client's pop/accent hex.
   - Leave a field blank to keep the storefront default for that slot.
   - **`showLabReports`** (checkbox): turn **on** only for regulated-goods
     clients who publish Certificates of Analysis. On = the `/lab-reports` COA
     library, the nav/footer "Lab reports" links, the homepage CTA, and the
     per-product COA panel all render. Off (default) = none of that — the right
     state for most retail clients.
   - `logo`, `typography` exist on the model but aren't consumed by the
     storefront yet (see Known gaps).

4. **Import Products**
   - Use the admin CSV import widget (dashboard) or seed script. Map the client's
     columns to the Product fields; set `slug` (or let it derive from the name).
   - Scope every Product to the new Tenant.
   - Product images: upload to Media, or set `imageId` to a full URL.

5. **Create Staff Users** (when auth is wired)
   - Create the user in the Auth0 org, a matching User in Payload, and a
     SiteMembership with the right role (Owner / Manager / Worker).

6. **Verify**
   - Open the storefront on the tenant's host — it should render in the client's
     colors with their products.
   - In the admin, open a Product or the Homepage and click **Live Preview** to
     see it rendered as a shopper would, at mobile/tablet/desktop breakpoints.
   - Toggle `secondaryColor` in BrandConfig and confirm the accent changes across
     the store (proves the theme wiring).
   - If `showLabReports` is off, confirm `/lab-reports` 404s and no COA panels
     appear; if on, confirm the COA library lists the tenant's lab reports.

## Seed Script (dev/staging)

`packages/payload/src/seed.ts` provisions the Blinkers demo tenant end-to-end
(tenant, site, BrandConfig with `showLabReports: true`, products, homepage, lab
reports). It runs automatically on first boot when the DB has no users
(`onInit`). Use it as the reference for what a fully-onboarded tenant looks like.

## Known gaps / notes
- BrandConfig currently themes two color slots (`primaryColor` → `--ink`,
  `secondaryColor` → `--lime`). The fuller palette (`--grape`, `--bg`, fonts)
  still uses the storefront defaults; widen the mapping in
  `apps/web/src/lib/storefront.ts` (`brandConfigToCssVars`) when a client needs
  finer control.
- The storefront components still live under `apps/web/src/storefront/blinkers/`
  with `Blinkers*` names — functional, just not yet renamed to generic names.
- Adding a BrandConfig field requires a committed migration in
  `apps/web/src/migrations/` (production runs migrations, not dev push).
