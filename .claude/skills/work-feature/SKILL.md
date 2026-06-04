---
name: work-feature
description: Use to build one storefront feature end to end following Grove's mock → schema → live route pipeline. Use when starting a Linear ticket that adds a page or a piece of content (home, shop, PDP, a content section). Walks a beginner from a static HTML mock, to a Payload schema, to a live route that renders that content from the database with the same scoped CSS — with tests at every step.
---

# Work a feature — mock → schema → live

This is the core recipe for building a feature in Grove. It turns one Linear
ticket into a shipped page by moving through three stages the codebase is built
around:

```
static HTML mock  →  Payload schema  →  live route rendering that content
 (design first)      (model the data)    (same CSS, real data, with defaults)
```

Every storefront surface in this repo (home, shop, PDP, cart, lab-reports) was
built this way. Follow the steps in order; each builds on the last.

> The house rules below are summarized from
> [`.claude/docs/working-agreement.md`](../../docs/working-agreement.md) — read
> it first if you haven't.

---

## 1. Plan first (don't code yet)

Read the Linear ticket end to end. Then, in your own words:
- **Restate** what you're building in one or two plain sentences.
- **List your assumptions** — what data it needs, what page it lives on, what
  the "done" state looks like.
- If anything is ambiguous, **ask before coding**. A wrong plan is the most
  expensive mistake.

> **Teach moment.** Senior engineers spend more time understanding the problem
> than typing. The plan is where you catch a misunderstanding for free, instead
> of after a day of building the wrong thing.

## 2. Work in a worktree

Build this ticket in its own isolated git worktree so `main` stays clean and you
can throw the work away without consequence. One worktree = one ticket. Never
build two tickets in the same working copy.

## 3. Turn the tasks into a todo list

Copy the ticket's task checklist into a visible todo list and work it top to
bottom — one item in progress at a time. This keeps you (and anyone reviewing)
oriented.

## 4. Mock — design it as static HTML first

Build the page as a plain static HTML file at
`apps/web/public/<page>-mock.html`. Model it on the existing mocks —
`apps/web/public/homepage-mock.html`, `apps/web/public/product-mock.html`,
`apps/web/public/shop-mock.html`. Use **real images** via `/api/media/...` so it
looks like the real thing.

Annotate every piece of dynamic content:
- Mark each field that will come from the CMS with a `data-pl="fieldName"`
  attribute on its element.
- Add a small **content-model table** (in an HTML comment or alongside) listing
  each field, its type, and an example value. This table becomes your schema in
  Step 5.

Iterate on the mock by **screenshotting it** and refining until the design is
approved. Decide the design here, on cheap static HTML — not later, tangled up
with data wiring.

> **Teach moment.** Separating "how it looks" (the mock) from "where the data
> comes from" (the schema) means you only solve one hard thing at a time.

## 5. Schema — model the data in Payload

Turn the mock's content-model table into a Payload **collection** (many rows,
e.g. products) or **global** (one row per tenant, e.g. brand config). Model it on
the existing definitions in `packages/payload/src/collections/`.

- **Multi-tenant:** every tenant-scoped collection is isolated per tenant. Use a
  per-tenant **global** (the `isGlobal` pattern, like `brand-configs`) when there
  is exactly one record per site (a homepage, a theme); use a normal collection
  when there are many (products, pages).
- **Register it:** export the new definition from
  `packages/payload/src/index.ts` and add it to the config in
  `apps/web/src/payload.config.ts`.
- **Generate types:** run `pnpm generate:types` so `@grove/types` knows the new
  shape. (Types are stale until you do this.)
- **Test it:** add a unit test next to the collection. The `packages/payload`
  package is **gated to 100% coverage**, so an untested field fails `/check`.
- **Production migration:** production runs committed migrations, not dev
  push — add one in `apps/web/src/migrations/` for any new table/column.

> **Teach moment — what a collection is.** A collection is a typed table plus an
> admin UI plus an API, all generated from one definition. Define the fields once
> and Payload gives you the database table, the editor screen, and the REST/local
> API for free.

## 6. Transform — Payload doc → view-model (the tested seam)

Don't render raw Payload documents in your components. Convert them to a clean
**view-model** first, in `apps/web/src/lib/storefront.ts` — the pure,
**100%-coverage-gated** module (see `mapProduct`, `brandConfigToCssVars`). Write
its unit tests in `apps/web/src/lib/storefront.test.ts`.

The async Payload reads belong in `apps/web/src/storefront/server.ts` (a
server-only module — see `getStorefrontProducts`, `getHomepage`,
`getBrandConfig`), which calls the pure transform. Keep I/O out of the gated lib
so the lib stays pure and unit-testable.

**Collapse nulls to defaults here.** Follow the existing convention: a missing
CMS field becomes an empty string / sensible default in the view-model, so the
page renders identically whether the data is live or absent.

## 7. Live route — render it from real data

Add the route under `apps/web/src/app/(frontend)/(storefront)/.../page.tsx`
(model on `(storefront)/page.tsx`). In the page:
- **Wrap in `<StorefrontRoot>`** (`apps/web/src/storefront/StorefrontRoot.tsx`).
  It scopes everything under `.storefront` and injects the tenant's BrandConfig
  colors as **CSS custom properties**, so the store is themed from data, not
  code.
- **Build the view from the kit** in `apps/web/src/storefront/kit/` — compose
  existing components; add new ones there.
- **CSS isolation:** import `kit.css` plus a **per-page** stylesheet, and scope
  your page's rules under `.storefront` (see `home.css`, `pdp.css`). **Never edit
  the shared `kit.css` to style one page** — that leaks into every other page.
- **Render from live Payload data with code defaults**, so the page works even
  before anything is seeded.
- **Seed it:** add the demo content to `packages/payload/src/seed.ts` so a fresh
  database shows the finished page.

> **Teach moment — CSS variables.** `StorefrontRoot` sets values like `--ink` and
> `--lime` on the `.storefront` element from the tenant's BrandConfig. The
> stylesheet reads those variables, so changing a color in the admin re-skins the
> whole store with no code change. That's the entire theming system.

## 8. Tests — prove it's real

- At least **one red→green test**: it fails before your change and passes after.
- At least **one guard / negative-path test** (missing data, wrong tenant, empty
  state).
- Verify the build with `next build` — not just lint, which can be cached.

## 9. Stay on the ticket

This ticket builds **one** feature. If you spot something else worth doing, park
it (note it for a future ticket) and remind the user — don't expand scope.

## 10. Finish

Run `/check` (lint + types + tests + 100% coverage) and get it green. Then run
`/done` to close the ticket in Linear.

---

## Quick reference — where each stage lives

| Stage | File / location |
| --- | --- |
| Mock | `apps/web/public/<page>-mock.html` |
| Schema (collection/global) | `packages/payload/src/collections/` → export in `packages/payload/src/index.ts` → register in `apps/web/src/payload.config.ts` |
| Types | `pnpm generate:types` → `@grove/types` |
| Prod migration | `apps/web/src/migrations/` |
| Pure transform (100% gated) | `apps/web/src/lib/storefront.ts` (+ `.test.ts`) |
| Async data access | `apps/web/src/storefront/server.ts` |
| Theme root | `apps/web/src/storefront/StorefrontRoot.tsx` |
| View components | `apps/web/src/storefront/kit/` (+ per-page CSS scoped under `.storefront`) |
| Route | `apps/web/src/app/(frontend)/(storefront)/.../page.tsx` |
| Seed | `packages/payload/src/seed.ts` |
