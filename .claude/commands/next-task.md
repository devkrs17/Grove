Fetch the next task to work on from the Linear "Grove Platform" board.

> Run this from a **local** session that has the Linear MCP. The remote/CI
> environment cannot reach Linear.

## How to find the next task

1. Read `.claude/docs/board-plan.md` to understand the epics, the build order,
   and the `Depends on` chain.
2. List the board's issues: `list_issues(project="Grove Platform")` (team KRI).
3. For each candidate, check its Status and `Depends on`.
4. Pick the next ticket:
   - Anything **In Progress** or **Blocked** first (finish or unblock it).
   - Else the highest-priority **Todo** ticket whose dependencies are all Done.
   - Else the highest-priority **Backlog** ticket whose dependencies are met.
5. Show: ticket id, title, epic, priority, `Depends on`, and acceptance criteria.
6. Fetch the full issue so you have all the details, then start it with
   `/work-feature`.

## Priority order

1. In Progress / Blocked (unblock or finish)
2. Todo, highest priority first
3. Backlog tickets with met dependencies

## Notes

- On a freshly created board, this should return **T0.1 (Build the blank starter
  "Sprout")** — it has no dependencies and the highest priority.
- Priorities descend by epic (EPIC 0 highest), so the chain in `board-plan.md`
  is the tie-breaker.
