Scaffold a new Payload collection following existing patterns.

## Usage
`/scaffold-collection <CollectionName>`

## Payload Reference

Before writing any code, load the Payload skill for patterns and gotchas:
- `.claude/skills/payload/SKILL.md` — quick reference (security pitfalls, common fields, hooks)
- `.claude/skills/payload/reference/COLLECTIONS.md` — collection config patterns
- `.claude/skills/payload/reference/ACCESS-CONTROL.md` — access control patterns
- `.claude/skills/payload/reference/HOOKS.md` — hook patterns
- `.claude/skills/payload/reference/FIELDS.md` — all field types

## Steps

1. Read the Payload skill files above for context.
2. Read an existing collection for the Grove-specific pattern: `packages/payload/src/collections/products.ts`
3. Read its test file: `packages/payload/src/collections/products.test.ts`
4. Read the access control helpers: `packages/payload/src/access.ts`
5. Create the new collection file at `packages/payload/src/collections/<name>.ts` following the same patterns:
   - Import from `payload` types
   - Use access control helpers from `../access`
   - If tenant-scoped, the multi-tenant plugin handles scoping automatically
   - If draft/publish, add `versions: { drafts: true }`
   - Always pass `req` to nested operations in hooks (see skill: transaction atomicity)
   - Use `overrideAccess: false` when operating on behalf of a user
   - Export the collection config
6. Create the test file at `packages/payload/src/collections/<name>.test.ts`:
   - Test the collection config object directly (no DB needed)
   - Test access control functions
   - Test field definitions
   - Aim for 100% coverage
7. Register the collection in `packages/payload/src/index.ts`
8. Run `pnpm test` in `packages/payload` to verify
9. Run `pnpm generate:types` to update TypeScript types

## Conventions

- File names are kebab-case (e.g., `brand-configs.ts`)
- Collection slugs are kebab-case (e.g., `brand-configs`)
- All collections must have explicit access control — never default to open
- Every collection needs a test file with 100% coverage
