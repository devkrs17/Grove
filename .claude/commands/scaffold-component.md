Scaffold a new UI component in packages/ui following existing patterns.

## Usage
`/scaffold-component <ComponentName>`

## Steps

1. Read an existing component for the pattern: `packages/ui/src/components/button.tsx`
2. Read its test: `packages/ui/src/components/button.test.tsx`
3. Read the utils: `packages/ui/src/lib/utils.ts`
4. Create the component at `packages/ui/src/components/<name>.tsx`:
   - Use `React.forwardRef` for DOM element wrappers
   - Use `cn()` from `../lib/utils` for className merging
   - Use `cva` (class-variance-authority) for variant styling if applicable
   - Props interface extends the relevant HTML element attributes
   - Export the component and its props type
5. Create the test at `packages/ui/src/components/<name>.test.tsx`:
   - Use React Testing Library (`@testing-library/react`)
   - Test rendering, variants, className merging, ref forwarding
   - 100% coverage
6. Export from the package index if one exists
7. Run `cd packages/ui && pnpm test` to verify

## Conventions

- File names are kebab-case (e.g., `date-picker.tsx`)
- Component names are PascalCase (e.g., `DatePicker`)
- Radix UI for behavior, Tailwind for styling
- All components must be accessible (proper ARIA attributes)
