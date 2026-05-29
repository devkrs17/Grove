Find the next task to work on from the Linear **Grove Platform** project and show me its full details.

## Where the work lives
- Tasks are in **Linear**, not Notion. Project: **Grove Platform** (team `KRI`) — https://linear.app/kristian-reyes/project/grove-platform-00a1e8d90443
- Use the Linear MCP tools (`list_issues`, `get_issue`). Load them via ToolSearch first: `select:mcp__claude_ai_Linear__list_issues,mcp__claude_ai_Linear__get_issue`.
- The board has two layers (labels): **`layer:tenant`** = launch-a-product work for the tenant builder / vibe coder (mostly CMS, little code); **`layer:shell`** = platform/engine work.

## Default behavior (tenant builder)
By default, find the next **`layer:tenant`** task — that's the vibe-coder track (the "Tenant Onboarding" epic, KRI-80).
- If the user typed `/next-task shell`, target `layer:shell` (platform) work instead.
- If the user typed `/next-task any`, ignore the layer filter.

## Steps
1. `list_issues` with `project: "Grove Platform"`, the chosen `label` (default `layer:tenant`), `state: "Todo"`, ordered by priority. Linear filters reliably by state/label/priority — use them (no semantic guessing needed).
2. If nothing is in **Todo**, repeat with `state: "Backlog"` and pick the highest-priority issue whose `blockedBy` dependencies are all complete.
3. Prefer lower-numbered sub-issues within the same epic (they're ordered for top-down work, e.g. "1 · …", "2 · …").
4. `get_issue` on the top candidate to pull its full description, acceptance criteria, estimate, labels, parent epic, and git branch name.
5. Show: identifier (KRI-###), title, milestone, priority, estimate, labels (incl. layer), parent epic, blockedBy (if any), and the full Acceptance Criteria + Definition of Done.
6. Remind me of the loop: branch (`gitBranchName` from the issue) → build (follow the ticket + `docs/platform/BUILDER-PLAYBOOK.md`) → `/check` → PR (fill the checklist) → `/done`.
