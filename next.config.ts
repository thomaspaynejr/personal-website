import type { NextConfig } from "next";

console.log("NEXT_CONFIG_LOADED: applying 20MB limit");
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
