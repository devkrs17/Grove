# Board Plan — fresh, beginner-buildable Grove board

This document is the **source of truth for the Linear board**, written to be
applied by hand from a local session that has the Linear MCP. Nothing in the
remote/CI environment can mutate Linear, so the board is shipped here as a
runbook: a wipe checklist plus the full set of epics and tickets.

> **What this board is.** It is a **teaching rebuild**: an ordered path a team
> that has never coded before can follow top to bottom to rebuild this app from
> an empty starter. Most of these features already exist in *this* repo — the
> board is written against the blank **Sprout** starter (built in ticket T0.1),
> not as a to-do list for the current Grove repo. Read it as "here's how you'd
> build Grove again, one teachable step at a time."

Every ticket is built with the [`/work-feature`](../skills/work-feature/SKILL.md)
skill and follows the [working agreement](./working-agreement.md).

---

## Part 1 — Wipe the old board (run locally)

The current board has ~94 issues; we replace it wholesale.

1. **Confirm the target.** Project **"Grove Platform"**, team **KRI**.
   - Project id (from prior notes): `1d38840f-c711-4ad8-afeb-2843b0d3b2f3`
   - Team KRI id: `9c252ae7-...` (truncated — **verify both against your live
     workspace before deleting anything**).
2. **List everything:** `list_issues(project="Grove Platform")`. Capture the
   count (expect ~94) and the ids.
3. **Delete in batches** using the Linear issue-delete tool, a batch at a time,
   re-listing between batches so you can see progress.
4. **Verify empty:** `list_issues(project="Grove Platform")` returns **0**.
5. Only then proceed to Part 3 and create the fresh tickets.

> This is a **permanent delete** of all existing issues. Make sure the project id
> is correct and that nothing in the 94 still matters before you start.

---

## Part 2 — Ticket template

Every ticket's description uses this structure:

```markdown
## What you're building (plain English)
<one or two sentences a non-coder understands>

## Why it matters / what you'll learn
<the teaching hook — the concept this ticket teaches>

## Tasks
- [ ] <each task serves this one feature>
- [ ] ...

## How to do it
Run /work-feature. It puts you in a worktree, makes you plan first, and gives
you a todo list. Stay on THIS ticket; park unrelated ideas.

## Tests (required)
- [ ] A test that FAILS before your change and PASSES after (proves it's real)
- [ ] A test for the guard / negative path
- [ ] /check is green (lint + types + tests, 100% coverage)

## Acceptance criteria (Definition of Done)
<the observable end state>
```

Set **priority** descending by epic (EPIC 0 highest) and fill each ticket's
**`Depends on`** so `/next-task` always surfaces the right next ticket. With the
board freshly created and nothing started, `/next-task` should return **T0.1**.

---

## Part 3 — Epics & tickets (create in this order)

Create each EPIC as a parent issue, then its tickets as sub-issues. `Depends on`
is listed per ticket; priority descends by epic.

### EPIC 0 — Project setup (get the app on your screen)

- **T0.1 — Build the blank starter "Sprout"** · *Depends on: —*
  New **sibling repo** on disk at `C:\Users\kreyes33\Source\Personal\sprout`, its
  own fresh git repo. Monorepo skeleton (`apps/web`, `packages/{payload,ui,config}`),
  Payload **blank example**, **one** example feature built the
  mock→schema→route way (`example-mock.html` → example schema → live route with
  scoped CSS), the `.claude/skills` copied in, and a README that explains
  install-and-run in one command. *(This is ticket #1 — the thing the whole
  board teaches you to extend.)*
- **T0.2 — First run** · *Depends on: T0.1*
  Run `/setup`: install deps, start Postgres, write `.env`, seed, run dev. App
  loads at `http://localhost:3000`.
- **T0.3 — Codebase tour + green suite** · *Depends on: T0.2*
  Run `/check` and read the example feature end to end so you know the
  mock→schema→live shape before building your own.

### EPIC 1 — Payload CMS foundation

- **T1.1 — Payload + multi-tenant boot** · *Depends on: T0.3*
  Payload running with the multi-tenant plugin; `tenants` and `users` as global
  (not tenant-scoped) collections.
- **T1.2 — Sites collection** · *Depends on: T1.1*
  Per-tenant `sites` (domain config) + tests.
- **T1.3 — BrandConfig global** · *Depends on: T1.2*
  Per-tenant BrandConfig global (the theming source: colors) + tests.

### EPIC 2 — Storefront shell & theming

- **T2.1 — Hostname → tenant middleware** · *Depends on: T1.2*
  Resolve the tenant from the request host + tests.
- **T2.2 — StorefrontRoot + theming** · *Depends on: T1.3, T2.1*
  `StorefrontRoot` injects BrandConfig colors as CSS variables on `.storefront`;
  `kit.css` base palette.
- **T2.3 — Home page end to end** · *Depends on: T2.2*
  The reference feature: mock → homepage schema → live route. This is the model
  every later page copies.

### EPIC 3 — Product catalog

- **T3.1 — Products collection** · *Depends on: T1.2*
  Products with storefront fields + tests.
- **T3.2 — Media collection** · *Depends on: T1.2*
  Per-site uploads + tests.
- **T3.3 — Shop / listing page** · *Depends on: T2.3, T3.1*
- **T3.4 — Product detail page (PDP)** · *Depends on: T3.3, T3.2*

### EPIC 4 — Content pages

- **T4.1 — Pages collection (draft/publish)** · *Depends on: T1.2*
- **T4.2 — Render content pages** · *Depends on: T2.3, T4.1*

### EPIC 5 — Cart (no checkout)

- **T5.1 — Client-side cart + cart page** · *Depends on: T3.4*

### EPIC 6 — Onboard a tenant & deploy

- **T6.1 — Seed one demo client end to end** · *Depends on: T2.3, T3.4, T4.2, T5.1*
- **T6.2 — Tenant onboarding runbook** · *Depends on: T6.1*
  Drives the `/onboard-client` skill.
- **T6.3 — Deploy** · *Depends on: T6.1*
  Committed migrations + seed-if-empty → Vercel + Neon.

---

**Totals:** 7 epics (EPIC 0–6) / 19 tickets (down from ~94). Priorities descend by epic;
each ticket's `Depends on` makes the build order explicit and keeps `/next-task`
honest.
