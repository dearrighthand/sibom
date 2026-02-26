import type { NextConfig } from 'next';

// Vercel 배포시에는 일반 Next.js 모드 사용
// 로컬/Capacitor 빌드시에는 정적 export 모드 사용
const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  transpilePackages: ['@sibom/shared'],
  // Capacitor 모바일 앱 빌드용 설정 (Vercel에서는 비활성화)
  ...(!isVercel && {
    output: 'export',
    distDir: 'out',
  }),
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
