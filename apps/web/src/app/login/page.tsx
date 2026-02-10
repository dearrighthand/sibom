'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';

// ... (imports)
import { syncDeviceToken } from '@/lib/pushNotifications';

export default function LoginPage() {
  const router = useRouter();
  const { alert: openAlert } = useDialog();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure AdMob is hidden on the login page
    if (Capacitor.isNativePlatform()) {
        AdMob.hideBanner().catch(() => {});
        AdMob.removeBanner().catch(() => {});
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.post<{ access_token: string; user: { id: string } }>('/auth/login', { email, password });

      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }
      
      // Sync device token if available
      try {
        await syncDeviceToken();
      } catch (e) {
        console.error('Failed to sync device token', e);
      }

      router.push('/main');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Login error:', error);
      openAlert('아이디와 비밀번호를 확인해주세요');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12">
      {/* 1. Top Section: Logo */}
      <div className="mb-12 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
            <Image
                src="/images/logo-full.png"
                alt="SIBOM"
                width={360}
                height={144}
                priority
                className="h-40 w-auto object-contain"
            />
        </div>
      </div>

      {/* 2. Primary Action: Kakao Login */}
      <div className="w-full max-w-sm mb-12">
        <button
          type="button"
          onClick={() => {
            const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
            const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || 'http://localhost:3000/auth/kakao/callback';
            if (!REST_API_KEY) {
              openAlert('카카오 클라이언트 ID가 설정되지 않았습니다.');
              return;
            }
            const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
            window.location.href = kakaoURL;
          }}
          className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#FFE812] px-6 py-4 text-[#3C1E1E] shadow-sm transition-transform active:scale-95 hover:bg-[#FDD835]"
        >
          <MessageCircle className="h-6 w-6 fill-[#3C1E1E] text-[#3C1E1E]" />
          <span className="text-lg font-bold">카카오로 3초 만에 시작하기</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-8 flex w-full max-w-sm items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative bg-white px-4">
            <span className="text-sm text-gray-400">또는 이메일로 로그인</span>
        </div>
      </div>

      {/* 3. Secondary Section: Email Login Form */}
      <form className="flex w-full max-w-sm flex-col gap-4" onSubmit={handleLogin}>
        <div className="space-y-4">
            <div>
                <label htmlFor="email" className="sr-only">이메일</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소"
                    required
                    className="min-h-[56px] w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-lg text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FF8B7D] focus:bg-white focus:ring-1 focus:ring-[#FF8B7D]"
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    required
                    className="min-h-[56px] w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-lg text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FF8B7D] focus:bg-white focus:ring-1 focus:ring-[#FF8B7D]"
                />
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-xl bg-[#FF8B7D] px-6 py-4 text-white shadow-md transition-transform active:scale-95 hover:bg-[#FF7A6B] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="text-xl font-bold">{isLoading ? '로그인 중...' : '로그인'}</span>
        </button>
      </form>

      {/* 4. Bottom Links */}
      <div className="mt-8 flex items-center justify-center gap-4 text-base">
        <Link href="/auth/find-password">
            <span className="text-gray-500 hover:text-gray-800">비밀번호 찾기</span>
        </Link>
        <span className="h-4 w-px bg-gray-300"></span>
        <Link href="/auth/phone">
            <span className="font-semibold text-[#FF8B7D] hover:underline">회원가입</span>
        </Link>
      </div>
    </div>
  );
}
