import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SIBOM (시봄) - 50대 이후, 설레는 인연의 시작',
    short_name: 'SIBOM',
    description: '50대 이상 시니어를 위한 프리미엄 소셜 데이팅, 동네 친구 만들기 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/images/favicon.ico',
        sizes: 'any', // generic fallback
        type: 'image/x-icon',
      },
      {
        src: '/images/logo-flower.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
