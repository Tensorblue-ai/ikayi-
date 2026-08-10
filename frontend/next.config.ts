import type { NextConfig } from "next";

const apiOrigin = (process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:5000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/assets/:path*",
        destination: `${apiOrigin}/api/assets/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/api/assets/**",
      },
    ],
  },
};

export default nextConfig;
