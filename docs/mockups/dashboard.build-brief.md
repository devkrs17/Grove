# Build Brief — Staff Dashboard

- **Mockup:** `docs/mockups/dashboard.html`
- **App(s):** `apps/dashboard` (port 3001)
- **Canonical refs:** `docs/platform/DESIGN-BRIEF.md` (domain model §3, components §4, conventions §2),
  `docs/platform/BUILDER-PLAYBOOK.md` (shell/tenant boundary §0, recipes §3, do-not-touch §7)
- **Layer:** **mixed.** The screens are staff-facing `apps/dashboard` views (app work), but several
  *actions* they expose (refunds, payout runs, inventory reservations) execute **shell** engines/collections.
  Build the views; call the shell engines through their interfaces — never reimplement money/routing logic.

> This brief **describes**; it does not implement. Implementation runs the handoff prompt at the bottom.
> Access is role-based (Owner / Manager / Worker) and tenant-scoped — every query is auto-scoped by the
> multi-tenant plugin. Money is rendered from integer **minor units** (display only; never recompute totals client-side).

---

## Per-screen implementation map

### 1. Orders list — `/orders`
- **Route file:** `apps/dashboard/src/app/(dash)/orders/page.tsx`
- **Data source:** `orders` — `orderNumber`, `customer`→customers, `status`, `paymentStatus`, `fulfillmentStatus`, `total`, `currency`, `placedAt`. List with status filter + search; the three status pills map to the three independent status fields.
- **Reuse `@grove/ui`:** `Badge` (status pills), `Input` (search), `Card` (stat tiles). Table + filter chips are a new dashboard component (Recipe B).
- **New collection (Recipe A)?** No — `orders` is added in M3 (DESIGN-BRIEF §7b #1). This screen assumes it exists.
- **New component (Recipe B)?** Yes — `OrdersTable` + `StatChips` under `apps/dashboard/src/`, copying a `@grove/ui` primitive + its test.
- **States:** empty (no orders), loading (skeleton rows via `Skeleton`), filtered-empty.
- **Layer:** `tenant`.

### 2. Order detail — `/orders/[orderNumber]`
- **Route file:** `apps/dashboard/src/app/(dash)/orders/[orderNumber]/page.tsx`
- **Data source:** `orders` (items[], subtotal, fees, total), `payments` (status), `fulfillments` (partner, partnerLocation, trackingRef, status timeline), `audit-logs` (activity feed).
- **Reuse `@grove/ui`:** `Card`, `Badge`, `Button`. Activity timeline is a small Recipe-B component.
- **Recipe A?** No. **Recipe B?** Yes — `OrderTimeline`, `OrderItemsTable`.
- **Actions & layer (READ CAREFULLY — mixed):**
  - Manual status transitions are gated by the **order state machine** (DESIGN-BRIEF §7b #9) enforced in a Payload `beforeChange` hook — **shell** logic. The UI only offers transitions the machine allows; it does not encode the rules.
  - **Refund** creates a refund `Payment` **and posts a reversing, balanced ledger transaction** — `ledger-*` is **shell, do-not-touch**. The button calls the platform refund service; it must not write ledger entries directly.
  - Every transition writes an `audit-logs` entry (shell hook).
- **Layer:** `mixed` (view = tenant; refund + state machine = shell).

### 3. Inventory — `/inventory`
- **Route file:** `apps/dashboard/src/app/(dash)/inventory/page.tsx`
- **Data source:** `inventory-levels` — `product`→products, `partnerLocation`→partner-locations, `quantityAvailable`, `quantityReserved`, `updatedAt`. Stock bar = available / (available+reserved).
- **Reuse `@grove/ui`:** `Input` (adjust), `Badge`, `Button` (Import CSV / Adjust). Stock bar is a tiny Recipe-B component.
- **Recipe A?** `inventory-levels` + `partner-locations` collections land in M4 (DESIGN-BRIEF §7c). If not yet built, add per Recipe A (both registration spots + `*.test.ts` + `pnpm generate:types`).
- **Actions & layer (mixed):** displaying + manual "Adjust"/"Import CSV" upserts go through the **Inventory Sync Engine** (`reserve`/`release` on order placement/cancel are **shell**). Staff edits to `quantityAvailable` are app-level; reservations are not editable here.
- **Layer:** `mixed`.

### 4. Payouts — `/payouts`
- **Route file:** `apps/dashboard/src/app/(dash)/payouts/page.tsx`
- **Data source:** `payout-batches` (`scheduledFor`, `provider`, `status`, `totalAmount`), `payouts` (per payee), aggregates from `ledger-accounts` (pending payable, platform fees).
- **Reuse `@grove/ui`:** `Card`, `Badge`, `Button`.
- **Recipe A?** No (these are shell collections). **Recipe B?** Only the read-only views/tiles.
- **Actions & layer (SHELL):** "Run payout batch" triggers the **Payout Engine** (aggregate payable balances → batch → provider → post settled ledger entries) — **shell, do-not-touch**. This screen **displays** batches/payouts and **triggers** the engine via its interface; it must not aggregate balances or post ledger entries itself.
- **Layer:** `shell` (dashboard surface is app; all logic is platform).

### 5. Partners — `/partners`
- **Route file:** `apps/dashboard/src/app/(dash)/partners/page.tsx`
- **Data source:** `partners` (`name`, `type` supplier/fulfillment/hybrid, `status`, `credentials[]` with `expiresAt`, `payoutMethod`), `partner-locations` (count), `compliance-checks` (credential verification status → the credentials pill).
- **Reuse `@grove/ui`:** `Badge`, `Input`, `Button` ("Add partner").
- **Recipe A?** Yes — `partners` + `partner-locations` are addable business collections (M4, DESIGN-BRIEF §7c) — NOT on the do-not-touch list. Add per Recipe A if absent.
- **Actions & layer (mixed):** partner CRUD is tenant/app work; the **credentials → `compliance-checks`** linkage (credential_verification) is **shell** (compliance is do-not-touch). `partner.status` gates routing eligibility (read-only signal here).
- **Layer:** `tenant` (with a shell touchpoint on compliance).

---

## Cross-cutting rules the implementation MUST honor

- [ ] **Server-authoritative amounts** — the dashboard *displays* totals from the DB; it never recomputes order/payout math client-side.
- [ ] **Money = integer minor units (cents) + `currency`** — format for display only; no float math.
- [ ] **Multi-tenant** — any new tenant-scoped collection (`partners`, `partner-locations`, `inventory-levels`) registered in BOTH `apps/cms/src/payload.config.ts` (`collections: []` **and** the `multiTenantPlugin` map) and exported from `packages/payload/src/index.ts`.
- [ ] **Role-based access** — Owner / Manager / Worker scoping enforced via `packages/payload/src/access.ts`; don't widen access in the view layer.
- [ ] **Types generated** — run `pnpm generate:types` after any schema change.
- [ ] **100% function + line coverage** — every new collection/component ships with a test.
- [ ] **Generic nouns only** — Partner / Supplier / Fulfillment / Eligibility / Credential; no industry terms.

---

## Shell — do NOT touch (BUILDER-PLAYBOOK §7)

`ledger-accounts`, `ledger-entries`, `settlements`, the routing engine, `fulfillments`,
`payout-batches`, `payouts`, payment/payout **provider adapters**, `compliance-checks`,
`audit-logs`, Auth0 config, multi-tenant plugin wiring.

> This dashboard **reads** several of these and **triggers** their engines (refund, run payout batch,
> inventory reserve) through platform interfaces. It must never reimplement their logic or write to them
> directly. The order **state machine** and all **ledger** postings are shell-owned.

---

## Definition of Done

- [ ] All five screens implemented to their Acceptance Criteria — nothing extra (no gold-plating).
- [ ] Read-only vs. action-triggering responsibilities respected (shell engines called, not reimplemented).
- [ ] Tests added/updated; coverage stays at 100%.
- [ ] `pnpm generate:types` run if any schema changed.
- [ ] `/check` (lint + `check-types` + test) is **green**.

---

## Handoff prompt (paste this into Claude to implement)

```
Implement the staff dashboard screens mocked in docs/mockups/dashboard.html, following its build brief
docs/mockups/dashboard.build-brief.md.

Ground yourself first in docs/platform/DESIGN-BRIEF.md (domain model + conventions) and
docs/platform/BUILDER-PLAYBOOK.md (shell/tenant boundary + the two build recipes). Read the mockup's
data-grove-* attributes for the route/collection/component mapping per screen.

Build only these five screens (orders list, order detail, inventory, payouts, partners) in apps/dashboard.
Honor every rule in the brief's "Cross-cutting rules" section (display server-authoritative amounts, money
as integer minor units, multi-tenant registration in both spots, role-based access, generated types). These
screens READ from and TRIGGER shell engines (order state machine, ledger refunds, payout engine, inventory
reservations) — call those through their platform interfaces; do NOT reimplement them or write to anything
in the brief's "Shell — do NOT touch" list. Add tests to keep 100% coverage. When finished, run /check and
confirm it is green.
```
