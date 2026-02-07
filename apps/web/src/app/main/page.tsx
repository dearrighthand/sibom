'use client';

import { useState, useEffect } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { api } from '@/lib/api';
import { Search, Heart, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function HomeDashboard() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
            margin: 160, 
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
      </main>

      <FooterNavigation />
    </div>
  );
}
