import { readFileSync } from "fs";

// One-off / backfill: seed the per-product lab-report COAs into an ALREADY-populated
// database (e.g. production, whose lab_reports table exists via schema-push but was
// never seeded — seed-if-empty only seeds a zero-user DB). Idempotent: no-ops if the
// Blinkers tenant already has lab reports. Boots Payload with onInit disabled so it
// does not trigger the full seed. Run with NODE_ENV=production against a remote DB so
// it never schema-pushes:
//   NODE_ENV=production DATABASE_URL=<url> pnpm --filter @grove/web exec \
//     node --require ./scripts/payload-compat.cjs --import tsx scripts/seed-lab-reports.mjs

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
const { seedLabReports } = await import("@grove/payload");

const config = await configPromise;
const payload = await getPayload({ config, disableOnInit: true });

const created = await seedLabReports(payload);
console.log(`[seed-lab-reports] done — created ${created} lab report(s)`);
process.exit(0);
