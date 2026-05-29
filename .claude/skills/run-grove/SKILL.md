---
name: run-grove
description: Get the Grove app running on this computer, start to finish, for someone who has never coded before. Use when the user says things like "run the project", "start Grove", "I just want to see it working", "run it with Docker", "set this up", or "help me get this running". Covers two paths — an easiest Docker-only path (just Docker Desktop, no Node or pnpm) and the local way (Node + pnpm + Docker). Installs prerequisites, prepares config, starts the database, and launches all three apps in the browser.
---

# Run Grove (beginner-friendly)

Your job: get Grove running and visible in a web browser for a person who may have
**never written code or used a terminal before**. Be warm, plain-spoken, and patient.
Avoid jargon — when a technical word is unavoidable, explain it in one short phrase.

Grove is three small websites that run on the user's own computer:
- **http://localhost:3000** — the public store / marketing site
- **http://localhost:3001** — the staff dashboard
- **http://localhost:3002** — the admin area where content is edited (Payload CMS)

There is a one-command setup script (`pnpm setup`) that does most of the work. Your role
is to check the few things it can't install, run it, then start the app and confirm it loads.

> Tell the user up front: "This won't change any of your files. I'll check a few tools,
> set up local settings, start a database, and open the app in your browser."

---

## Two ways to run Grove — pick one

There are two paths to the same result. Offer the easier one first to a non-coder.

| Path | What's needed | When to use it |
|------|---------------|----------------|
| **Easiest — Docker only** | Just **Docker Desktop** (no Node, no pnpm to install) | A non-coder who just wants to see it working. One command runs the database and all three websites together. |
| **The local way** | **Node + pnpm + Docker**, then `pnpm setup` and `pnpm dev` | Someone who wants the apps running directly on their computer, or plans to do development work. |

- For the **Docker-only** path, jump to **"Docker-only path"** lower in this guide.
- For the **local way**, continue with **Step 1** right below.

Both end with the same three websites at the same three addresses (3000, 3001, 3002).

---

## Step 1 — Make sure three tools are installed

The setup script needs three things on the computer. Check each one, and if it's missing,
give the user the download link and **stop** so they can install it. Don't try to install
these for them — they need a normal app installer.

Check all three with these commands (they just print version numbers):

```bash
node --version
pnpm --version
docker --version
```

If a command errors or is "not recognized", that tool is missing. Here's what to tell the user:

| Tool | What it's for (in plain words) | How to get it |
|------|-------------------------------|---------------|
| **Node.js** (version 20+) | The engine that runs the website code | Download the **LTS** version from **https://nodejs.org** and run the installer. |
| **pnpm** | Fetches the code libraries the project depends on | After Node is installed, run: `npm install -g pnpm` |
| **Docker Desktop** | Runs the database that stores the app's data | Download from **https://www.docker.com/products/docker-desktop** then open the app once so it finishes starting. |

Notes to share if relevant:
- After installing Node or Docker, the user may need to **close and reopen** their terminal
  (or restart the computer) before the commands are recognized.
- **Docker must be running**, not just installed. Check with `docker info` — if it errors,
  tell them to open the **Docker Desktop** app and wait until it says "Running".
- On **Windows**, Docker Desktop may ask to enable "WSL 2" — that's normal; accept it.

When all three checks pass, say so plainly ("Great — all three tools are ready") and continue.

---

## Step 2 — Run the setup script

This single command checks the tools again, writes the local config files, starts the
database, and downloads all the code libraries. The first run can take a few minutes
(it downloads a lot); later runs are fast.

```bash
pnpm setup
```

Tell the user roughly what's happening while it runs ("It's downloading the project's
building blocks — this is the slow part, only the first time"). The script prints clear
`OK` / `NOTE` / `STOP` lines. If it ends with `STOP`, read the hint it printed, fix that
one thing with the user, and run `pnpm setup` again.

The script creates `.env.local` files with a random security secret and **leaves Auth0
login values blank on purpose**. That's fine — the apps still start; only the sign-in
features stay off until those values are filled in. Don't block on this.

---

## Step 3 — Start the app

Start all three websites at once:

```bash
pnpm dev
```

Run this so it keeps running in the background, then wait a few seconds for it to boot.
Tell the user it's starting and that the terminal will keep showing live logs — that's
normal, it means the app is alive.

Once it's up, point them to the browser:

> "It's running. Open these in your web browser:
> - http://localhost:3000 — the public store
> - http://localhost:3001 — the staff dashboard
> - http://localhost:3002 — the admin / content editor"

If you can, open one of the URLs for them to confirm it loads.

---

## Step 4 — Show them the big picture (optional but nice)

There's a visual map of how everything fits together and how content/code moves through
the system. Offer to open it:

```
docs/architecture.html
```

Tell them they can double-click that file to open it in any browser — no setup needed.

---

## Docker-only path (the easiest way — no Node, no pnpm)

Use this if the user just wants to see Grove working and doesn't want to install
developer tools. Everything — the database **and** all three websites — runs inside
Docker. The only thing they need installed is **Docker Desktop**.

> Tell the user: "We'll run the whole thing inside Docker. You don't need to install
> Node or anything else — just Docker Desktop. The first time is slow because it builds
> everything once; after that it's quick."

### A — Make sure Docker Desktop is installed and running

Docker is the one tool this path needs ("a program that runs the app in a tidy,
self-contained box").

- If it's not installed, download it from **https://www.docker.com/products/docker-desktop**
  and run the installer.
- **Open the Docker Desktop app and wait until it says "Running."** Installed isn't
  enough — it has to be running. You can confirm with `docker info` (if that errors,
  Docker isn't up yet).
- On **Windows**, Docker Desktop may ask to enable "WSL 2" — that's normal; accept it.

### B — Start everything with one command

From the project folder, run:

```bash
docker compose -f docker-compose.full.yml up
```

In plain words: this builds a small "box" with everything the app needs inside it,
starts the database, and starts all three websites — all at once. **The first run is
slow** (several minutes: it builds the box and downloads the project's building blocks).
Later runs are fast because that work is reused.

Tell the user the terminal will keep showing live logs and won't return to a normal
prompt — that's expected, it means the app is alive. Let it keep running.

### C — Open the three websites

Once the logs settle and show the apps are ready, point them to the browser:

> "It's running. Open these in your web browser:
> - http://localhost:3000 — the public store
> - http://localhost:3001 — the staff dashboard
> - http://localhost:3002 — the admin / content editor"

The first time you open each page it takes a few seconds to compile — wait, then refresh
if needed. As with the other path, Auth0 sign-in values are blank by default, so the
apps start fine; only the sign-in features stay off until those are filled in.

### D — Editing files updates the site automatically

The project folder on the computer is shared into the running box, so if the user (or
you) saves a change to a file, the running website updates on its own — no restart
needed. This is called "hot reload."

### E — Stopping, restarting, and resetting

- **To stop everything:** press **Ctrl + C** in the terminal running the command.
- **To start again next time:** the same one command —
  `docker compose -f docker-compose.full.yml up` (fast now, no rebuild).
- **To wipe the database and downloaded packages and start clean:**
  `docker compose -f docker-compose.full.yml down -v`. Only do this if they want a
  fresh start — it erases the local data.

---

## Stopping and restarting later (the local way)

*(If you used the Docker-only path, see section E above instead.)*

- **To stop the app:** press **Ctrl + C** in the terminal window running `pnpm dev`.
- **To stop the database too:** run `docker compose down`.
- **To start again next time:** they only need `pnpm dev` (setup is a one-time thing,
  unless they delete the project or move it).

---

## When something goes wrong — common fixes

Walk through these calmly; most issues are one of these:

- **"command not found" / "not recognized"** → the matching tool from Step 1 isn't
  installed, or the terminal needs to be closed and reopened after installing it.
- **Docker errors / "Cannot connect to the Docker daemon"** → Docker Desktop isn't
  running. Open the app, wait for "Running", retry. (Applies to both paths — the
  Docker-only path needs Docker running too.)
- **"port 3000 (or 3001/3002/5432) is already in use"** → another program (or an old
  copy of this app) is using that port. Close the other program, or stop the old run
  with Ctrl + C, then try again. (This applies whether you started with `pnpm dev` or
  `docker compose ... up`.)
- **`pnpm setup` says STOP** → it always prints why on the line above. Fix that one thing.
- **A page won't load right after starting** → the apps take a few seconds to compile the
  first time. Wait, then refresh the browser.
- **Docker-only path is stuck or acting strange after a change** → stop it with Ctrl + C
  and start it again. If it's still off, reset with
  `docker compose -f docker-compose.full.yml down -v` and run the start command again
  (note: that erases the local data).

Always end by confirming what the user can now see in their browser, in one sentence.
