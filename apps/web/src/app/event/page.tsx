'use client';

import { Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 pb-12 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 text-gray-700 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">이벤트</h1>
      </header>

      {/* Content */}
      <section className="bg-[#1A1F2C] rounded-3xl p-6 text-white text-center space-y-6 shadow-lg mb-8">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#2D3345] rounded-full flex items-center justify-center relative">
            <Sparkles className="w-6 h-6 text-[#FFD700]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full animate-ping"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold">서비스 오픈 기념 모든 기능 무료</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            현재 초기 회원님들을 위해 SIBOM의 모든 기능을<br/>
            무료로 제공하고 있습니다.<br/>
            <span className="text-gray-500 text-xs mt-2 block">
              약 3개월 후, 더 나은 서비스를 위한<br/>프리미엄 멤버십이 출시될 예정입니다.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#252A39] rounded-2xl p-4 flex flex-col items-center gap-2 border border-[#2D3345]">
            <span className="text-white font-bold text-lg">1일 9건</span>
            <span className="text-gray-400 text-[10px]">AI 매칭 추천</span>
          </div>
          <div className="bg-[#252A39] rounded-2xl p-4 flex flex-col items-center gap-2 border border-[#2D3345]">
            <span className="text-white font-bold text-lg">1일 3건</span>
            <span className="text-gray-400 text-[10px]">호감 보내기</span>
          </div>
          <div className="bg-[#252A39] rounded-2xl p-4 flex flex-col items-center gap-2 border border-[#2D3345]">
            <span className="text-white font-bold text-lg">1일 3건</span>
            <span className="text-gray-400 text-[10px]">AI 멘트 생성</span>
          </div>
        </div>

        <div className="bg-[#2A1818] rounded-xl p-4 flex gap-3 text-left border border-[#3A1D1D]">
          <div className="shrink-0 pt-0.5">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <p className="text-[#FF6B6B] text-xs leading-relaxed text-gray-300 break-keep">
            현재 회원 수가 빠르게 증가하고 있으나, 지역에 따라 매칭 추천이 다소 부족할 수 있습니다. 이 점 너그러운 양해 부탁드리며, 주변 지인들에게 SIBOM을 많이 소개해주세요!
          </p>
        </div>
      </section>
    </div>
  );
}
