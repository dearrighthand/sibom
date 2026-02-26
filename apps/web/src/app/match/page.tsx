'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { RecommendationList } from '@/components/home/RecommendationList';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';
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

export default function MatchPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const { alert } = useDialog();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
       setIsLoading(true);
       try {
         const userId = localStorage.getItem('userId');
         
         if (!userId) {
             window.location.href = '/login';
             return;
         }

         const startTime = performance.now();
         
         const query = `/matches/recommendations?userId=${userId}`;
         
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
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] overflow-hidden pb-24">
      <TopNavigation title="새로운 인연찾기" />
      <div className="px-4 py-5">
        <h2 className="text-xl font-bold text-[#2D2D2D]">AI가 추천한 인연</h2>
      </div>
      
      <div className="flex-1 relative">
        <RecommendationList 
            profiles={profiles} 
            onAction={handleAction}
            userName={userName}
            showAiReason={true}
        />
        
        {/* Floating Button for Custom Search */}
        <div className="absolute bottom-6 left-0 right-0 px-6 z-10 flex justify-center pointer-events-none">
             <Link href="/match/custom" className="pointer-events-auto shadow-lg bg-white border border-[#FF8B7D]/20 text-[#2D2D2D] px-6 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-gray-50 active:scale-95 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#FFF0EF] flex items-center justify-center text-[#FF8B7D]">
                    <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span>관심사로 찾기</span>
             </Link>
        </div>
      </div>

      <FooterNavigation />
    </div>
  );
}
