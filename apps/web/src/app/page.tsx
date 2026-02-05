'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRef } from 'react';

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">SIBOM</span>
          </div>
          <Link href="/start">
            <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
              앱 시작하기
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative h-[90vh] w-full overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0">
          <Image
            src="/images/landing/hero.png"
            alt="Happy Senior Couple"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-5xl font-bold leading-tight md:text-7xl"
          >
            50대 이후,<br />
            설레는 인연의 시작
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 max-w-2xl text-lg text-gray-200 md:text-xl"
          >
            은퇴 후의 삶이 지루하신가요? <br className="md:hidden" />
            SIBOM에서 당신의 두 번째 청춘을 함께할 소중한 인연을 찾아보세요.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/start">
              <button className="flex items-center gap-2 rounded-full bg-[#FFE812] px-8 py-4 text-lg font-bold text-[#3C1E1E] shadow-lg transition hover:scale-105 active:scale-95">
                지금 시작하기 <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                시니어가 즐겁고 행복한<br />
                일상을 즐기기 위한 공간
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                100세 시대, 50대는 인생의 반환점이 아닌 새로운 출발점입니다.
                SIBOM은 단순한 만남을 넘어, 서로의 취미를 공유하고 
                이야기를 나누며 삶의 활력을 되찾아드리는 것을 목표로 합니다.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <Heart className="mb-4 h-8 w-8 text-rose-500" />
                  <h3 className="mb-2 font-bold text-gray-900">진정성 있는 만남</h3>
                  <p className="text-sm text-gray-500">검증된 회원들과의<br />안전한 소통</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <Users className="mb-4 h-8 w-8 text-blue-500" />
                  <h3 className="mb-2 font-bold text-gray-900">공통의 관심사</h3>
                  <p className="text-sm text-gray-500">취미와 라이프스타일이<br />맞는 친구 찾기</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/landing/feature-lifestyle.png"
                alt="Seniors enjoying lifestyle"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1 relative aspect-square">
               <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                 <Image
                  src="/images/landing/feature-ai.png"
                  alt="AI Feature"
                  fill
                  className="object-contain p-12"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-blue-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Coming Soon Features</span>
              </div>
              <h2 className="text-3xl font-bold md:text-5xl">
                AI가 찾아주는<br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  나만의 단짝
                </span>
              </h2>
              <p className="text-xl text-gray-400">
                복잡한 검색은 이제 그만. 
                최첨단 AI 기술이 회원님의 성향과 취향을 분석하여 
                가장 잘 맞는 상대를 매일 추천해드립니다.
              </p>
              <ul className="space-y-4">
                {[
                  "대화 스타일 분석을 통한 매칭",
                  "관심사 기반 맞춤형 추천",
                  "AI가 제안하는 센스있는 첫 인사말"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Notice Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-yellow-500/10 p-4">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold">서비스 오픈 기념 모든 기능 무료</h2>
            <p className="mb-8 text-gray-300">
              현재 초기 회원님들을 위해 SIBOM의 모든 기능을 무료로 제공하고 있습니다.<br />
              약 3개월 후, 더 나은 서비스를 위한 프리미엄 멤버십이 출시될 예정입니다.
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/5 p-6">
                <div className="mb-2 text-2xl font-bold text-white">무제한</div>
                <div className="text-sm text-gray-400">AI 매칭 추천</div>
              </div>
              <div className="rounded-xl bg-white/5 p-6">
                <div className="mb-2 text-2xl font-bold text-white">무제한</div>
                <div className="text-sm text-gray-400">호감 보내기</div>
              </div>
              <div className="rounded-xl bg-white/5 p-6">
                <div className="mb-2 text-2xl font-bold text-white">무제한</div>
                <div className="text-sm text-gray-400">AI 멘트 생성</div>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-lg bg-red-500/10 p-4 text-left text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                현재 회원 수가 빠르게 증가하고 있으나, 지역에 따라 매칭 추천이 다소 부족할 수 있습니다. 
                이 점 너그러운 양해 부탁드리며, 주변 지인들에게 SIBOM을 많이 소개해주세요!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold">지금 바로 시작하세요</h3>
            <Link href="/start" className="w-full max-w-sm">
              <button className="w-full rounded-full bg-[#FFE812] py-5 text-xl font-bold text-[#3C1E1E] shadow-xl transition hover:bg-[#EED500] active:scale-95">
                SIBOM 앱으로 데려다줘!
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-gray-500">
        <p>© 2026 SIBOM. All rights reserved.</p>
      </footer>
    </div>
  );
}
