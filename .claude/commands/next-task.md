Fetch the next MVP task to work on from the Notion project board.

## How to find the next task

1. Read `.claude/docs/mvp.md` to understand what's in scope.
2. Read `.claude/docs/notion-links.md` to get the board data source ID and known ticket IDs.
3. Fetch each known MVP ticket by page ID to check its current status.
4. Search the data source (`collection://c2294908-28ff-4da9-9fee-5b45061427b5`) for "Foundation" and "Storefront" tickets.
5. Pick the highest-priority ticket with Status = "To Do". If none, find highest-priority "Backlog" ticket whose dependencies are met (check Depends On field).
6. Show: Ticket ID, Name, Phase, Priority, Size, Type, Depends On, and Acceptance Criteria.
7. Fetch the full page so I have all details.

## Priority order for MVP work

1. Anything currently "Blocked" or "In Progress" (unblock or finish it)
2. "To Do" tickets, highest priority first
3. "Backlog" Foundation/Storefront tickets with met dependencies

## Important

- Do NOT suggest tickets from Service Layer, AI Layer, or SEO phases — they're not MVP.
- `view://` URLs cannot be fetched. Use page IDs directly.
- notion-search is semantic, not property-filtered. Always fetch pages to verify Status.
