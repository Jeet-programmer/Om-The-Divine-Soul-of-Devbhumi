import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root (a parent pnpm-lock.yaml otherwise confuses inference)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
