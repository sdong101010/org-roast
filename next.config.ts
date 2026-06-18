import type { NextConfig } from "next";

const isDemoBuild = process.env.NEXT_PUBLIC_DEMO_MODE === "1";

const nextConfig: NextConfig = isDemoBuild
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {};

export default nextConfig;
