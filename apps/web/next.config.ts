import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@grove/ui", "@grove/payload"],
};

export default withPayload(nextConfig);
