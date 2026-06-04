# Working Agreement

These are the house rules every Grove ticket follows. The skills (`/setup`,
`/work-feature`) and the task commands (`/next-task`, `/done`) all point back
here so the rules live in one place. If you only read one doc before starting a
ticket, read this one.

The audience is a team that has **never coded before**. The rules exist to make
the work safe, reviewable, and teachable — not to slow you down.

## The six rules

1. **Plan first.** Read the ticket. Restate what you're building in your own
   words and list your assumptions *before* writing any code. If the ticket is
   ambiguous, ask — don't guess. A wrong plan wastes more time than a slow one.

2. **One worktree per ticket.** Each ticket is built in its own isolated git
   worktree so the `main` branch always stays clean and you can throw work away
   without fear. Never build two tickets in the same working copy.

3. **Tasks become a todo list.** Turn the ticket's task checklist into a visible
   todo list and work it top to bottom. One item in progress at a time. This is
   how you (and anyone watching) always know where you are.

4. **Every feature needs a red→green test.** Write at least one test that
   **fails before** your change and **passes after** it — that's the proof your
   change is real and does something. Add one more test for the guard / negative
   path (the "what if it's missing or wrong?" case). No feature ships on faith.

5. **Stay on the ticket.** A ticket builds exactly one feature. If you spot
   something else worth doing, **park it** (note it for a future ticket) and keep
   going. Scope creep is how small tickets become unfinishable ones.

6. **`/check` before `/done`.** Run `/check` (lint + type-check + tests, with the
   100% coverage gate) and get it green before you mark a ticket done. "Done"
   means *verified*, not *probably works*.

## Why these rules

- **Plan-first + stay-on-ticket** keep each change small enough to review and
  understand. Small changes are where beginners succeed.
- **Worktree-per-ticket** means a mistake is never catastrophic — you can delete
  the worktree and start over. `main` is never at risk.
- **Red→green tests** are the single habit that separates "it ran once on my
  machine" from "it works." They also document what the feature is supposed to
  do.
- **`/check` before `/done`** keeps the whole repo green for the next person, who
  might be you tomorrow.

## Where tasks live

Tasks live in the **Linear** board "Grove Platform". Notion holds specs and
strategy. Use `/next-task` to pull the next ticket and `/done` to close it out.
(The board content and the order to build it in is described in
[`board-plan.md`](./board-plan.md).)
