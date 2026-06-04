Fetch a specific ticket from the Linear "Grove Platform" board by id or title.

Usage: `/ticket KRI-123`  or  `/ticket "ticket title"`

> Run this from a **local** session that has the Linear MCP. The remote/CI
> environment cannot reach Linear.

Look up the issue in the Linear project **"Grove Platform"** (team **KRI**) and
show its full details: id, title, status, priority, epic (parent issue),
`Depends on`, the task checklist, tests, and acceptance criteria.

If only a title or partial id is given, list the close matches and confirm which
one before fetching the full issue.
