import { readFileSync } from "fs";

// Load .env if present (local dev). In CI/prod the env is already populated,
// so a missing file is not an error.
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
const payload = await getPayload({ config });

await seed(payload);

console.log("Seed complete");
process.exit(0);
