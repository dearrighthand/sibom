'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useRegistrationStore } from '@/stores/useRegistrationStore';
import { syncDeviceToken } from '@/lib/pushNotifications';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setProfileData, setKakaoId } = useRegistrationStore();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.push('/login');
      return;
    }

    const loginWithKakao = async () => {
      try {
        const data = await api.post<{
          isRegistered: boolean;
          access_token?: string;
          user?: { id: string };
          kakaoId?: string;
          email?: string;
          name?: string;
          profileImage?: string;
        }>('/auth/kakao', { code });

        if (data.isRegistered && data.access_token) {
          // Login success
          localStorage.setItem('accessToken', data.access_token);
          if (data.user?.id) {
            localStorage.setItem('userId', data.user.id);
          }
          await syncDeviceToken();
          router.push('/main');
        } else {
          // Need registration
          if (data.kakaoId) setKakaoId(data.kakaoId);
          
          setProfileData({
            email: data.email,
            name: data.name || '',
            profileImage: data.profileImage || null,
          });

          router.push('/auth/phone');
        }
      } catch (error) {
        console.error('Kakao login failed:', error);
        alert('카카오 로그인에 실패했습니다.');
        router.push('/login');
      }
    };

    loginWithKakao();
  }, [router, searchParams, setProfileData, setKakaoId]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FEE500] border-t-transparent" />
        <p className="text-gray-500 font-medium">카카오 로그인 중...</p>
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
