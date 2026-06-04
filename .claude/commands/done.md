Mark the current task as Done on the Linear "Grove Platform" board.

> Run this from a **local** session that has the Linear MCP. The remote/CI
> environment cannot reach Linear.

## Steps

1. If a ticket id or title was mentioned earlier in this conversation, use that.
2. If not, ask which ticket to mark as done.
3. Fetch the issue from Linear to confirm it exists and check its current status.
4. Confirm `/check` is green (lint + types + tests, 100% coverage) — "Done" means
   *verified*, per the [working agreement](../docs/working-agreement.md). If it
   isn't green, stop and say so rather than closing the ticket.
5. Update the issue's status to **Done**.
6. Confirm what was closed with the ticket id and title.

## Board info

- Board: Linear project **"Grove Platform"**, team **KRI**.
- Statuses: Backlog, Todo, In Progress, Done (and Blocked).
