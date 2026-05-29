Mark the current task as Done in the Linear **Grove Platform** board.

## Steps
1. Load the Linear MCP tool via ToolSearch: `select:mcp__claude_ai_Linear__save_issue,mcp__claude_ai_Linear__get_issue`.
2. Identify the ticket: use the `KRI-###` identifier mentioned earlier in this conversation (or the branch name `devkrs17/kri-###-...`). If none is clear, ask me which ticket.
3. Before closing, sanity-check the Definition of Done: acceptance criteria met and `/check` is green. If not, say so and don't close it.
4. `save_issue` with the issue `id` and `state: "Done"`. Confirm what was marked done (identifier + title).

Note: tasks live in Linear now (project https://linear.app/kristian-reyes/project/grove-platform-00a1e8d90443), not the old Notion board.
