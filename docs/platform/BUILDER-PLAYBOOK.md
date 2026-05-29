# Grove Builder Playbook — Launch Your Product on the Shell

> **Who this is for:** a junior / "vibe coder" who has been handed a working Grove **shell** and needs to
> stand up a real product on it. You do **not** need to understand the ledger, routing, or payout engines.
> You add **your products, your theme, and your content**. The shell renders them.

---

## 0. The one idea to hold in your head

Grove is split into two layers. Know which one you're in at all times.

| Layer | What it is | Who owns it | Do you write code? |
|---|---|---|---|
| **Shell (platform)** | The engine: storefront/dashboard apps, checkout, routing, ledger, payouts, auth, multi-tenancy | Provided for you | **No — don't touch it** |
| **Tenant (your product)** | Your brand, products, pages, media, settings | **You** | **Mostly no.** Most of it is data you enter in the admin UI. Code only for custom looks. |

**Your job = fill the tenant layer.** 90% of it happens in a web admin screen, not in code.
If a task makes you edit the routing engine or the ledger, **stop — that's shell work, not yours.**

---

## 1. Get it running (once)

You don't set up Node, Postgres, or env files by hand. Use the project skill:

```
/run-grove
```

This installs prerequisites, starts the database, seeds demo data, and launches all three apps:

| App | URL | What it's for |
|---|---|---|
| **Storefront** | http://localhost:3000 | what your customers see |
| **Dashboard** | http://localhost:3001 | staff: orders, inventory, payouts |
| **CMS admin** | http://localhost:3002 | **where you add products, pages, media, and your theme** |

If anything fails, it's almost always Docker not running or a missing `.env`. Re-run `/run-grove` — it's safe to run again.

---

## 2. Launch your product — the no-code recipe

Do these **in the CMS admin (`:3002`)** in order. No code editor required.

1. **Create your Tenant.** Collections → *Tenants* → New. Name it (e.g. "Acme Goods"). The tenant is your isolated workspace — everything below is auto-scoped to it.
2. **Create your Site.** Collections → *Sites* → New. Set `name`, `slug`, and `domain`. One tenant usually has one site.
3. **Set your theme / brand.** Collections → *Brand Configs* → your site's config. Fill in colors, logo, fonts, etc. **This is your "theme."** The storefront reads these values — change them and the whole site re-skins. No CSS edits.
4. **Add your products.** Collections → *Products* → New. Set `name`, `price` (see money note below), and Publish when ready. Repeat for your catalogue. (Bulk import comes from the shell's inventory tooling later.)
5. **Add your pages & content.** Collections → *Pages* → New. Use the rich-text editor. Save as **Draft**, preview, then **Publish**.
6. **Upload media.** Collections → *Media* → upload images for products and pages. Media is per-site.
7. **Preview.** Open the storefront (`:3000`) for your site. Your theme + products + pages should render.

> 💡 **That's the whole product-launch loop for most tenants.** Tenant content is *data*, edited in the admin —
> the shell turns it into a live, themed storefront. You only drop into code for the things in §3.

**Money note:** prices are stored as **integer minor units** (cents). `$19.99` is `1999`. Never use decimals/floats.

**Where the shell is today:** the storefront/dashboard rendering lands in milestones **M2–M3** (see the Linear board).
Until those ship, you'll add data in the CMS and the screens fill in as the shell catches up. The mockups in
`docs/mockups/` show the target screens.

---

## 3. When you DO need code — copy a pattern, don't invent one

Grove is built so that almost every code task is **"copy the existing example and change the names."**
There are only two recipes you'll ever need.

### Recipe A — Add a new kind of content (a Payload collection)
Use when your product needs data the shell doesn't model yet (e.g. "Testimonials", "FAQs").
**Copy `packages/payload/src/collections/products.ts`** and adapt:

1. Copy `products.ts` → `testimonials.ts`. Rename the export `Products` → `Testimonials`, `slug: "products"` → `"testimonials"`.
2. Change the `fields` to what you need (keep the `access` block as-is unless told otherwise).
3. Register it in **two** places (the shell needs both — this trips everyone up once):
   - `packages/payload/src/index.ts` → export it.
   - `apps/cms/src/payload.config.ts` → add to the `collections: [ ]` array **and** to the
     `multiTenantPlugin({ collections: { ... } })` map (so it's tenant-scoped).
4. Regenerate types: `pnpm generate:types`.
5. Copy `products.test.ts` → `testimonials.test.ts` and adjust. **Every collection has a test.**
6. Run the gate: `/check`. Green = done.

### Recipe B — Add a custom storefront section/component
Use when you want a bespoke block on a page. **Copy an existing component from `packages/ui/src/components/`**
(e.g. `card.tsx` + `card.test.tsx`), build your section in the relevant app under `apps/web/src/`, and reuse
`@grove/ui` primitives (`Button`, `Card`, `Input`, …). Add/adjust the test. Run `/check`.

> **Rule of thumb:** if you can't find an existing file to copy, you're probably reaching into shell territory.
> Re-read §0 and check whether this is really tenant work.

---

## 4. Your daily loop

```
/next-task            → the board hands you the next ticket (priority-ordered)
git checkout -b ...    → branch for that ticket
build it               → follow the ticket's "copy X" instruction + Acceptance Criteria
/check                 → lint + type-check + tests, all must be GREEN
open a PR              → fill in the PR checklist
/done                  → marks the ticket complete on the board
```

- **Only pick up tickets labelled `layer:tenant`.** Tickets labelled `layer:shell` are platform work — skip them.
- Every ticket has an **Acceptance Criteria** checklist and a **Definition of Done**. You're done when all boxes
  are ticked and `/check` is green — not before.

---

## 5. Guard rails — what keeps you safe

You don't need senior judgment because the project fails loud when something's wrong:

- **`/check`** runs lint, `pnpm check-types`, and `pnpm test`. **If it's green, your change is structurally safe to merge.**
- **100% test coverage is enforced.** If you add code without a test, the suite fails. That's intentional.
- **Multi-tenancy is automatic.** The plugin scopes every query to the current tenant — you can't accidentally
  leak one client's data into another's, as long as you register collections per Recipe A.
- **Draft/publish** on products & pages means nothing goes live until you hit Publish.
- **Types are generated, not hand-written.** Run `pnpm generate:types` after schema changes and trust them.

**Green checks = safe. Red checks = fix before merging. Never merge red.**

---

## 6. When you're stuck (in order)

1. **Read the actual error.** The first red line in `/check` output usually names the file and the fix.
2. **Look at the example you copied.** 9 times out of 10 you missed one of the two registration spots in Recipe A.
3. **Open the mockup** for the screen you're building (`docs/mockups/`). It shows the intended layout.
4. **Re-read the ticket's Acceptance Criteria.** Build exactly that — nothing more (don't gold-plate).
5. **Check the boundary (§0).** If the fix needs you to edit `ledger-*`, `routing`, `payout-*`, or `settlements`,
   that's shell work — flag it, don't patch it.
6. Still stuck after 20 min? Leave the branch, comment the blocker on the Linear ticket, and ask.

---

## 7. Don't touch (shell internals)

Leave these to the platform. They encode money-movement and correctness rules:

- `ledger-accounts`, `ledger-entries`, `settlements` (double-entry money — immutable by design)
- the routing engine and `fulfillments`
- `payout-batches`, `payouts`, and any payment/payout **provider adapters**
- `compliance-checks`, `audit-logs`
- auth/Auth0 config, the multi-tenant plugin wiring

If a tenant needs different behavior here, it's a **config or provider** change owned by the platform — not a code edit.

---

## 8. Glossary

- **Tenant** — one client/business. Isolated. Everything you create belongs to a tenant.
- **Site** — a tenant's storefront (brand, domain). Usually one per tenant.
- **Brand Config** — your **theme**: colors, logo, fonts. Data, not CSS.
- **Product / Page / Media** — your catalogue and content. Edited in the CMS admin.
- **Collection** — a type of record in Payload (like a database table). Add new ones with Recipe A.
- **Shell vs Tenant** — engine (provided) vs your product layer (you). See §0.
- **`/check`, `/run-grove`, `/next-task`, `/done`** — the skills that run your whole workflow.

---

### Related
- Engineering spec & domain model: `docs/platform/DESIGN-BRIEF.md`
- Architecture, domain model, settlement flow (visual): `docs/index.html`
- UI targets: `docs/mockups/storefront.html`, `dashboard.html`, `partner-portal.html`
- The backlog: Linear → **Grove Platform** project (filter to `layer:tenant`)
