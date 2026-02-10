import type { Metadata, Viewport } from 'next';
import { DialogProvider } from '../context/DialogContext';
import { AppInitializer } from '../components/AppInitializer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SIBOM (시봄) - 50대 이후, 설레는 인연의 시작',
    template: '%s | SIBOM (시봄)',
  },
  description: '50대 이상 시니어를 위한 프리미엄 소셜 데이팅, 동네 친구 만들기 앱. 등산, 골프, 여행 등 취미를 공유할 중년 친구를 찾아보세요.',
  applicationName: 'SIBOM',
  authors: [{ name: 'DearRightHand' }],
  generator: 'Next.js',
  keywords: ['50대 만남', '중년 친구', '시니어 데이팅', '동네 친구', '등산 동호회', '골프 모임', '돌싱', '재혼', '중년 소개팅', '시봄'],
  referrer: 'origin-when-cross-origin',
  creator: 'DearRightHand Team',
  publisher: 'DearRightHand Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sibom-web.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SIBOM (시봄) - 50대 이후의 설렘',
    description: '은퇴 후 지루한 일상에 활력을 불어넣으세요. 검증된 시니어 회원들과의 안전한 만남, 시봄에서 시작하세요.',
    url: 'https://sibom-web.vercel.app',
    siteName: 'SIBOM (시봄)',
    images: [
      {
        url: '/images/og-image.png', // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'SIBOM - Senior Social Dating',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIBOM (시봄) - 50대 이후의 설렘',
    description: '중년의 품격에 맞는 프리미엄 매칭 서비스. 당신의 두 번째 청춘을 응원합니다.',
    images: ['/images/og-image.png'],
    creator: '@sibom_official',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        <DialogProvider>
            <AppInitializer />
            {children}
        </DialogProvider>
      </body>
    </html>
  );
}
