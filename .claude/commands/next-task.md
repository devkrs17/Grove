Fetch the Notion project board at https://www.notion.so/7be2c45841954399b92ced74a494e3c8 and find the next task to work on.

## Lessons & Performance Notes

- **`view://` URLs CANNOT be fetched** — the Notion API returns a validation error. Instead, fetch the database and then use `notion-search` on the data source, or fetch individual ticket pages by ID.
- The data source is `collection://c2294908-28ff-4da9-9fee-5b45061427b5`.
- `notion-search` is semantic, NOT property-filtered. It cannot reliably filter by Status or Phase. Use it to find tickets by name/content, then fetch each page to check properties.
- If no "To Do" tasks exist, check "Backlog" for the highest-priority candidates (P0 first) and suggest promoting them.
- Do NOT spawn a sub-agent for this — fetch individual pages directly.

## Known Foundation Tickets (for quick lookup)

These are P0-Critical Foundation tickets. Fetch them directly to check status:
- PLT-20: Auth0 tenant setup — `326fcd29-ea34-81a1-ac94-d0281e36fd50`
- PLT-14: Payload CMS setup — `326fcd29-ea34-816c-a5c6-dbba57f33ba2` (Done)
- PLT-103: CI pipeline — `32bfcd29-ea34-8195-8b51-de392d2d564f` (Done in git, Backlog in Notion)
- PLT-114: Seed script — `32bfcd29-ea34-81f5-af9d-d29dfdf8cc28` (Done)
- PLT-154: Access control audit — `32bfcd29-ea34-816e-8312-e4201e79d645` (Done)

## Steps

1. Fetch the database at `https://www.notion.so/7be2c45841954399b92ced74a494e3c8` to get current schema.
2. Fetch known P0 Foundation tickets by page ID (see list above) to check their current status.
3. Also search the data source for "Foundation" to find any new tickets.
4. Find the highest-priority ticket with Status = "To Do". If none, find highest-priority "Backlog" ticket whose dependencies are met.
5. Show the top candidate with: Ticket ID, Name, Phase, Priority, Size, Type, Epic, Depends On, and Acceptance Criteria.
6. Fetch the full page for that ticket so I have all the details.
