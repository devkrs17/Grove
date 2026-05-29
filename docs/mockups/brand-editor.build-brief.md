# Build Brief — Brand & Theme Editor

- **Mockup:** `docs/mockups/brand-editor.html`
- **App(s):** `apps/dashboard` (port 3001), `/settings/brand`
- **Canonical refs:** `docs/platform/DESIGN-BRIEF.md` (§2 conventions, §3 model), `docs/platform/BUILDER-PLAYBOOK.md` (§2 the theme step, §3 recipes)
- **Layer:** **tenant.** Editing the theme is authenticated staff work over the existing `brand-configs`
  collection. One access nuance (not a shell boundary): `sites` fields are super-admin-only — see below.

> This brief **describes**; it does not implement. Implementation runs the handoff prompt at the bottom.
> **Conflict surfaced (BUILDER-PLAYBOOK §2 vs. this mockup):** today the theme is edited as raw fields in
> the Payload admin (`:3002`). This mockup proposes an **enhanced custom editor with live preview** in
> `apps/dashboard`. Pick one and state it: recommended path is the custom dashboard editor (Recipe B) over
> the *same* `brand-configs` data — the Payload admin remains as the always-available fallback. Don't fork the data model.

---

## Current schema (ground truth — `packages/payload/src/collections/`)

`brand-configs` (tenant-scoped; one per site): `site`→sites (required), `logo`→media (upload),
`primaryColor` (text), `secondaryColor` (text), `typography` (json).
`sites`: `name`, `slug` (unique), `domain`, `description` — **create/update/delete = `isSuperAdmin`**.
`media`: `alt` (required), `site`→sites, image upload sizes (thumbnail, card).

**Anything the mockup shows beyond the above is a proposed extension**, flagged in-screen with
`extends schema`. Those require **Recipe A** (add fields to `brand-configs`, regenerate types, update tests):
`accentColor`, `backgroundColor`, `textColor`, `faviconBg` (media), `socialImage` (media). Fonts (`headingFont`,
`bodyFont`, `baseSize`) fit inside the existing `typography` JSON field — no schema change needed.

---

## Per-screen implementation map

### 1. Colors & typography — `/settings/brand`
- **Route file:** `apps/dashboard/src/app/(dash)/settings/brand/page.tsx` (single page; tabs are client state)
- **Data source:** `brand-configs` for the current tenant's `site` — `primaryColor`, `secondaryColor`, `typography` (JSON holding `headingFont` / `bodyFont` / `baseSize`).
- **Reuse `@grove/ui`:** `Input` (hex + size), `Select` (font pickers), `Button` (Save draft / Publish), `Card` (panels).
- **New component (Recipe B):** `ThemeEditor` (the split form ↔ preview), `ColorSwatchRow`, and a `StorefrontPreview` that consumes a brand object and renders a re-skinned mini storefront via CSS variables. Copy a `@grove/ui` primitive + test as the starting point.
- **New collection (Recipe A)?** Only if adding accent/background/text colors as first-class fields. Otherwise none.
- **States:** loading (skeleton), saved vs. unsaved-draft indicator, no-config-yet (first run → create the `brand-configs` record).
- **Layer:** `tenant`.

### 2. Identity & assets — `/settings/brand` (Identity tab)
- **Route file:** same page, Identity tab.
- **Data source:** `media` (logo upload; favicon/social are extensions), `sites` (`name`, `domain`), `brand-configs.logo`.
- **Reuse `@grove/ui`:** `Input` (site name), `Button` (Replace / upload), `Card`.
- **New component (Recipe B):** logo dropzone / media picker wired to the `media` collection upload.
- **Access nuance (READ CAREFULLY):** `site.name` / `site.domain` come from `sites`, whose write access is **`isSuperAdmin`**. For normal staff these fields are **read-only** in this editor (the mockup marks `domain` "super-admin only"). Do not widen `sites` access to make the form editable — gate the inputs on role instead.
- **Layer:** `tenant` (with a super-admin-only sub-section).

---

## How the "re-skin" actually works (so the preview isn't faked in real code)

The mockup hardcodes an example palette. In the real build:
1. `brand-configs` values map to CSS custom properties (`--brand`, `--brand-2`, …) injected at the site root.
2. The storefront (`apps/web`) already reads those variables; the editor's `StorefrontPreview` renders the **same** component tree with the in-progress values so preview == production.
3. "Publish theme" persists `brand-configs`; the live storefront re-reads on next render. No CSS edits, no deploy.

---

## Cross-cutting rules the implementation MUST honor

- [ ] **Multi-tenant** — `brand-configs` is already tenant-scoped; queries auto-filter to the current tenant/site. If you add fields, no new registration needed; if you add a *collection*, register in both spots + export from `packages/payload/src/index.ts`.
- [ ] **Respect `sites` access** — never relax `isSuperAdmin` on `sites`; gate name/domain inputs by role in the UI.
- [ ] **Types generated** — run `pnpm generate:types` after any `brand-configs` schema change; consume generated types, don't hand-write.
- [ ] **Typography JSON shape** — define and validate the `typography` JSON keys (`headingFont`, `bodyFont`, `baseSize`) in one place; don't scatter magic strings.
- [ ] **100% function + line coverage** — `ThemeEditor`, `StorefrontPreview`, and any new collection/fields ship with tests.
- [ ] **Generic nouns only** — no industry-specific terms in labels or code.

---

## Shell — do NOT touch (BUILDER-PLAYBOOK §7)

This screen does **not** enter shell territory (no ledger / routing / payouts / fulfillments / compliance).
Leave those platform internals alone. The only access subtlety is `sites` being super-admin-managed.

---

## Definition of Done

- [ ] Both tabs implemented at `/settings/brand` in `apps/dashboard`, editing the current site's `brand-configs`.
- [ ] Live preview renders from the same brand variables the storefront uses (preview == production).
- [ ] `sites` name/domain shown read-only for non-super-admins; `sites` access unchanged.
- [ ] Any added `brand-configs` fields done via Recipe A with `pnpm generate:types` + tests.
- [ ] Tests added/updated; coverage stays at 100%.
- [ ] `/check` (lint + `check-types` + test) is **green**.

---

## Handoff prompt (paste this into Claude to implement)

```
Implement the Brand & Theme Editor mocked in docs/mockups/brand-editor.html, following its build brief
docs/mockups/brand-editor.build-brief.md.

Ground yourself first in docs/platform/DESIGN-BRIEF.md (§2 conventions, §3 model) and
docs/platform/BUILDER-PLAYBOOK.md (§2 the theme step, §3 recipes). Read the mockup's data-grove-* attributes
per screen. Confirm the current brand-configs / sites / media schema in packages/payload/src/collections/
before changing anything.

Build a /settings/brand editor in apps/dashboard with two tabs (Colors & Typography, Identity & Assets) that
edits the current site's brand-configs and uploads logo/assets to media. The live preview must render from the
SAME brand CSS variables the storefront uses (preview == production). Keep primaryColor/secondaryColor and put
fonts in the existing typography JSON; only add accent/background/text colors (and favicon/social image) via
Recipe A if you implement them — regenerate types and add tests. Show sites name/domain read-only for
non-super-admins and do NOT relax sites access. Add tests to keep 100% coverage. When finished, run /check and
confirm it is green.
```
