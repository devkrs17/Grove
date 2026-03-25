import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/ui",
  "packages/payload",
  "apps/cms",
  "apps/web",
  "apps/dashboard",
]);
