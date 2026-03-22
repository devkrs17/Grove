import { readFileSync } from "fs";

// Load .env
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  if (key && !process.env[key]) process.env[key] = rest.join("=");
}

const { generateTypes } = await import("payload/node");
const { default: configPromise } = await import("../src/payload.config.ts");
const config = await configPromise;

await generateTypes(config);
console.log("Payload types generated successfully");
process.exit(0);
