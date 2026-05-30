import { spawnSync } from "child_process";

// Apply Payload migrations as part of the Vercel build, so the database schema
// is in place before the app serves traffic. Guarded to run ONLY on Vercel —
// local builds and CI (which have no production DB) skip it cleanly.

if (process.env.VERCEL !== "1") {
  console.log("[deploy-migrate] not on Vercel — skipping migrations");
  process.exit(0);
}

// Prefer a direct (non-pooled) connection for DDL; fall back to whatever exists.
const dbUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!dbUrl) {
  console.log("[deploy-migrate] no database URL found — skipping migrations");
  process.exit(0);
}

console.log("[deploy-migrate] running payload migrate against the deploy database…");

const result = spawnSync(
  "node",
  [
    "--require",
    "./scripts/payload-compat.cjs",
    "--import",
    "tsx",
    "./node_modules/payload/bin.js",
    "migrate",
  ],
  { stdio: "inherit", env: { ...process.env, DATABASE_URL: dbUrl } },
);

process.exit(result.status ?? 1);
