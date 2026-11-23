import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose", "@aws-sdk/client-s3"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
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
