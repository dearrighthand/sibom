import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sibom/shared'],
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-2668918858ad4c5482a00178c24fcb7a.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

export default nextConfig;
