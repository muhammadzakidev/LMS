import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tp0co7f5l8.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://lms-production-a62c.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;