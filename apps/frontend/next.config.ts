import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // expose NEXT_PUBLIC_API_URL to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
