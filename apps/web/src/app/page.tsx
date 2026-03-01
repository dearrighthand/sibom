'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Ensure AdMob is hidden on the landing page
    if (Capacitor.isNativePlatform()) {
        AdMob.hideBanner().catch(() => {});
        AdMob.removeBanner().catch(() => {});
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push('/main');
    }
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/start-bg.jpg"
          alt="Happy senior couple"
          fill
          priority
          className="object-cover object-center brightness-75"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-between px-6 py-12 text-white">
        {/* Header / Logo */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <Image
            src="/images/logo-full.png"
            alt="SIBOM"
            width={600}
            height={240}
            priority
            className="h-40 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Main Content */}
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="mb-2 text-3xl font-bold leading-tight drop-shadow-md md:text-4xl lg:text-5xl">
            50대 이후,
            <br />
            새로운 인연을 만나보세요
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full max-w-md flex-col gap-4">
          {/* KakaoTalk Button */}
          {/* KakaoTalk Button */}
          <button 
            onClick={() => {
              const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
              const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || 'http://localhost:3000/auth/kakao/callback';
              if (!REST_API_KEY) {
                alert('카카오 클라이언트 ID가 설정되지 않았습니다.');
                return;
              }
              const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
              window.location.href = kakaoURL;
            }}
            className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#FFE812] px-6 py-4 text-[#3C1E1E] shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="h-6 w-6 fill-[#3C1E1E] text-[#3C1E1E]" />
            <span className="text-lg font-bold">카카오톡으로 시작하기</span>
          </button>

          {/* Phone Number Button */}
          <Link href="/auth/phone" className="w-full">
            <button className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-white/20 px-6 py-4 text-white backdrop-blur-sm shadow-lg transition-all hover:bg-white/30 active:scale-95 border border-white/30">
              <Phone className="h-6 w-6 fill-white text-white" />
              <span className="text-lg font-bold">휴대폰 번호로 시작하기</span>
            </button>
          </Link>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <span className="text-base text-gray-200">이미 가입하셨나요? </span>
            <Link
              href="/login"
              className="font-semibold text-white underline decoration-1 underline-offset-4 hover:text-gray-100"
            >
              로그인
            </Link>
          </div>

          {/* Terms and Privacy Links */}
          <div className="mt-6 flex justify-center gap-4 text-sm" style={{ paddingBottom: 'calc(1.5rem + var(--safe-area-inset-bottom, 0px))' }}>
            <Link
              href="/terms"
              className="text-gray-300 underline decoration-1 underline-offset-2 hover:text-white"
            >
              서비스 이용약관
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/privacy"
              className="text-gray-300 underline decoration-1 underline-offset-2 hover:text-white"
            >
              개인정보처리방침
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
