# Build Brief — Partner Portal

- **Mockup:** `docs/mockups/partner-portal.html`
- **App(s):** new section/app — `apps/partner-portal` (or a `/portal` segment of an existing app; decide at kickoff)
- **Canonical refs:** `docs/platform/DESIGN-BRIEF.md` (§3 domain model, §4 components, §5 roles),
  `docs/platform/BUILDER-PLAYBOOK.md` (shell/tenant boundary §0, recipes §3, do-not-touch §7)
- **Layer:** **shell / platform epic.** The whole Partner Portal is a platform-owned epic (DESIGN-BRIEF §6 M4,
  §7c "Partner Portal app/section"). It introduces a **new user type** (`partner_admin` / `partner_operator`)
  with **partner-scoped RBAC**, and it reads/writes `fulfillments` and reads `payouts` — all shell territory.
  This is **NOT tenant ("vibe coder") work**; a junior should not pick this up as a content task.

> This brief **describes**; it does not implement. Implementation runs the handoff prompt at the bottom.
> Hard requirement: every screen is scoped to the **signed-in user's own partner**. A partner must never
> see another partner's or the platform's data. This scoping is an access-control concern, enforced in
> `packages/payload/src/access.ts` (partner-scoped rules), not in the UI.

---

## Per-screen implementation map

### 1. Assigned fulfillments — `/portal/fulfillments`
- **Route file:** `apps/partner-portal/src/app/portal/fulfillments/page.tsx`
- **Data source:** `fulfillments` (`order`→orders, `partnerLocation`, `status` assigned→accepted→picked_up→in_transit→delivered→failed, `trackingRef`, `assignedAt`), joined to `orders` for the order number. Scoped to `fulfillment.partner == currentUser.partner`.
- **Reuse `@grove/ui`:** `Badge` (status), `Button` (Accept / Pick up / Mark delivered / Retry).
- **Recipe A?** No — `fulfillments` is a **shell** collection (do-not-touch). **Recipe B?** The portal views/components are new, but built within a platform-owned app.
- **Actions & layer (SHELL):** the partner advances `fulfillment.status`; each transition writes an `audit-logs` entry and drives the order's `fulfillmentStatus` (and on `delivered`, payment capture + completion). Transition rules + side-effects are **platform-owned**. The UI offers only allowed transitions; it does not encode the rules or capture payments.
- **Layer:** `shell`.

### 2. My inventory — `/portal/inventory`
- **Route file:** `apps/partner-portal/src/app/portal/inventory/page.tsx`
- **Data source:** `inventory-levels` (`product`→products, `partnerLocation`→partner-locations, `quantityAvailable`, `quantityReserved`) scoped to the partner's own `partner-locations`.
- **Reuse `@grove/ui`:** `Input` (edit available qty), `Badge`, `Button` (Import CSV / Save).
- **Recipe A?** `inventory-levels` / `partner-locations` are addable business collections (M4) — but here they're consumed, not created. **Recipe B?** Yes — the partner-scoped inventory editor.
- **Actions & layer (mixed):** the partner edits **`quantityAvailable` only**, at **their own locations only** (upsert via the Inventory Sync Engine). `quantityReserved` is platform-managed (reserved on order placement / released on cancel) and is **read-only** here — **shell**.
- **Layer:** `mixed` (partner self-service edit = app; reservations = shell).

### 3. Payout history — `/portal/payouts`
- **Route file:** `apps/partner-portal/src/app/portal/payouts/page.tsx`
- **Data source:** `payouts` (`batch`→payout-batches, `amount`, `currency`, `status`, `settledAt`, `method`) scoped to this partner; summary tiles (pending payable, next payout, paid this month, method). **Read-only.**
- **Reuse `@grove/ui`:** `Card` (tiles), `Badge` (status), `Button` (Export CSV).
- **Recipe A?** No. **Recipe B?** Read-only views only.
- **Actions & layer (SHELL):** amounts trace to settlement allocations posted in the double-entry ledger; status reflects the PayoutProvider. `payouts` / `payout-batches` / `ledger-*` are **do-not-touch**. This screen only **reads** the partner's own payouts.
- **Layer:** `shell`.

---

## Cross-cutting rules the implementation MUST honor

- [ ] **Partner-scoped access (critical)** — all three screens filtered to the signed-in user's partner; enforced in `access.ts`, not the UI. A partner sees only their own fulfillments / inventory / payouts.
- [ ] **New roles** — `partner_admin` / `partner_operator` (DESIGN-BRIEF §5) wired into Auth0 + RBAC. This is platform/auth work.
- [ ] **Money = integer minor units (cents) + `currency`** — display only; no client-side math.
- [ ] **Multi-tenant** — the portal still runs under tenant scoping; partner scoping is an additional filter on top.
- [ ] **Types generated** — run `pnpm generate:types` after any schema change.
- [ ] **100% function + line coverage** — every new component ships with a test; access rules are tested (a partner cannot read another partner's records).
- [ ] **Generic nouns only** — Partner / Supplier / Fulfillment; no industry terms.

---

## Shell — do NOT touch (BUILDER-PLAYBOOK §7)

`ledger-accounts`, `ledger-entries`, `settlements`, the routing engine, `fulfillments` *(status transitions
go through the platform service, not direct writes)*, `payout-batches`, `payouts`, payment/payout
**provider adapters**, `compliance-checks`, `audit-logs`, Auth0 config, multi-tenant plugin wiring.

> The Partner Portal **is** platform work. It reads `fulfillments`/`payouts` and advances fulfillment status
> through platform services. Do not reimplement routing, settlement, payout, or ledger logic in the portal.

---

## Definition of Done

- [ ] All three screens implemented, each strictly scoped to the signed-in user's partner.
- [ ] `partner_admin` / `partner_operator` roles + partner-scoped access rules added and **tested** (cross-partner read is denied).
- [ ] Fulfillment status transitions go through the platform service (not direct collection writes).
- [ ] Tests added/updated; coverage stays at 100%.
- [ ] `pnpm generate:types` run if any schema changed.
- [ ] `/check` (lint + `check-types` + test) is **green**.

---

## Handoff prompt (paste this into Claude to implement)

```
Implement the Partner Portal screens mocked in docs/mockups/partner-portal.html, following its build brief
docs/mockups/partner-portal.build-brief.md.

IMPORTANT: this is a platform/shell epic (DESIGN-BRIEF §6 M4), not tenant "vibe coder" work — it adds new
partner roles + partner-scoped RBAC and touches shell collections. Ground yourself in
docs/platform/DESIGN-BRIEF.md (§3 domain model, §5 roles) and docs/platform/BUILDER-PLAYBOOK.md
(shell/tenant boundary + do-not-touch list). Read the mockup's data-grove-* attributes per screen.

Build only these three screens (assigned fulfillments, my inventory, payout history). Enforce partner-scoped
access in packages/payload/src/access.ts so a partner can only ever see their own data, and TEST that a
partner cannot read another partner's records. Advance fulfillment status through the platform service
(never direct writes); treat payouts/ledger/settlements as read-only and do NOT reimplement them. Money is
display-only integer minor units. Add tests to keep 100% coverage. When finished, run /check and confirm green.
```
