Show the current project status: what's done, what's in progress, and what's next.

## Steps

1. Read `.claude/docs/mvp.md` for the MVP scope.
2. Run `git log --oneline -20` to see recent work.
3. Run `pnpm test` to check if tests pass.
4. Run `pnpm check-types` to check for type errors.
5. Fetch any "In Progress" or "Review" tickets from Notion by searching the data source `collection://c2294908-28ff-4da9-9fee-5b45061427b5`.
6. Summarize:
   - What's been completed recently (from git log)
   - Current test/lint/type status
   - Any tickets in progress or review
   - What the next logical step is based on MVP scope
