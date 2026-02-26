'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecommendationList } from '@/components/home/RecommendationList';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { BottomSheet } from '@/components/home/BottomSheet';
import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

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
         const activeFilters = currentFilters || filters;

         if (activeFilters) {
            if (activeFilters.ageMin) query += `&ageMin=${activeFilters.ageMin}`;
            if (activeFilters.ageMax) query += `&ageMax=${activeFilters.ageMax}`;
            if (activeFilters.location) query += `&location=${activeFilters.location}`;
            // Preserve distance for backward compatibility if location is not set, though we moved to location string
            if (activeFilters.distance) query += `&distance=${activeFilters.distance}`;

            if (activeFilters.interestCodes && Array.isArray(activeFilters.interestCodes)) {
                // Pass as comma separated
                query += `&interestCodes=${activeFilters.interestCodes.join(',')}`;
            }
         }
         
         // Parallel fetch
         const [recommendations, userProfile] = await Promise.all([
            api.get<Profile[]>(query),
            api.get<{ name: string; location: string; interests: string[] }>(`/profiles/${userId}`)
         ]);
         
         setProfiles(recommendations);
         setUserName(userProfile.name);

         // Initialize filters with user profile if not set
         if (!filters && !currentFilters) {
             setFilters({
                 location: userProfile.location,
                 interestCodes: userProfile.interests
             });
         }
         
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
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] font-sans overflow-hidden">
      <TopNavigation title="새로운 인연찾기" />

      {/* Filter Header - Always visible at top */}
      <div className="sticky top-16 z-40 bg-[#FDFCFB]/90 backdrop-blur-sm px-4 py-3 border-b border-gray-100">
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

      <main className="flex-1 relative pb-32"> 
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
                 />
            </div>
        )}

        {/* Floating Button for AI Match */}
        <div className="fixed left-0 right-0 px-6 z-10 flex justify-center pointer-events-none" style={{ bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
             <Link href="/match" className="pointer-events-auto shadow-lg bg-white border border-[#FF8B7D]/20 text-[#2D2D2D] px-6 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-gray-50 active:scale-95 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#FFF0EF] flex items-center justify-center text-[#FF8B7D]">
                    <Sparkles className="w-4 h-4" />
                </div>
                <span>AI에 추천받기</span>
             </Link>
        </div>
      </main>

      <FooterNavigation />

      <BottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        initialLocation={filters?.location as string}
        initialInterests={filters?.interestCodes as string[]}
      />
    </div>
  );
}
