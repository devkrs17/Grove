import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/app/api/**/*.ts", "src/middleware.ts", "src/lib/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
      thresholds: {
        functions: 100,
        lines: 100,
      },
    },
  },
});
