Scaffold a new Payload collection following existing patterns.

## Usage
`/scaffold-collection <CollectionName>`

## Steps

1. Read an existing collection for the pattern: `packages/payload/src/collections/products.ts`
2. Read its test file: `packages/payload/src/collections/products.test.ts`
3. Read the access control helpers: `packages/payload/src/access.ts`
4. Create the new collection file at `packages/payload/src/collections/<name>.ts` following the same patterns:
   - Import from `payload` types
   - Use access control helpers from `../access`
   - If tenant-scoped, the multi-tenant plugin handles scoping automatically
   - If draft/publish, add `versions: { drafts: true }`
   - Export the collection config
5. Create the test file at `packages/payload/src/collections/<name>.test.ts`:
   - Test the collection config object directly (no DB needed)
   - Test access control functions
   - Test field definitions
   - Aim for 100% coverage
6. Register the collection in `packages/payload/src/index.ts`
7. Run `pnpm test` in `packages/payload` to verify
8. Run `pnpm generate:types` to update TypeScript types

## Conventions

- File names are kebab-case (e.g., `brand-configs.ts`)
- Collection slugs are kebab-case (e.g., `brand-configs`)
- All collections must have explicit access control — never default to open
- Every collection needs a test file with 100% coverage
