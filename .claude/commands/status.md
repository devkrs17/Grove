Show the current project status: what's done, what's in progress, and what's next.

## Steps

1. Read `.claude/docs/board-plan.md` for the epics and build order.
2. Run `git log --oneline -20` to see recent work.
3. Run `pnpm test` to check the suite, and `pnpm check-types` for type errors.
4. From a **local** session with the Linear MCP, list the "Grove Platform" board
   (`list_issues(project="Grove Platform")`, team KRI) and find any **In
   Progress** or **Blocked** tickets. (In a remote session without Linear, note
   that the board can't be read here and summarize from git + tests only.)
5. Summarize:
   - What's been completed recently (from git log)
   - Current test / lint / type status
   - Any tickets in progress or blocked
   - The next logical ticket per the `board-plan.md` order and `Depends on` chain
     (use `/next-task` to pick it precisely).
