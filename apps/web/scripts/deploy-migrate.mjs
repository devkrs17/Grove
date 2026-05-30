import { spawnSync } from "child_process";
import { existsSync } from "fs";

// Build-time database bootstrap for Vercel. Runs BEFORE `next build` (see the
// "build" script in package.json) so the schema exists and the storefront is
// seeded before the app ever serves traffic — no flaky serverless schema-push
// and no racy onInit-at-runtime seeding.
//
// Three steps, all idempotent:
//   1. `payload migrate` — applies the committed migrations in src/migrations,
//      creating the full schema on a fresh DB (and a no-op on an up-to-date one).
//   2. seed-if-empty — seeds the Blinkers data ONLY when the DB has zero users,
//      so redeploys never duplicate rows or hit the unique-email constraint.
//   3. seed-lab-reports — backfills the per-product COAs when the lab_reports
//      table is empty (e.g. a DB first seeded before the lab-reports collection
//      existed, so seed-if-empty's zero-user check never repopulated it).
//
// Guarded to run ONLY on Vercel — local builds and CI (no production DB) skip
// cleanly.

if (process.env.VERCEL !== "1") {
  console.log("[deploy-migrate] not on Vercel — skipping migrate + seed");
  process.exit(0);
}

// Prefer a direct (non-pooled) connection for DDL; fall back to whatever exists.
const dbUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!dbUrl) {
  console.log("[deploy-migrate] no database URL found — skipping migrate + seed");
  process.exit(0);
}

// Run a Payload bin/tsx subprocess with the non-pooled DB URL injected.
function run(label, args) {
  console.log(`[deploy-migrate] ${label}…`);
  const result = spawnSync(
    "node",
    ["--require", "./scripts/payload-compat.cjs", "--import", "tsx", ...args],
    {
      // Feed "N" to stdin so `payload migrate` immediately DECLINES its interactive
      // "you've run Payload in dev mode — data loss will occur, proceed? (y/N)"
      // prompt instead of hanging ~5 min for input it can never get in CI. That
      // prompt only appears when the DB carries a dev-push marker; on a clean DB
      // there is no prompt and migrations run normally. The seed steps don't read
      // stdin, so this is a no-op for them.
      input: "N\n",
      stdio: ["pipe", "inherit", "inherit"],
      env: { ...process.env, DATABASE_URL: dbUrl },
    },
  );
  if (result.status !== 0) {
    console.error(`[deploy-migrate] ${label} failed (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
}

// Step 1: schema. With PAYLOAD_DB_PUSH=true Payload syncs the schema on boot, so
// there are no committed migrations to run — skip `migrate` in that case. Once
// migrations are committed (src/migrations) and push is off, this applies them.
if (process.env.PAYLOAD_DB_PUSH === "true") {
  console.log("[deploy-migrate] PAYLOAD_DB_PUSH=true — schema syncs on boot, skipping migrate");
} else if (!existsSync("./src/migrations")) {
  console.log("[deploy-migrate] no src/migrations directory — skipping migrate");
} else {
  run("running payload migrate", ["./node_modules/payload/bin.js", "migrate"]);
}

// Step 2: seed the storefront, but only if the database is empty.
run("seeding if empty", ["./scripts/seed-if-empty.mjs"]);

// Step 3: backfill per-product lab-report COAs if that table is empty. Idempotent
// — no-ops once the Blinkers tenant has lab reports.
run("seeding lab reports if missing", ["./scripts/seed-lab-reports.mjs"]);

process.exit(0);
