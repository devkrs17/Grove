import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@payload-config": path.resolve(__dirname, "src/payload.config.ts"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/app/api/**/*.ts"],
      exclude: ["src/app/api/**/*.test.ts"],
      thresholds: {
        functions: 100,
        lines: 100,
      },
    },
  },
});
