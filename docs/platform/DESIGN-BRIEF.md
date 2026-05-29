# Grove — Generalized Commerce & Settlement Platform — Design Brief

> **Status:** Canonical source of truth for the generalization effort. Authored 2026-05-28.
> Linear (board), Notion (specs/strategy), and the HTML docs/mockups are all derived from this file.

---

## 1. Context & Mission

Grove is an **AI-powered, multi-tenant SaaS platform**. It already provides each tenant a branded
marketing site, a staff dashboard, a Payload CMS, and a service-request system.

A new prospective client (a regulated-goods commerce + delivery operator) needs:
ordering, automated delivery-partner routing, multi-party settlement, and same/next-day payouts.

**Decision:** We do **not** build a one-off vertical app. We **generalize** these capabilities into
Grove as reusable infrastructure. This client becomes **the first tenant** of a generic
*commerce + settlement + fulfillment* platform. **No client-specific (e.g. cannabis) terminology,
schema, or branching logic enters the core.** Anything client-specific (age/eligibility rules,
license checks, a specific bank/ACH provider) is expressed through **per-tenant configuration** and
**provider adapters** behind generic abstractions.

### Generalization principles
1. **Generic nouns only.** "Partner", "Supplier", "Fulfillment", "Eligibility", "Credential" — never
   industry-specific words in code, schema, or labels.
2. **Provider-agnostic integrations.** Payments, payouts, KYC/AML, eligibility, and credential
   verification are interfaces with swappable adapters (a mock/test adapter ships in core).
3. **Per-tenant config drives behavior.** Fee splits, eligibility gates, required credential types,
   payout cadence are tenant settings — not code paths.
4. **Multi-tenant from day one.** Every new collection is tenant-scoped via
   `@payloadcms/plugin-multi-tenant` unless it is genuinely global.
5. **Determinism over model calls.** Routing, settlement math, and payout aggregation are
   deterministic code, not AI. (AI stays in the existing Service/AI layer.)

---

## 2. Current State (what already exists)

- **Monorepo:** Turborepo + pnpm. Apps: `web` (storefront/marketing, :3000), `dashboard` (:3001),
  `cms` (Payload admin, :3002). Packages: `payload`, `ui`, `types`, `config`.
- **Payload collections (built):** `tenants` (global), `users` (global), `sites`, `site-memberships`,
  `brand-configs` (isGlobal per tenant), `products`, `pages`, `media`, `customers`, `service-requests`.
- **Access control:** `packages/payload/src/access.ts` — `isAuthenticated`, `isSuperAdmin`.
- **Auth0:** staff + customer connections, org-based isolation (PLT-20 just landed).
- **Roles:** Owner / Manager / Worker (staff).
- **Testing:** Vitest, **100% function + line coverage enforced**.
- **Frontends:** `web` and `dashboard` are currently skeletons (layout + health route only). Storefront
  and dashboard UIs are largely **not yet built**.

### Collection conventions (match these exactly for all new collections)
```ts
import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Things: CollectionConfig = {
  slug: "things",
  admin: { useAsTitle: "name" },
  access: { read: isAuthenticated, create: isAuthenticated, update: isAuthenticated, delete: isSuperAdmin },
  fields: [ /* ... */ ],
};
```
- Register every new tenant-scoped collection in **two** places: the `collections: []` array in
  `apps/cms/src/payload.config.ts`, **and** the `multiTenantPlugin({ collections: { ... } })` map.
- Export it from `packages/payload/src/index.ts`.
- Run `pnpm generate:types` after schema changes (updates `packages/types/src/payload-types.ts`).
- Add a `*.test.ts` beside every collection; keep 100% coverage.

---

## 3. Generalized Domain Model (new collections)

All tenant-scoped unless noted. Keep fields lean and consistent with existing collections.
`relationship` = Payload relationship field. Money = integer **minor units** (cents) + `currency` to
avoid float drift. Immutable collections deny `update`/`delete` to non-super-admins and validate in hooks.

| Collection | Purpose | Key fields |
|---|---|---|
| `orders` | A customer purchase on a site | `orderNumber` (unique), `customer`→customers, `site`→sites, `items[]` (product→products, qty, unitPrice, lineTotal), `subtotal`, `fees`, `total`, `currency`, `status` (pending/confirmed/routed/fulfilling/delivered/completed/cancelled/refunded), `paymentStatus` (unpaid/authorized/paid/refunded/failed), `fulfillmentStatus` (unfulfilled/assigned/in_transit/delivered/failed), `shippingAddress` (group), `placedAt` |
| `payments` | Customer payment against an order | `order`→orders, `provider`, `providerIntentRef`, `method` (ach/rtp/card/pay_by_bank), `amount`, `currency`, `status` (requires_action/authorized/captured/failed/refunded), `capturedAt` |
| `partners` | External operators (suppliers & fulfillment/delivery partners) | `name`, `type` (supplier/fulfillment/hybrid), `status` (pending/active/suspended), `contactEmail`, `credentials[]` (type, identifier, status, expiresAt), `payoutMethod` (group: provider, accountRef) |
| `partner-locations` | A partner's physical/service location | `partner`→partners, `label`, `address` (group), `lat`, `lng`, `serviceRadiusKm`, `active` |
| `inventory-levels` | Stock per product per partner location | `product`→products, `partnerLocation`→partner-locations, `quantityAvailable`, `quantityReserved`, `updatedAt` |
| `fulfillments` | Assignment of an order to a partner for delivery | `order`→orders, `partner`→partners, `partnerLocation`→partner-locations, `status` (assigned/accepted/picked_up/in_transit/delivered/failed), `assignedAt`, `deliveredAt`, `trackingRef` |
| `ledger-accounts` | Named balances (double-entry) | `name`, `type` (platform_fee/customer_funds/partner_payable/supplier_payable/refunds_payable), `ownerType` (platform/partner/supplier/customer), `ownerRef`, `currency` |
| `ledger-entries` | Immutable double-entry postings | `transactionId` (groups balanced set), `account`→ledger-accounts, `direction` (debit/credit), `amount`, `currency`, `refType` (order/settlement/payout/refund/adjustment), `refId`, `postedAt`, `memo` — **immutable; each transactionId must balance (Σdebits == Σcredits)** |
| `settlements` | Allocation of an order's funds to payees | `order`→orders, `status` (pending/allocated/posted/reconciled), `allocations[]` (payeeType, payeeRef, amount, basis), `computedAt`, `postedAt` |
| `payout-batches` | A scheduled run of payouts | `scheduledFor`, `status` (pending/processing/paid/failed), `provider`, `totalAmount`, `currency` |
| `payouts` | A single disbursement to a payee | `batch`→payout-batches, `payee` (partner/supplier ref), `amount`, `currency`, `status` (pending/processing/paid/failed/reversed), `providerRef`, `method`, `settledAt` |
| `compliance-checks` | KYC/AML/eligibility/credential records | `subjectType` (customer/partner/order), `subjectRef`, `checkType` (identity_kyc/aml/eligibility/credential_verification), `status` (pending/passed/failed/expired), `provider`, `result`, `checkedAt`, `expiresAt` |
| `audit-logs` | Append-only record of system actions | `actorType` (user/partner/system), `actorRef`, `action`, `entityType`, `entityId`, `ipAddress`, `deviceId`, `metadata` (json), `createdAt` — **append-only** |

### Relationships (text ERD)
```
Tenant ──< Site ──< Product
Site ──< Order ──< OrderItem ─> Product
Order ─1─ Payment
Order ─1─ Settlement ──< Allocation ─> (Platform | Supplier | Partner)
Order ─1─ Fulfillment ─> Partner ──< PartnerLocation
PartnerLocation ──< InventoryLevel ─> Product
LedgerAccount ──< LedgerEntry  (refType/refId → Order|Settlement|Payout|Refund)
PayoutBatch ──< Payout ─> Partner|Supplier   (settles LedgerEntries)
ComplianceCheck ─> (Customer | Partner | Order)
AuditLog ─> any entity
```

---

## 4. System Components (generic ↔ guide mapping)

| Generic Grove component | In repo | Notes |
|---|---|---|
| Storefront / ordering | `apps/web` | cart, checkout, order history |
| Admin dashboard / back-office | **Payload admin** (`apps/cms`) via custom admin UI components | orders, inventory, payouts, analytics, partners — built by extending the Payload admin, not a separate Next.js app (see §11) |
| **Partner Portal** | new section/app (epic) | partners manage assigned fulfillments + own inventory + payouts |
| Routing Engine | `packages/payload` service or `packages/services` | deterministic: inventory + radius + active + speed → fulfillment |
| Inventory Sync Engine | service + endpoint/job | upsert inventory; reserve on order; release on cancel |
| Ledger Engine | service + `ledger-*` collections | double-entry, immutable, balanced |
| Payout Engine | service + `payout-*` collections | aggregate payable balances → batch → provider |
| Payments | `payments` + provider adapter | mock adapter in core; ACH/RTP/pay-by-bank ready |
| Compliance Layer | `compliance-checks` + `audit-logs` + RBAC | cross-cutting; gates configurable per tenant |
| API Layer | Payload REST/GraphQL + Next route handlers | server-authoritative pricing, idempotency |

---

## 5. Roles & Portals
- **Staff (existing):** Owner / Manager / Worker — dashboard.
- **Partner users (new, epic):** partner_admin / partner_operator — partner portal, scoped to their partner.
- **Super admin:** platform-wide (`SUPER_ADMIN_EMAIL`).

---

## 6. Phased Roadmap → Linear Milestones

| Milestone | Scope | Source |
|---|---|---|
| **M1 — Foundation** | monorepo, payload, collections, auth, RBAC, types, tailwind, multi-tenant | existing (mostly Done) |
| **M2 — Storefront & Dashboard MVP** | brand theming, product listing/detail, pages, media, product CRUD, page editor, dashboard shell | existing tickets |
| **M3 — Orders & Checkout** | cart, checkout, orders, payments (mock), order mgmt | **NEW — detailed stories** |
| **M4 — Inventory & Fulfillment Routing** | partners, locations, inventory, routing engine, fulfillment, partner portal | **NEW — epic + seeds** |
| **M5 — Ledger & Settlement** | double-entry ledger, settlement engine, reconciliation exports | **NEW — epic + seeds** |
| **M6 — Payouts** | payout batches, payout engine, provider adapter, payout views | **NEW — epic + seeds** |
| **M7 — Compliance & Audit** | audit logs, compliance checks, RBAC hardening, exports | **NEW — epic + seeds** |
| **M8 — Service Layer / AI / SEO** | existing later-phase epics | existing (backlog) |

---

## 7. Linear Board Spec (for the Linear migration agent)

**Project:** `Grove Platform` (single project, in team "Kristian Reyes"). Add a clear project summary
describing the generalized platform + that cannabis-style operators are the first tenant.

**Milestones:** M1…M8 exactly as in §6 (use the short names "M1 — Foundation", etc.).

**Labels (create + apply):**
- `type:epic`, `type:story`, `type:task`, `type:spike`, `type:bug`
- `phase:foundation`, `phase:storefront`, `phase:dashboard`, `phase:orders`, `phase:routing`,
  `phase:ledger`, `phase:payouts`, `phase:compliance`, `phase:service-layer`, `phase:ai`, `phase:seo`
- `slice:product-catalog`, `slice:storefront-shell`, `slice:brand-config`, `slice:auth-orgs`,
  `slice:inventory`, `slice:service-request`, `slice:ai`, `slice:infrastructure`, `slice:orders`,
  `slice:fulfillment`, `slice:ledger`, `slice:payouts`, `slice:compliance`

**Field mapping (Notion → Linear):**
- Size → estimate: XS=1, S=2, M=3, L=5, XL=8
- Priority → priority: P0=1 (Urgent), P1=2 (High), P2=3 (Medium), P3=4 (Low)
- Status → state: Backlog→Backlog, To Do→Todo, In Progress→In Progress, Review→In Review, Done→Done,
  Blocked→Todo (+ note "BLOCKED" at top of description)
- Type → `type:*` label; Phase → milestone + `phase:*` label; Vertical Slice → `slice:*` label
- "Depends On" → add as `blockedBy` relations where the referenced ticket can be matched by title;
  otherwise note dependencies in the description.

**Hierarchy:** Create each **Epic** as a parent issue (`type:epic`). Create stories/tasks as
**sub-issues** (`parentId` = matching epic), matched by the Notion "Epic" field text.

### 7a. Migration (existing Notion → Linear)
Enumerate **all** rows of the Notion Project Board data source `collection://c2294908-28ff-4da9-9fee-5b45061427b5`.
Because semantic search caps results, run several enumeration passes with varied queries
(e.g. "foundation monorepo auth", "storefront product brand media", "dashboard editor crud",
"service request approval rollback", "AI layer agent", "SEO sitemap metadata", "infrastructure railway vercel deploy")
and dedupe by page id. For each row, fetch the page to get full **Acceptance Criteria** + **Notes**, then
create a faithful Linear issue:
- Title = Name.
- Description = Acceptance Criteria (verbatim) + Notes + "Depends On: …" + footer
  "_Migrated from Notion Project Board (Ticket #N)._" with the source URL as a link attachment.
- Apply estimate, priority, labels, milestone, state, and parent per the mappings above.

### 7b. NEW — M3 Orders & Checkout (detailed stories)
Create epic **"Orders & Checkout"** (`type:epic`, `phase:orders`, milestone M3), then these sub-issues.
Each description must be junior-ready: a one-line goal, explicit **Acceptance Criteria** checklist,
relevant **file paths**, and **Definition of Done** (types generated if schema changed, tests added,
`pnpm lint` + `pnpm check-types` + `pnpm test` green, 100% coverage).

1. **Add `orders` collection** (estimate 3, P0, `slice:orders`,`type:story`) — schema per §3; tenant-scoped;
   registered in `payload.config.ts` collections + multi-tenant map; exported from `packages/payload/src/index.ts`;
   types generated; `orders.test.ts` covers access + a valid create. Money in integer minor units.
2. **Add `payments` collection + PaymentProvider abstraction** (5, P0, `slice:orders`) — define
   `PaymentProvider` interface (`authorize`, `capture`, `refund`); ship `MockPaymentProvider` (auto-authorizes in dev);
   `payments` collection per §3; provider selected by env/config; tests cover the mock provider + collection access.
3. **Storefront cart (client-side)** (3, P1, `slice:orders`) — add-to-cart from product pages; cart drawer/page;
   change qty / remove; persists in `localStorage`; live subtotal. Use `@grove/ui` components. No server cart yet.
4. **Storefront checkout flow** (5, P0, `slice:orders`) — checkout page: shipping address form + order review;
   "Place order" calls a server route that creates an `Order` + authorizes a `Payment`; client-side + server-side validation.
5. **Server-authoritative order endpoint** (3, P0, `slice:orders`) — the create-order route **recomputes line totals
   and order total from the DB product prices** (never trust client amounts); accepts an idempotency key; returns 409 on replay;
   stub inventory availability check. (Security-critical.)
6. **Order confirmation page** (2, P1, `slice:orders`) — after placing, show order number, items, totals, current status.
7. **Customer order history** (3, P1, `slice:orders`) — logged-in customer sees their past orders (list + detail) on the storefront.
8. **Order management in dashboard** (5, P1, `slice:orders`,`phase:dashboard`) — staff list/filter orders, view detail,
   perform allowed manual status transitions, trigger a refund (creates a refund `Payment`; ledger hook is a stub for now).
9. **Order state machine + audit hook** (3, P1, `slice:orders`) — central definition of allowed status transitions enforced in a
   Payload `beforeChange` hook; every transition writes an `audit-logs` entry (stub collection acceptable until M7, then wire fully).

### 7c. NEW — M4–M7 (epics + seed stories)
For each epic below: create the `type:epic` issue with a **Goal**, **Why it's generic** (1–2 lines), and
**Epic acceptance criteria**; then create the listed seed sub-issues (estimate/priority as noted, junior-ready ACs).

**Epic: Inventory & Fulfillment Routing** (`phase:routing`, M4)
- Seed: Add `partners` + `partner-locations` collections (3, P1, `slice:fulfillment`).
- Seed: Add `inventory-levels` collection + dashboard inventory view (3, P1, `slice:inventory`).
- Seed: **Routing Engine v1** — deterministic pure function `selectFulfillment(order, candidates)`: filter to active
  partner-locations that (a) have available inventory for all items, (b) are within `serviceRadiusKm` of the shipping address;
  rank by distance/speed; create a `fulfillments` record; **never route out-of-stock**. Unit-tested with fixtures (5, P0, `slice:fulfillment`).
- Seed: **Inventory Sync Engine v1** — endpoint/job to upsert inventory levels (manual/CSV/API); reserve on order placement,
  release on cancel (3, P1, `slice:inventory`).
- Seed (spike): Partner Portal app/section — partner users view & update assigned fulfillments, manage own inventory (3, P2, `slice:fulfillment`).

**Epic: Ledger & Settlement** (`phase:ledger`, M5)
- Seed: Add `ledger-accounts` + `ledger-entries` collections — immutable entries; `beforeChange`/`beforeDelete` hooks deny edits
  to non-super-admins; validate each `transactionId` balances (Σdebits == Σcredits) (5, P0, `slice:ledger`).
- Seed: Add `settlements` collection + **Settlement Engine v1** — on order completion, compute allocation splits from tenant
  config (platform fee %, supplier amount, fulfillment partner amount) and post balanced ledger entries. Deterministic, tested (5, P0, `slice:ledger`).
- Seed: Reconciliation export — endpoint returning ledger entries + settlements as CSV for a date range (2, P2, `slice:ledger`).

**Epic: Payouts** (`phase:payouts`, M6)
- Seed: Add `payout-batches` + `payouts` collections (3, P1, `slice:payouts`).
- Seed: **Payout Engine v1** — aggregate partner/supplier payable balances from the ledger, create a payout batch + items,
  post ledger entries marking funds settled. Deterministic, tested (5, P0, `slice:payouts`).
- Seed: PayoutProvider abstraction (mock) — interface for ACH/RTP; mock adapter simulates same-day/next-day status; provider-agnostic (3, P1, `slice:payouts`).
- Seed: Payout views (dashboard + partner portal) — payout history & status (2, P2, `slice:payouts`).

**Epic: Compliance & Audit** (`phase:compliance`, M7)
- Seed: Add `audit-logs` collection (append-only) + a global Payload hook recording key actions
  (order placed, status change, payout, refund) (3, P0, `slice:compliance`).
- Seed: Add `compliance-checks` collection + ComplianceProvider abstraction (KYC/AML/eligibility/credential); mock adapter;
  **gate checkout on a passing eligibility check when the tenant enables it** (config-driven) (5, P1, `slice:compliance`).
- Seed: RBAC hardening + partner-scoped access; capture IP/device on audit logs (3, P1, `slice:compliance`,`slice:auth-orgs`).
- Seed: Audit/reconciliation export bundle (2, P2, `slice:compliance`).

---

## 8. Notion Doc Updates (for the Notion docs agent)
Update these pages (fetch first, then surgical inserts — do **not** wipe existing content):
- **Architecture** (`https://www.notion.so/320fcd29ea3481949585e871144c8334`): add the generalized
  framing (§1 principles) + the System Components table (§4) + the new portals.
- **Domain Model** (`https://www.notion.so/321fcd29ea34817fbb25cd1914cad856`): add the new collections (§3 table)
  and the relationship ERD.
- **Roadmap** (`https://www.notion.so/320fcd29ea3481ab9238d07b5e39ceab`): add milestones M3–M7 (§6).
- **Decisions Log** (`https://www.notion.so/320fcd29ea3481ee88c7ef97ef7d5528`): add dated decisions —
  (a) generalize to commerce+settlement infra, cannabis = first tenant (config-only);
  (b) double-entry immutable ledger; (c) provider-agnostic payments/payouts/compliance (mock adapters in core);
  (d) money stored as integer minor units; (e) tasks now tracked in Linear.
- **Project Board** (`https://www.notion.so/7be2c45841954399b92ced74a494e3c8`): add a top callout:
  "📦 Tasks now live in Linear → <Grove Platform project URL>. This board is archived/read-only."

## 9. HTML Deliverables (for the HTML/mockups agent)
Self-contained static HTML (inline CSS, no build step, no external assets). Place under `docs/`:
- `docs/index.html` — landing page linking all docs + mockups.
- `docs/architecture.html` — system architecture: components (§4), multi-tenancy, data flow. Boxes/arrows via HTML+CSS or inline SVG.
- `docs/domain-model.html` — entity catalogue (§3) + the relationship ERD as a diagram.
- `docs/settlement-flow.html` — end-to-end sequence: order → payment authorize → routing → fulfillment →
  delivery → ledger postings → settlement allocation → payout. Annotated.
- `docs/mockups/storefront.html` — wireframes: product listing, product detail + add-to-cart, cart, checkout, confirmation.
- `docs/mockups/dashboard.html` — wireframes: orders list/detail, inventory, payouts, partners.
- `docs/mockups/partner-portal.html` — wireframes: assigned fulfillments, own inventory, payout history.
Mockups are **clickable wireframe prototypes** — neutral styling, clearly labelled as mockups, with UI-only interactivity (tabs, segmented toggles, qty steppers, in-page navigation) via a small inline kit; no real data, no backend, no business logic.

## 10. First-tenant (regulated operator) configuration — examples, NOT core code
- Eligibility gate = `compliance-checks` with `checkType=eligibility` (e.g. age/jurisdiction), enabled via tenant config.
- License verification = `compliance-checks` with `checkType=credential_verification` against partner `credentials[]`.
- "Industry-friendly ACH/FBO bank" = a concrete `PaymentProvider`/`PayoutProvider` adapter behind the generic interface.
- Fee splits & payout cadence = tenant settings consumed by the Settlement/Payout engines.
None of the above introduces industry-specific names or branches into the core schema or services.

---

## 11. Payload-native architecture (decision, 2026-05-28)

**Every backend capability is delivered as a Payload artifact**, so the build has one consistent mental model and the vibe coder always works inside Payload's patterns.

| Capability | Payload artifact |
|---|---|
| Domain entities (orders, payments, partners, inventory, fulfillments, ledger-*, settlements, payout-*, compliance-checks, audit-logs) | **Collections** (config-only first; see §13) |
| Business rules (order state machine, ledger immutability/balance, audit recording, inventory reserve/release) | **Collection hooks** (`beforeChange`/`afterChange`/`beforeDelete`) |
| Engines (routing, settlement, payout) | **Deterministic service modules** invoked from hooks + exposed via **custom Payload endpoints** (and **jobs** for batch runs/sync) |
| Server-authoritative operations (checkout/create-order, reconciliation/payout exports) | **Custom Payload endpoints** (or Next route handlers using the Payload Local API) |
| **Back-office / staff dashboard** | **Payload custom admin UI components** (admin view/field/cell slots) — NOT a separate hand-built Next.js dashboard |
| Provider integrations (payment/payout/KYC/eligibility) | Generic **service interfaces + adapters** (mock in core), called from endpoints/hooks |
| Storefront (customer-facing) | **`apps/web` Next.js** consuming Payload's REST/GraphQL API — this is the one piece that is *not* a Payload component |

**Back-office decision:** the staff dashboard is built by **extending the Payload admin** (custom components, views, and access-gated nav) rather than maintaining a separate `apps/dashboard` Next.js app. Payload already gives us auth, CRUD, RBAC, draft/publish, and multi-tenant scoping for free; rebuilding that in a bespoke app is wasted effort. `apps/dashboard` is reduced to (at most) a thin shell or removed; staff work happens in the Payload admin (`apps/cms`). The **storefront stays its own Next.js app** because it's public, themed per-tenant, and not an admin surface.

## 12. Payload artifact taxonomy + per-ticket build targets

Add a **primary** label to every ticket naming the artifact it produces, plus a **"Payload build target:"** line in the description naming the concrete artifact(s) and file path(s).

**Labels:** `payload:collection`, `payload:field`, `payload:hook`, `payload:access`, `payload:endpoint`, `payload:admin-ui`, `payload:global`, `payload:job`, and (non-Payload) `app:web` (storefront on Payload API), `app:config` (no-code tenant data in the admin).

**Mapping rules (apply per ticket):**
- "Add/extend X collection" → `payload:collection` (or `payload:field`). Target: `packages/payload/src/collections/<x>.ts` (+ register, + test).
- Order state machine / immutability / audit recording / inventory reserve-release → `payload:hook`. Target: a hook on the relevant collection.
- Routing / Settlement / Payout engines → `payload:endpoint` (+ `payload:job` for batch/sync). Target: deterministic module in `packages/payload/src/services/*` invoked by a hook/endpoint.
- Checkout/create-order, reconciliation/exports → `payload:endpoint`.
- Dashboard / back-office / staff views, inventory view, payout views, order management → `payload:admin-ui`. Target: custom admin component registered via Payload `admin.components`.
- Storefront cart, listing, product detail, checkout UI, confirmation, order history → `app:web`. Target: `apps/web/src/...` (consumes Payload API; not a Payload component).
- Brand/theme, product/page/media entry → `app:config` (no-code) unless it requires a new admin component (then `payload:admin-ui`).
- Provider abstractions (payment/payout/compliance) → `payload:endpoint` + note the adapter interface.

## 13. Scaffold spec — collections to create now (config-only)

Create these 13 collections **as config-only stubs** (fields + access only — **no hooks yet**; hooks/engines remain their own tickets). Fields per §3. Gotchas (important):
- **Do not** add fields named `createdAt`/`updatedAt` — Payload auto-adds timestamps; a custom one collides. (So `inventory-levels` drops its `updatedAt`; `audit-logs` drops its `createdAt` — use Payload's built-ins.)
- Money fields are `number` with `min: 0`; include `currency` (`text`, default `"USD"`).
- **Immutable collections** (`ledger-entries`, `audit-logs`): set `access.update` **and** `access.delete` to `isSuperAdmin` (signals immutability without a hook).
- Collections with no natural title field (`inventory-levels`, `fulfillments`, `settlements`, `payout-batches`, `payouts`, `compliance-checks`, `ledger-entries`): omit the `admin` block (defaults to id).
- Register each in **all three**: export in `packages/payload/src/index.ts`; `collections: []` array and `multiTenantPlugin({ collections })` map in `apps/cms/src/payload.config.ts` (all 13 are tenant-scoped).
- Add a `<name>.test.ts` beside each (mirror `products.test.ts`: assert slug, useAsTitle if present, representative field shapes, field count, and the 4 access refs) so per-package coverage stays 100%.
- Then run `pnpm generate:types` (works offline, no DB), then verify green: `pnpm lint` + `pnpm check-types` + `pnpm test:coverage`.

Engines, hooks, provider adapters, endpoints, and admin-UI components are **separate tickets** (already on the board) — this step only lays down the data layer.
