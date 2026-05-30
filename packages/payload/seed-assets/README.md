# Seed assets

Committed source data for the Highgrove catalogue, imported into the `media` and
`products` collections so the storefront renders real CMS-managed images.

## `packs/`

The three brand packs that make up the Highgrove catalogue — `litt-edibles`,
`710-nomad-rosin`, `blinkers-flip` — each as a `products.csv` plus a `photos/`
folder of web-optimized JPEGs.

- Produced from the downloaded zips by `apps/web/scripts/prep-packs.mjs`
  (`pnpm --filter @grove/web seed:images` is gone; run prep-packs directly).
- Imported into the Highgrove tenant by `apps/web/scripts/import-packs.mjs`
  (`pnpm --filter @grove/web import:packs`): uploads each photo into Media and
  upserts the product with `featuredImage` set.

Uploaded files themselves live in `packages/payload/media/` (gitignored).
