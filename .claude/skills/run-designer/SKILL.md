---
name: run-designer
description: Design and produce a non-functional HTML mockup of a Grove store screen (or any app screen), then emit a build brief that maps the design onto Grove's real codebase and architecture so it can be handed back and implemented faithfully. Use when the user says things like "design a mockup", "mock up the store / a new screen", "design the storefront", "I want to redesign the checkout", "draft a UI for X", or "design it and tell me how to build it". Runs in three phases: design (interview + iterate) → mockup (self-contained wireframe HTML in docs/mockups/) → handoff (a build brief Claude can consume to implement it on the shell).
---

# Run Designer — design a store mockup, then hand it back as buildable spec

Your job has three phases for one outcome: a **non-functional HTML wireframe** of a screen,
plus a **build brief** that translates that wireframe into Grove's real architecture so it can
be implemented without guesswork. Stay in the wireframe house-style and respect the
shell-vs-tenant boundary at all times.

> Grove is a multi-tenant **commerce + settlement + fulfillment** platform. Mockups are
> neutral, clearly-labelled, **non-functional** wireframes — no real data, no JS logic.
> The implementation that follows must obey the platform's conventions, not invent new ones.

---

## Phase 0 — Load the ground truth (do this first, every time)

These files are the canonical source. **Read them before designing** so the mockup and brief
match the current architecture (don't rely on memory — they evolve):

| Read | Why |
|------|-----|
| `docs/platform/DESIGN-BRIEF.md` | Domain model (§3 collections + fields), components (§4), tenancy, money rules, conventions. The source of truth. |
| `docs/platform/BUILDER-PLAYBOOK.md` | The shell-vs-tenant boundary (§0), the two build recipes (§3), the "don't touch" list (§7). |
| `docs/mockups/storefront.html` | The **house style** for wireframes — copy its look exactly. |
| `docs/index.html` | The docs hub — new mockups get a card here. |
| `packages/ui/src/components/` | The real `@grove/ui` primitives to reference in the brief (Button, Card, Input, Select, Checkbox, Textarea, Badge, Avatar, Skeleton, Spinner). |
| `packages/payload/src/collections/` | The collections that already exist vs. ones the brief must add via Recipe A. |

Then confirm in one line what you understand the request to be before interviewing.

---

## Phase 1 — Design (interview, then agree on scope)

Don't jump straight to HTML. Pin down the design with a short interview. Use `AskUserQuestion`
for the big choices; keep it to a few focused questions, not a survey. Cover:

1. **Which app + which screens?** (`apps/web` storefront, `apps/dashboard`, partner portal, or a single screen like checkout.) Name the exact screens and their order/flow.
2. **What's the brand/vibe?** Neutral wireframe is the default house style. Only add color/personality if they ask — and even then keep it a wireframe, not a hi-fi comp.
3. **What's on each screen?** The key sections, primary action per screen, and any data each shows (so the brief can map it to collections/fields).
4. **Any flows/states?** Empty states, loading, error, logged-in vs. guest, etc.

If the user already gave enough detail, skip straight to confirming a one-paragraph design plan
and proceed. Offer to sketch a quick single screen first for sign-off before building the full set.

**Boundary check (important):** if the design implies editing money-movement or routing internals
(`ledger-*`, `settlements`, routing engine, `payout-*`, `payments` provider adapters,
`compliance-checks`, `audit-logs`, auth/multi-tenant wiring), that's **shell** territory per
BUILDER-PLAYBOOK §0/§7. You can still *mock the screen*, but flag in the brief that wiring it is
platform work, not tenant work.

---

## Phase 2 — Build the mockup (self-contained wireframe HTML)

Create `docs/mockups/<name>.html` by copying the starter and house-style kit from
`references/mockup-template.html` in this skill folder. Rules — match the existing mockups exactly:

- **Self-contained**: one HTML file, inline `<style>` + the inline interactivity kit, **no external assets, no real data/backend**. It must open by double-click.
- **Clearly a mockup**: keep the dark page header, the `← Grove docs` back link to `../index.html`, the app-slug subtitle (e.g. `apps/web`), and the amber **"Mockup — not functional"** badge.
- **House primitives only**: reuse the template's classes — `.screen`/`.cap`/`.chrome`, wireframe `.ph`/`.line`/`.btn`/`.tag`, `.pgrid`, `.anno`, etc. Placeholders are grey blocks, not real images or copy.
- **One `.screen` per screen**, numbered, each with its route in `.cap .ref` (e.g. `/checkout`) and a faux browser `.chrome` URL (e.g. `acme.grove.app/checkout`).
- **Annotate the architecture inline**: every `.screen` carries `.anno` notes tying behavior to the platform (e.g. "server route recomputes totals from DB prices", "appends to localStorage cart", "gated on an eligibility compliance-check"). Mirror the tone in `storefront.html`.
- **Carry the mapping in markup**: add `data-grove-*` attributes to each `.screen` so the design is machine-readable for the handoff:
  - `data-grove-app` (e.g. `apps/web`), `data-grove-route` (e.g. `/products/[slug]`),
  - `data-grove-collections` (comma list, e.g. `products,orders,payments`),
  - `data-grove-components` (e.g. `Card,Button,Input`),
  - `data-grove-recipe` (`A` add-collection / `B` add-component / `none`),
  - `data-grove-layer` (`tenant` or `shell`).
- **Make it clickable (UI-only)**: paste the interactivity kit from `references/mockup-template.html` (the `<style>`+`<script>` block) **verbatim** at the very end of the file, before `</body>`. Wire interactions with its conventions — `.tab` + `data-panel` / `.tabpanel` for tabbed sections, sibling `.chip` for segmented toggles/filters, `.qty` steppers, `data-goto="#screen-2"` for cross-screen jumps. A floating screen-switcher auto-appears for multi-screen mockups. **No real data, no backend, no business logic** — UI affordances only.

After writing it, **add a mockup card to `docs/index.html`** under the "UI mockups" grid (copy an
existing `<a class="card mock">`), and **open the file in the browser** (Windows: `Start-Process`).

---

## Phase 3 — Hand it back (the build brief — this is the "send it back" step)

This is what makes the mockup buildable. Create `docs/mockups/<name>.build-brief.md` by filling in
`references/build-brief-template.md`. The brief translates the wireframe into Grove's architecture so
a future Claude session (or a junior dev) can implement it **without re-deriving anything**:

- **Per-screen implementation map**: screen → route file under `apps/web/src/` (or relevant app) → data source (exact collections + fields from DESIGN-BRIEF §3) → `@grove/ui` primitives to reuse → any new collection (Recipe A) or new component (Recipe B) → `tenant` vs `shell` layer.
- **Cross-cutting rules** that the implementation must honor (pulled from the canonical docs): server-authoritative pricing (never trust client amounts), money as **integer minor units + currency**, multi-tenant auto-scoping + the two registration spots, draft/publish for products & pages, idempotency keys on order creation, **100% test coverage**, types regenerated after schema changes.
- **Shell "do not touch" list** (BUILDER-PLAYBOOK §7) repeated so the implementer stays in bounds.
- **A ready-to-paste handoff prompt** at the bottom — the literal text the user pastes into a new Claude session to start implementation. It must point at the mockup file, the brief, and the canonical docs, and end by requiring `/check` to pass.
- **Definition of Done** mirroring the playbook (ACs met, tests added, `/check` green).

Finish by telling the user, in plain language: the mockup file, the brief file, the new docs card,
and **how to send it back** — i.e. paste the handoff prompt from the brief into Claude (this or a new
session) to implement it. Note explicitly if any screen crosses into shell territory.

---

## Guardrails

- **Mockups are clickable prototypes, not functional apps.** UI-only interactivity is expected (tabs, segmented toggles, qty steppers, in-page navigation, hover/active) via the inline kit — but **no real data, no backend calls, no business logic**. If the user wants it to actually work against data, that's the *implementation* step (the build brief), not the mockup.
- **Don't gold-plate.** Mock exactly the screens agreed in Phase 1.
- **Stay generic.** Use generic nouns (Partner, Supplier, Fulfillment, Eligibility) — never industry-specific terms in markup or brief, per DESIGN-BRIEF §1.
- **Match, don't fork, the house style.** If you think the wireframe kit should change, say so — don't silently diverge from the other mockups.
- **The brief describes; it does not implement.** This skill stops at a buildable spec. Implementation happens when the handoff prompt is run.
