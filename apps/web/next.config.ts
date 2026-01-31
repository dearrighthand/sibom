import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-2668918858ad4c5482a00178c24fcb7a.r2.dev',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['172.30.1.67:3000', '172.30.1.67:3001'],
  } as any, // Temporary cast until types are updated for Next.js 16
};

export default nextConfig;
