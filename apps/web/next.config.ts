import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pexels.com',
      },
    ],
  },
  poweredByHeader: false,
} satisfies NextConfig

export default nextConfig
