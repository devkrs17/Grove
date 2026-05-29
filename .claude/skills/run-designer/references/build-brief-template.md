<!--
  BUILD-BRIEF STARTER — copy to docs/mockups/<name>.build-brief.md and fill in.
  This is the "send it back" artifact: it translates the wireframe into Grove's real
  architecture so the next session can implement it without re-deriving anything.
  Fill every TODO from the mockup's data-grove-* attributes + DESIGN-BRIEF.md §3/§4.
  Delete these comments when done.
-->

# Build Brief — TODO title

- **Mockup:** `docs/mockups/<name>.html`
- **App(s):** TODO (e.g. `apps/web`)
- **Canonical refs:** `docs/platform/DESIGN-BRIEF.md` (domain model §3, components §4, conventions §2),
  `docs/platform/BUILDER-PLAYBOOK.md` (shell/tenant boundary §0, recipes §3, do-not-touch §7)
- **Layer:** TODO `tenant` / `shell` / mixed (flag any shell-territory screens explicitly)

> This brief **describes**; it does not implement. Implementation runs the handoff prompt at the bottom.

---

## Per-screen implementation map

For each `.screen` in the mockup (read its `data-grove-*` attributes), one block:

### 1. TODO screen name — `route`
- **Route file:** TODO (e.g. `apps/web/src/app/(storefront)/products/[slug]/page.tsx`)
- **Data source:** TODO collections + exact fields (from DESIGN-BRIEF §3) — e.g. `products` (`name`, `price`, `slug`, draft/publish)
- **Reuse `@grove/ui`:** TODO (e.g. `Card`, `Button`, `Input`, `Select`, `Badge`, `Skeleton`) — these exist in `packages/ui/src/components/`
- **New collection (Recipe A)?** TODO yes/no — if yes: slug, key fields, the two registration spots, `*.test.ts`, `pnpm generate:types`
- **New component (Recipe B)?** TODO yes/no — if yes: copy an existing `packages/ui/src/components/*.tsx` + its test
- **States to handle:** TODO (empty / loading / error / guest vs. logged-in)
- **Layer:** TODO `tenant` / `shell`

_(repeat per screen)_

---

## Cross-cutting rules the implementation MUST honor

Pulled from the canonical docs — non-negotiable:

- [ ] **Server-authoritative pricing** — totals recomputed from DB product prices; never trust client amounts.
- [ ] **Money = integer minor units (cents) + `currency`** — never floats/decimals.
- [ ] **Multi-tenant** — any new tenant-scoped collection registered in BOTH `apps/cms/src/payload.config.ts` (`collections: []` **and** the `multiTenantPlugin` map) and exported from `packages/payload/src/index.ts`.
- [ ] **Draft/publish** respected for `products` and `pages` (nothing live until published).
- [ ] **Idempotency keys** on order-creation routes (return 409 on replay) — if checkout/order is in scope.
- [ ] **Types generated**, not hand-written — run `pnpm generate:types` after any schema change.
- [ ] **100% function + line coverage** — every new collection/component ships with a test.
- [ ] **Generic nouns only** — no industry-specific terms in code, schema, or labels.

---

## Shell — do NOT touch (BUILDER-PLAYBOOK §7)

Leave these to the platform; tenant work never edits them:
`ledger-accounts`, `ledger-entries`, `settlements`, the routing engine, `fulfillments`,
`payout-batches`, `payouts`, payment/payout **provider adapters**, `compliance-checks`,
`audit-logs`, Auth0 config, multi-tenant plugin wiring.

> TODO: if any screen above needs behavior here, mark it **shell work** and call it out — it's a
> config/provider change owned by the platform, not a tenant code edit.

---

## Definition of Done

- [ ] All screens in the mockup implemented to their Acceptance Criteria — nothing extra (no gold-plating).
- [ ] Tests added/updated; coverage stays at 100%.
- [ ] `pnpm generate:types` run if any schema changed.
- [ ] `/check` (lint + `check-types` + test) is **green**.

---

## Handoff prompt (paste this into Claude to implement)

```
Implement the screens mocked in docs/mockups/<name>.html, following its build brief
docs/mockups/<name>.build-brief.md.

Ground yourself first in docs/platform/DESIGN-BRIEF.md (domain model + conventions) and
docs/platform/BUILDER-PLAYBOOK.md (shell/tenant boundary + the two build recipes). Read the
mockup's data-grove-* attributes for the route/collection/component mapping.

Build only the agreed screens. Honor every rule in the brief's "Cross-cutting rules" section
(server-authoritative pricing, money as integer minor units, multi-tenant registration in both
spots, draft/publish, idempotency, generated types). Do NOT touch anything in the brief's
"Shell — do NOT touch" list. Add tests to keep 100% coverage. When finished, run /check and
confirm it is green.
```
