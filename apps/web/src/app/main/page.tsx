'use client';

import { useState, useEffect } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { api } from '@/lib/api';
import { Search, Heart, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomeDashboard() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // AdMob logic removed
  }, []);

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

        {/* Banner Section (Placeholder) */}
        <section className="relative h-44 w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFAD9F] to-[#FF8B7D] shadow-md flex items-center px-6">
          <div className="z-10 text-white space-y-2">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
              추천 서비스
            </div>
            <h2 className="text-xl font-bold leading-tight">
              취향이 똑같은 <br />
              인연을 찾아드려요
            </h2>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
            <Sparkles className="w-48 h-48 text-white rotate-12" />
          </div>
        </section>

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

        {/* Promo Banner Section */}
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
            <p className="text-[#FFCUCU] text-xs leading-relaxed text-gray-300 break-keep">
              현재 회원 수가 빠르게 증가하고 있으나, 지역에 따라 매칭 추천이 다소 부족할 수 있습니다. 이 점 너그러운 양해 부탁드리며, 주변 지인들에게 SIBOM을 많이 소개해주세요!
            </p>
          </div>
        </section>
      </main>

      <FooterNavigation />
    </div>
  );
}
