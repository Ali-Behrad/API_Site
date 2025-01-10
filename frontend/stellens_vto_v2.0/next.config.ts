import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.khanoumi.com",
        pathname: "/ProductImages/**"
      },
      {
        protocol: "https",
        hostname: "**.khanoumi.com",
        pathname: "/ColorGallery/**"
      }
    ]
  },
  rewrites: async () => [
    {
      source: "/api/upload",
      destination: "http://localhost:4000/upload"
    }
  ]
};

export default nextConfig;
