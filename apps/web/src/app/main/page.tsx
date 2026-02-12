'use client';

import { useState, useEffect } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { AdMobBanner } from '@/components/AdMobBanner';
import { api } from '@/lib/api';
import { Search, Heart, MessageCircle, ChevronRight, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';

export default function HomeDashboard() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          window.location.href = '/login';
          return;
        }
        const userProfile = await api.get<{ name: string }>(`/profiles/${userId}`);
        setUserName(userProfile.name);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500 animate-pulse">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] pb-32">
      <TopNavigation />
      
      <main className="flex-1 px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            안녕하세요, <br />
            <span className="text-[#FF8B7D]">{userName}</span>님!
          </h1>
          <p className="text-gray-600">오늘도 소중한 인연을 만나보세요.</p>
        </section>

        {/* Free Feature Banner Section */}
        <Link href="/event" className="block">
          <section className="relative h-32 w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] shadow-sm flex items-center px-6 transition-transform active:scale-[0.98]">
            <div className="z-10 text-gray-800 space-y-1">
              <div className="inline-block px-2 py-0.5 bg-white/60 backdrop-blur-sm rounded-full text-[10px] font-bold text-[#FF6B6B] mb-1">
                기간 한정 이벤트
              </div>
              <h2 className="text-lg font-bold leading-tight">
                지금 모든 기능이 <br />
                <span className="text-[#FF4B4B]">무료</span>입니다!
              </h2>
              <p className="text-gray-600 text-xs flex items-center gap-1">
                자세히 보기 <ChevronRight className="w-3 h-3" />
              </p>
            </div>
            <div className="absolute right-4 bottom-[-10px] opacity-90">
              <Gift className="w-24 h-24 text-white drop-shadow-lg rotate-[-12deg]" />
            </div>
          </section>
        </Link>
        
        {/* Quick Navigation Cards */}
        <section className="grid grid-cols-1 gap-4">
          <Link href="/match" className="group">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF5F0] flex items-center justify-center text-[#7D9D85]">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">새로운 인연 찾기</h3>
                  <p className="text-sm text-gray-500">지금 바로 매칭을 시작해요</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D] transition-colors" />
            </div>
          </Link>

          <Link href="/likes" className="group">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF1F0] flex items-center justify-center text-[#FF8B7D]">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">받은 호감 확인</h3>
                  <p className="text-sm text-gray-500">나를 좋아하는 분들이에요</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D] transition-colors" />
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EBF5FF] flex items-center justify-center text-[#4A90E2]">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">대화 중인 인연</h3>
                  <p className="text-sm text-gray-500">메시지를 주고받으세요</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D] transition-colors" />
            </div>
          </Link>
        </section>
      </main>

      <AdMobBanner />
    </div>
  );
}
