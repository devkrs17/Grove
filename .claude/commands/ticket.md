Fetch a specific ticket from the Linear **Grove Platform** board by identifier or name.

Usage: `/ticket KRI-51`  or  `/ticket "add orders collection"`

## Steps
1. Load the Linear MCP tools via ToolSearch: `select:mcp__claude_ai_Linear__get_issue,mcp__claude_ai_Linear__list_issues`.
2. If given an identifier like `KRI-51`, call `get_issue` with that id.
3. If given a name/phrase, `list_issues` with `project: "Grove Platform"` and `query: "<phrase>"`, then `get_issue` on the best match.
4. Show the full issue: identifier, title, status, priority, estimate, labels (incl. `layer:*`), milestone, parent epic, blockedBy/blocks, the description with Acceptance Criteria + Definition of Done, and the `gitBranchName` to use.

Note: tasks live in Linear now (project https://linear.app/kristian-reyes/project/grove-platform-00a1e8d90443), not the old Notion board.
