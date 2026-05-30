# Seed assets

Committed images the seed scripts upload into the `media` collection so the
Highgrove storefront has real CMS-managed product images (not just `imageId`
Unsplash references, some of which are stale).

These are **generated branded placeholders**, not photography. Regenerate them
with:

```bash
pnpm --filter @grove/web seed:images   # edits apps/web/scripts/generate-seed-images.mjs
```

Consumed by `packages/payload/src/seed.ts` (fresh DB via `onInit`) and
`apps/web/scripts/seed-highgrove.mjs` (idempotent reseed of an existing DB).
Uploaded files themselves live in `packages/payload/media/` (gitignored).
