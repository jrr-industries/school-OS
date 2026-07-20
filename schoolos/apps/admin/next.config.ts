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
};

export default nextConfig;
