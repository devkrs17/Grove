---
name: setup
description: Use to install and run the Grove (or Sprout) app for the first time, or when "it won't start" — checks prerequisites, installs dependencies, starts Postgres, writes .env, seeds the database, and runs the dev server so the storefront loads at http://localhost:3000. Beginner-proof, one step at a time.
---

# Setup — install & run the app

This skill gets the app onto your screen from a fresh clone, **one step at a
time**. It assumes you have never set up a dev environment before. Each step says
**what it does**, **why**, and **what success looks like** so you always know
whether to continue or stop and ask.

If any step's "success looks like" check fails, stop and fix that step before
moving on — every later step depends on the earlier ones.

> House rules for any work after setup live in
> [`.claude/docs/working-agreement.md`](../../docs/working-agreement.md).

## Before you start: what you need installed

You need three tools on your machine. Check each — don't install what's already
there.

| Tool | Check command | Why we need it |
| --- | --- | --- |
| **Node.js 20+** | `node --version` | Runs the JavaScript/TypeScript app. |
| **pnpm** | `pnpm --version` | Installs and links the monorepo's packages. If missing: `npm install -g pnpm`. |
| **Docker** | `docker --version` | Runs the PostgreSQL database in a container so you don't install Postgres by hand. |

**Success looks like:** all three commands print a version number.

## Step 1 — Install dependencies

```bash
pnpm install
```

**What it does:** downloads every package the apps need and links the workspace
packages (`@grove/ui`, `@grove/payload`, `@grove/types`) together.
**Why:** nothing can run until the dependencies exist.
**Success looks like:** it finishes with no red `ERR_` lines; a `node_modules`
folder now exists at the repo root.

## Step 2 — Start the database

```bash
docker-compose up -d
```

**What it does:** starts PostgreSQL 16 in the background (`-d` = detached).
**Why:** Payload stores all content (tenants, products, pages) in Postgres; the
app can't boot without it.
**Success looks like:** `docker ps` shows a running `postgres` container. The
default connection string is
`postgresql://grove:grove_dev_password@localhost:5432/grove_dev`.

## Step 3 — Create your `.env`

Create a `.env` file (copy from `.env.example` if one exists) with these keys:

```
DATABASE_URL=postgresql://grove:grove_dev_password@localhost:5432/grove_dev
PAYLOAD_SECRET=dev-secret-change-me
SUPER_ADMIN_EMAIL=admin@example.com
```

**What it does:** tells the app how to reach the database (`DATABASE_URL`), gives
Payload a secret to sign login sessions (`PAYLOAD_SECRET`), and names the first
admin user (`SUPER_ADMIN_EMAIL`).
**Why:** these are read at startup; a missing `DATABASE_URL` or `PAYLOAD_SECRET`
stops the app from booting.
**Success looks like:** a `.env` file exists with all three keys filled in. Use
any non-empty string for `PAYLOAD_SECRET` in development.

> **Teach moment — environment variables.** Secrets and machine-specific values
> (like a database URL) don't belong in code, which is shared and committed.
> `.env` keeps them out of git and lets each developer/server have its own.

## Step 4 — Seed the database

The seed runs **automatically on first boot**: Payload's `onInit`
(`packages/payload/src/seed.ts`) detects an empty database (no users) and creates
the demo tenant — a Site, a BrandConfig, products, a homepage, and lab reports.
So in most cases you don't run a separate command — just start the dev server in
Step 5 and the seed fires once.

**Why:** an empty store renders nothing useful. The seed gives you a fully
onboarded demo tenant so you can see the finished design immediately.
**Success looks like:** on the first `pnpm dev`, the logs mention seeding /
creating the demo tenant. (On later runs the DB already has users, so it skips —
that's correct.)

## Step 5 — Run the app

```bash
pnpm dev
```

**What it does:** starts all apps — web (storefront) on **:3000**, dashboard on
:3001, cms admin on :3002.
**Why:** this is the running app.
**Success looks like:** the terminal shows the web app ready on port 3000 with no
crash.

## Step 6 — Open it

Open **http://localhost:3000** in your browser. You should see the demo
storefront, styled in the demo tenant's brand colors, listing its products. The
Payload admin is at **http://localhost:3002/admin** (log in with the
`SUPER_ADMIN_EMAIL`).

**You're set up.** Next: run `/check` to confirm the test suite is green, then
pull your first ticket with `/next-task`.

## If something went wrong

- **Port 3000 already in use:** another app is running there. Stop it, or find
  and kill the process on that port.
- **Database connection refused:** Step 2's container isn't running. Re-run
  `docker-compose up -d` and check `docker ps`.
- **`payload` / types errors after a schema change:** run `pnpm generate:types`.
- **Still stuck:** stop and ask — don't paper over a failing step.
