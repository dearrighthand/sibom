'use client';

import Link from 'next/link';
import { Sparkles, Search } from 'lucide-react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';

export default function MatchLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] pb-36 font-sans">
      <TopNavigation />

      <main className="flex-1 p-6 space-y-6 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-[#2D2D2D]">새로운 인연 찾기</h1>
          <p className="text-[#666666] mt-2">원하는 방식으로 소중한 인연을 찾아보세요</p>
        </div>

        {/* Option 1: AI Recommendation */}
        <Link href="/match/today" className="block group">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 transition-all active:scale-95 hover:border-[#FF8B7D]/30 hover:shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-[#FF8B7D]" />
             </div>
             <div className="relative z-10">
                <div className="w-14 h-14 bg-[#FFF0EF] rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-7 h-7 text-[#FF8B7D]" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">오늘의 추천 인연</h2>
                <p className="text-[#666666] leading-relaxed">
                  AI가 회원님의 성향과 활동을 분석하여<br/>
                  <span className="text-[#FF8B7D] font-bold">최적의 단짝</span>을 매일 소개해드려요.
                </p>
             </div>
          </div>
        </Link>
        
        {/* Option 2: Custom Search */}
        <Link href="/match/custom" className="block group">
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 transition-all active:scale-95 hover:border-[#7D9D85]/30 hover:shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Search className="w-24 h-24 text-[#7D9D85]" />
             </div>
             <div className="relative z-10">
                <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
                    <Search className="w-7 h-7 text-[#7D9D85]" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">관심사로 인연 찾기</h2>
                <p className="text-[#666666] leading-relaxed">
                  내가 원하는 <span className="text-[#7D9D85] font-bold">지역과 관심사</span>를 선택하여<br/>
                  직접 소중한 인연을 찾아보세요.
                </p>
             </div>
          </div>
        </Link>

      </main>

      <FooterNavigation />
    </div>
  );
}
