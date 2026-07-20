import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@schoolos/ui',
    '@schoolos/auth',
    '@schoolos/api',
    '@schoolos/database',
    '@schoolos/config',
    '@schoolos/types',
    '@schoolos/utils',
    '@schoolos/permissions',
    '@schoolos/hooks',
    '@schoolos/constants',
    '@schoolos/validation',
  ],
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ],
};

export default nextConfig;
