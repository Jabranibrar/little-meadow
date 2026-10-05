import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hyscwpmfipqhxqpxkcai.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.ftcdn.net",
      },
    ],
  },
};

export default nextConfig;
