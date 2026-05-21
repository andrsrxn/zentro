import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    staleTimes: {
      static: 300,
      dynamic: 0,
    },
  },

  transpilePackages: ['@zentro/constants', '@zentro/schemas', '@zentro/utils'],
  typedRoutes: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dq5nfyajn/**',
        port: '',
        search: '',
      },
    ],
  },
} satisfies NextConfig

export default nextConfig
