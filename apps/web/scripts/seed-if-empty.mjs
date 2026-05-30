import { readFileSync } from "fs";

// Idempotent build-time seed. Boots Payload with onInit DISABLED (so it does not
// double-seed via the config's onInit hook), then runs the Blinkers seed ONLY if
// the database has zero users. Safe to run on every deploy: a populated DB is
// left untouched, so redeploys never duplicate rows or trip the unique-email
// constraint. Invoked by deploy-migrate.mjs after `payload migrate`.

// Load .env if present (local/manual runs). On Vercel the env is already
// populated, so a missing file is not an error.
try {
  const envContent = readFileSync(".env", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && !process.env[key]) process.env[key] = rest.join("=");
  }
} catch {
  // no .env file — rely on the real environment
}

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../src/payload.config.ts");
const { seed } = await import("@grove/payload");

const config = await configPromise;
// disableOnInit: the config's onInit also seeds an empty DB; disabling it here
// means we own the seed decision and never run it twice in one process.
const payload = await getPayload({ config, disableOnInit: true });

const { totalDocs } = await payload.count({ collection: "users" });

if (totalDocs > 0) {
  console.log(`[seed-if-empty] ${totalDocs} user(s) present — skipping seed`);
  process.exit(0);
}

console.log("[seed-if-empty] empty database — seeding Blinkers storefront…");
await seed(payload);
console.log("[seed-if-empty] seed complete");
process.exit(0);
