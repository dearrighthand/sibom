'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ThumbsUp, ArrowRight } from 'lucide-react';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';
import { api } from '@/lib/api';
import { syncDeviceToken } from '@/lib/pushNotifications';

export default function CompletePage() {
  const hasStarted = useRef(false);
  const router = useRouter();
  const store = useRegistrationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const register = async () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      try {
        // Prepare data for API
        const registerData = {
          phone: store.phoneNumber,
          email: store.email,
          password: store.password,
          name: store.name,
          birthYear: store.birthYear,
          gender: store.gender,
          locMain: store.locMain,
          locSub: store.locSub,
          intro: store.intro,
          hobbies: store.hobbies,
          meetingType: store.meetingType,
          profileImage: store.profileImage,
        };

        console.log('Registering with:', registerData);

        if (!registerData.phone) {
          throw new Error('Phone number is missing. Please restart registration.');
        }

        const data = await api.post<{ access_token: string; user: { id: string } }>('/auth/register', registerData);
        console.log('Registration Success:', data);

        // Save token and user ID
        if (data.access_token) {
          localStorage.setItem('accessToken', data.access_token);
        }
        if (data.user?.id) {
          localStorage.setItem('userId', data.user.id);
        }
        await syncDeviceToken();

        // Capture data for display before resetting store
        setUserName(store.name || '');
        setProfileImageUrl(store.profileImage || null);

        // Clear store on success
        store.reset();
        setIsLoading(false);
      } catch (err: any) {
        console.error('Registration Error:', err);
        const errorMessage = err.response?.data?.message || (err instanceof Error ? err.message : 'An error occurred during registration.');
        setError(errorMessage);
        setIsLoading(false);
        // Allow retry by resetting the ref
        hasStarted.current = false;
      }
    };

    register();
  }, [store]);

  const handleClose = () => {
    // Clear store if needed?
    // For now just redirect
    router.push('/main');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FF8B7D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">프로필 생성 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">등록 실패</h2>
          <p className="text-gray-500 mb-6 word-keep-all">{error}</p>
          <button
            onClick={() => router.push('/auth/phone')}
            className="w-full bg-[#FF8B7D] text-white py-3 rounded-full font-bold shadow-md active:scale-95 transition-all"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Close Button UI Mockup */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
      >
        <X className="w-6 h-6 text-[#2D2D2D]" />
      </button>

      {/* Profile Image Circle with Dashed Border */}
      <div className="relative mb-8">
        {/* Dashed outer circle */}
        <div className="w-64 h-64 rounded-full border-2 border-dashed border-[#D1D5DB] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]"></div>

        {/* Profile Image */}
        <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 bg-gray-200">
          {profileImageUrl ? (
            <Image src={profileImageUrl} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-4xl">👤</span>
            </div>
          )}
        </div>

        {/* Like Badge */}
        <div className="absolute -bottom-2 -right-2 z-20 bg-[#FBF8E6] rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border-4 border-[#7D9D85] animate-in zoom-in duration-500 delay-300">
          <ThumbsUp className="w-8 h-8 text-[#FF8B7D] fill-[#FF8B7D] mb-1" />
          <span className="text-[10px] font-bold text-[#556B5A]">최고예요!</span>
        </div>
      </div>

      {/* Success Text */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h1 className="text-2xl font-bold text-[#556B5A] mb-2">{userName}님</h1>
        <h2 className="text-3xl font-extrabold text-[#2D2D2D] mb-6">프로필이 완성되었어요!</h2>
        <p className="text-[#666666] text-lg leading-relaxed">
          정성이 담긴 프로필 덕분에
          <br />곧 멋진 인연을 만나실 거예요 ✨
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleClose}
        className="w-full max-w-sm bg-[#7D9D85] text-white py-4 rounded-full text-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-[#6D8D75] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
      >
        인연 찾아보기 <ArrowRight className="w-6 h-6" />
      </button>

      <p className="text-gray-400 text-sm mt-6">언제든지 프로필을 수정할 수 있어요</p>
    </div>
  );
}
