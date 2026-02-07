'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft } from 'lucide-react';
import { RecommendationList } from '@/components/home/RecommendationList';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';

import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  quote: string;
  interests: string[];
  matchReason: string;
}

export default function MainPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const { alert } = useDialog();

  useEffect(() => {
    let isMounted = true;

    const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const adUnitId = process.env.NEXT_PUBLIC_ADMOB_AD_UNIT_ID!;
          // Ensure any existing banner is removed before showing a new one
          await AdMob.removeBanner().catch(() => {});
          
          if (!isMounted) return;

          await AdMob.showBanner({
            adId: adUnitId,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0, 
            adSize: BannerAdSize.ADAPTIVE_BANNER, 
          });
        } catch (err) {
          console.error('AdMob Show Banner Failed', err);
        }
      }
    };

    initAdMob();

    return () => {
      isMounted = false;
      if (Capacitor.isNativePlatform()) {
        AdMob.hideBanner().catch((err) => console.error('AdMob Hide Banner Failed', err));
        AdMob.removeBanner().catch((err) => console.error('AdMob Remove Banner Failed', err));
      }
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (currentFilters?: Record<string, unknown>) => {
       setIsLoading(true);
       try {
         const userId = localStorage.getItem('userId');
         
         if (!userId) {
             window.location.href = '/login';
             return;
         }

         const startTime = performance.now();
         
         let query = `/matches/recommendations?userId=${userId}`;
         
         // Apply Filters
         if (currentFilters) {
            if (currentFilters.ageMin) query += `&ageMin=${currentFilters.ageMin}`;
            if (currentFilters.ageMax) query += `&ageMax=${currentFilters.ageMax}`;
            if (currentFilters.distance) query += `&distance=${currentFilters.distance}`;
            if (currentFilters.interestCodes && Array.isArray(currentFilters.interestCodes)) {
                // Pass as comma separated
                query += `&interestCodes=${currentFilters.interestCodes.join(',')}`;
            }
         }
         
         // Parallel fetch
         const [recommendations, userProfile] = await Promise.all([
            api.get<Profile[]>(query),
            api.get<{ name: string }>(`/profiles/${userId}`)
         ]);

         const endTime = performance.now();
         console.log(`[Gemini Response Time] ${(endTime - startTime).toFixed(0)} ms`);
         
         // Shuffle profiles randomly and show only 3 at a time
         const shuffledProfiles = [...recommendations].sort(() => Math.random() - 0.5);
         setProfiles(shuffledProfiles.slice(0, 3));
         setUserName(userProfile.name);
         
       } catch (err: unknown) {
         const error = err as { response?: { status: number } };
         if (error.response?.status === 404) {
             console.error('Profile not found');
             return;
         }
         console.error(err);
       } finally {
         setIsLoading(false);
       }
  };

  const handleAction = async (direction: string, id: string) => {
    // Optimistically remove the profile from the list
    const removedProfile = profiles.find(p => p.id === id);
    setProfiles((prev) => prev.filter((profile) => profile.id !== id));

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        if (direction === 'right') {
            await api.post('/matches/like', { userId, receiverId: id });
            await alert('관심을 보냈어요!', '상대방이 수락하면 대화를 시작할 수 있어요');
        } else if (direction === 'left') {
            await api.post('/matches/pass', { userId, receiverId: id });
        }
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        console.error('Action failed:', error);
        
        if (error.response?.data?.message === 'DAILY_LIKE_LIMIT_EXCEEDED' || error.message?.includes('DAILY_LIKE_LIMIT_EXCEEDED')) {
             await alert('일일 호감 표시 한도 초과', '하루에 3번만 마음을 표현할 수 있어요.\n내일 다시 찾아와주세요!');
        } else {
             await alert('오류', '오류가 발생했습니다.');
        }
        
        if (removedProfile) {
            setProfiles((prev) => [removedProfile, ...prev]); // Revert optimistic update
        }
    }
  };

  if (isLoading) {
      return (
          <div className="flex flex-col h-screen items-center justify-center bg-[#FDFCFB] space-y-6">
              <div className="relative">
                  <div className="absolute inset-0 bg-[#FF8B7D] rounded-full opacity-20 animate-ping"></div>
                  <div className="relative bg-[#FF8B7D] p-6 rounded-full shadow-xl animate-pulse">
                      <Search className="w-10 h-10 text-white" />
                  </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl font-bold text-[#2D2D2D] animate-pulse">인연을 찾는 중...</p>
                <p className="text-lg text-[#666666]">잠시만 기다려주세요</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] pb-24 overflow-hidden pt-[env(safe-area-inset-top)]">
      <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => router.back()}
                className="text-gray-700 hover:text-gray-900"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-[#2D2D2D]">오늘의 추천</h1>
        </div>
      </header>
      <RecommendationList 
        profiles={profiles} 
        onAction={handleAction}
        userName={userName}
        showAiReason={true}
      />
    </div>
  );
}
