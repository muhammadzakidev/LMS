import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tp0co7f5l8.ufs.sh",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
