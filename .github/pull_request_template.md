<!-- See docs/platform/BUILDER-PLAYBOOK.md for the full workflow. -->

## What & why
<!-- One or two sentences. Link the Linear ticket: KRI-### -->
Closes KRI-

## Layer
- [ ] This is **tenant** work (`layer:tenant`) — products, theme, content, custom sections
- [ ] This is **shell/platform** work (`layer:shell`) — engine internals (needs platform review)

## Definition of Done
- [ ] Every item in the ticket's **Acceptance Criteria** is satisfied
- [ ] If I changed a Payload schema: ran `pnpm generate:types` and committed the result
- [ ] If I added/changed a collection: registered it in **both** `packages/payload/src/index.ts` **and** `apps/cms/src/payload.config.ts` (collections array **and** multi-tenant map)
- [ ] Added/updated tests beside the code (**100% coverage is enforced**)
- [ ] `/check` is **green** (lint + `check-types` + `test`)
- [ ] I did not touch shell internals (ledger, routing, payouts, settlements, compliance, auth) — or this is an approved `layer:shell` PR
- [ ] Money values are integer **minor units** (cents), not decimals

## Screenshots / preview (UI changes)
<!-- Drop a screenshot of the storefront/dashboard, or the mockup you matched (docs/mockups/) -->
