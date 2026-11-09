import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: "432860894136-ro0l2rbbalflga35eh70f7ennj2vc7m0.apps.googleusercontent.com",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
