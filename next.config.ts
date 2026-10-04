import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const monorepoRoot = path.resolve(__dirname, "../../..");
const inCopilotKitMonorepo = fs.existsSync(
  path.join(monorepoRoot, "pnpm-workspace.yaml"),
);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  typescript: { ignoreBuildErrors: true },
  ...(inCopilotKitMonorepo
    ? { turbopack: { root: monorepoRoot } }
    : {}),
};

export default nextConfig;
