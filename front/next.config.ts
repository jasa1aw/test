import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/tasks/:path*",
        destination: "http://localhost:3001/tasks/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "http://localhost:3001/auth/:path*",
      },
    ]
  },
};

export default nextConfig;
