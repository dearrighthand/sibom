'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecommendationList } from '@/components/home/RecommendationList';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { BottomSheet } from '@/components/home/BottomSheet';
import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';
import { SlidersHorizontal, ChevronLeft } from 'lucide-react';

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

export default function CustomMatchPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown> | null>(null); // Store current filters
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

         let query = `/matches/recommendations?userId=${userId}&skipAi=true`; // Explicitly skip AI
         
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
         
         setProfiles(recommendations);
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

  const handleFilterApply = (newFilters: Record<string, unknown>) => {
      setFilters(newFilters);
      setIsFilterOpen(false);
      fetchData(newFilters); // Re-fetch with new filters
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] pb-24 font-sans">
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 w-full items-center justify-between px-4">
          <div className="flex items-center gap-3">
              <button 
                  onClick={() => router.back()}
                  className="text-gray-700 hover:text-gray-900"
              >
                  <ChevronLeft className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-bold text-[#2D2D2D]">관심사로 인연 찾기</h1>
          </div>
        </div>
      </header>

      {/* Filter Header - Always visible at top */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 bg-[#FDFCFB]/90 backdrop-blur-sm px-4 py-3 border-b border-gray-100">
         <button 
            onClick={() => setIsFilterOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-98 transition-all"
         >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#7D9D85]">
                     <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="text-sm text-[#999999] font-medium">원하는 조건을 선택하세요</p>
                    <p className="text-lg font-bold text-[#2D2D2D]">
                        {filters ? '필터가 적용되었습니다' : '지역, 나이, 관심사 설정'}
                    </p>
                </div>
            </div>
            <span className="text-[#666666] text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">변경</span>
         </button>
      </div>

      <main className="flex-1"> 
        {isLoading ? (
            <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#7D9D85] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-bold text-[#2D2D2D]">인연을 찾는 중...</p>
            </div>
        ) : (
            <div className="pt-4">
                 <RecommendationList 
                    profiles={profiles} 
                    onAction={handleAction}
                    userName={userName}
                    showAiReason={false}
                    title="조건에 맞는 인연"
                    description="설정한 조건에 딱 맞는 분들이에요!"
                 />
                 {profiles.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
                         <p className="text-xl font-bold text-[#2D2D2D] mb-2">조건에 맞는 회원이 없습니다.</p>
                         <p className="text-[#666666]">필터 설정을 변경하여<br/>더 많은 인연을 찾아보세요.</p>
                         <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="mt-6 px-6 py-3 bg-[#7D9D85] text-white rounded-full font-bold shadow-md active:scale-95 transition-transform"
                         >
                            필터 변경하기
                         </button>
                     </div>
                 )}
            </div>
        )}
      </main>

      <BottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
}
