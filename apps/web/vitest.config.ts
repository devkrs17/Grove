import { defineConfig } from "vitest/config";

export default defineConfig({
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
