'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Users, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useRef } from 'react';

// SEO & AEO Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SIBOM (시봄)',
  applicationCategory: 'SocialNetworkingApplication',
  operatingSystem: 'Android, iOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
  description: '50대 이상 시니어를 위한 프리미엄 소셜 데이팅 앱. 동네 친구 만들기, 취미 공유, 중년 만남을 위한 안전한 커뮤니티.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
  featureList: ['AI 매칭', '관심사 기반 매칭', '안전한 인증 시스템', '동네 친구 찾기'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '시봄은 어떤 서비스인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '시봄(SIBOM)은 50대 이상 시니어 세대를 위한 맞춤형 소셜 매칭 서비스입니다. 단순한 데이팅을 넘어, 등산, 독서, 여행 등 취미를 공유할 동네 친구나 인생의 반려자를 찾을 수 있는 안전한 플랫폼입니다.',
      },
    },
    {
      '@type': 'Question',
      name: '50대, 60대도 쉽게 이용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 가능합니다. 시봄은 디지털 기기에 익숙하지 않은 중장년층을 위해 큰 글씨와 직관적인 디자인을 적용했습니다. 복잡한 절차 없이 쉽게 가입하고 이용할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '이용 요금은 얼마인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '현재 서비스 오픈 기념으로 모든 기본 기능을 무료로 제공하고 있습니다. AI 매칭 추천(일 9건), 호감 보내기(일 3건) 등을 비용 부담 없이 이용해보세요.',
      },
    },
  ],
};

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
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md" role="navigation" aria-label="Main Navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">SIBOM</span>
          </div>
          <Link href="/start">
            <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-white/90" aria-label="SIBOM 앱 시작하기">
              앱 시작하기
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative h-[90vh] w-full overflow-hidden" aria-label="Hero Section">
        <motion.div style={{ opacity, scale }} className="absolute inset-0">
          <Image
            src="/images/landing/hero.png"
            alt="행복한 5060 중년 부부의 미소, 시니어 데이팅의 즐거움"
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
            <strong>시봄(SIBOM)</strong>에서 당신의 두 번째 청춘을 함께할 소중한 인연을 찾아보세요.
            <span className="block mt-2 text-base text-gray-300">중년 만남, 동네 친구, 등산 동호회 등 원하는 모든 만남이 여기에 있습니다.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/start">
              <button className="flex items-center gap-2 rounded-full bg-[#FFE812] px-8 py-4 text-lg font-bold text-[#3C1E1E] shadow-lg transition hover:scale-105 active:scale-95">
                지금 무료로 시작하기 <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-neutral-50 py-24" aria-labelledby="philosophy-title">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h2 id="philosophy-title" className="text-3xl font-bold text-gray-900 md:text-4xl">
                시니어가 즐겁고 행복한<br />
                일상을 즐기기 위한 공간
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                100세 시대, 50대는 인생의 반환점이 아닌 새로운 출발점입니다.
                SIBOM은 단순한 만남을 넘어, 서로의 <strong>취미를 공유하고</strong> 
                이야기를 나누며 삶의 활력을 되찾아드리는 중년 전용 커뮤니티를 목표로 합니다.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <Heart className="mb-4 h-8 w-8 text-rose-500" />
                  <h3 className="mb-2 font-bold text-gray-900">검증된 중년 만남</h3>
                  <p className="text-sm text-gray-500">실명 인증된 회원들과의<br />안전한 소통 보장</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <Users className="mb-4 h-8 w-8 text-blue-500" />
                  <h3 className="mb-2 font-bold text-gray-900">지역 기반 친구 찾기</h3>
                  <p className="text-sm text-gray-500">내 주변 가까운 곳의<br />취미 친구 연결</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/landing/feature-lifestyle.png"
                alt="취미 생활을 즐기는 활동적인 시니어들의 모습"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="bg-black py-24 text-white" aria-labelledby="ai-feature-title">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1 relative aspect-square">
               <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                 <Image
                  src="/images/landing/feature-ai.png"
                  alt="AI 인공지능이 분석하는 시니어 매칭 시스템 화면"
                  fill
                  className="object-contain p-12"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-blue-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">실버 세대 맞춤 AI 기술</span>
              </div>
              <h2 id="ai-feature-title" className="text-3xl font-bold md:text-5xl">
                AI가 찾아주는<br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  나만의 단짝 친구
                </span>
              </h2>
              <p className="text-xl text-gray-400">
                복잡한 검색은 이제 그만. 
                최첨단 AI 기술이 회원님의 성향과 취향을 분석하여 
                가장 잘 맞는 <strong>동네 친구, 등산 메이트, 인생의 동반자</strong>를 매일 추천해드립니다.
              </p>
              <ul className="space-y-4">
                {[
                  "대화 스타일 분석을 통한 성향 매칭",
                  "관심사(등산, 골프, 여행 등) 기반 맞춤형 추천",
                  "AI가 제안하는 센스있는 첫 인사말 가이드"
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
      <section className="bg-gradient-to-b from-gray-900 to-black py-24 text-white" aria-labelledby="pricing-title">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-yellow-500/10 p-4">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <h2 id="pricing-title" className="mb-4 text-3xl font-bold">서비스 오픈 기념 모든 기능 무료</h2>
            <p className="mb-8 text-gray-300">
              지금 가입하시면 SIBOM의 모든 프리미엄 기능을 평생 무료로 체험하실 수 있는 기회!<br />
              비용 부담 없이 새로운 인연을 만들어보세요.
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/5 p-6">
                <div className="mb-2 text-2xl font-bold text-white">1일 9건</div>
                <div className="text-sm text-gray-400">AI 맞춤 친구 추천</div>
              </div>
              <div className="rounded-xl bg-white/5 p-6">
                <div className="mb-2 text-2xl font-bold text-white">1일 3건</div>
                <div className="text-sm text-gray-400">호감 보내기 무료</div>
              </div>
              <div className="rounded-xl bg-white/5 p-6">
                <div className="mb-2 text-2xl font-bold text-white">1일 3건</div>
                <div className="text-sm text-gray-400">AI 대화 도우미</div>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-lg bg-red-500/10 p-4 text-left text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                현재 서울, 경기, 부산 지역을 중심으로 회원 수가 빠르게 증가하고 있습니다. 
                내 주변 동네 친구를 찾고 싶다면 지금 바로 시작해보세요!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / AEO Section */}
      <section className="bg-white py-24 text-gray-900">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl text-[#2D2D2D]">자주 묻는 질문 (FAQ)</h2>
            <p className="mt-4 text-gray-500">시봄 서비스에 대해 궁금한 점을 해결해 드립니다.</p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-[#2D2D2D]">
                <HelpCircle className="h-6 w-6 text-[#7D9D85]" />
                시봄은 어떤 분들을 위한 서비스인가요?
              </h3>
              <p className="mt-3 pl-9 text-gray-600 leading-relaxed">
                시봄(SIBOM)은 50대 이상 시니어 세대를 위한 프리미엄 소셜 서비스입니다. 
                은퇴 후 새로운 활력이 필요한 분, 대화가 통하는 친구가 필요한 분, 
                취미 생활을 함께할 파트너를 찾는 분들 누구나 환영합니다.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-[#2D2D2D]">
                <HelpCircle className="h-6 w-6 text-[#7D9D85]" />
                스마트폰 사용이 서툰데 괜찮을까요?
              </h3>
              <p className="mt-3 pl-9 text-gray-600 leading-relaxed">
                걱정하지 마세요. 시봄은 중장년층의 시력을 고려하여 <strong>큰 글씨와 시원한 화면 구성</strong>을 적용했습니다. 
                복잡한 기능은 빼고 꼭 필요한 기능만 담아 누구나 쉽게 이용하실 수 있습니다.
              </p>
            </div>

            <div className="pb-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-[#2D2D2D]">
                <HelpCircle className="h-6 w-6 text-[#7D9D85]" />
                정말 무료인가요?
              </h3>
              <p className="mt-3 pl-9 text-gray-600 leading-relaxed">
                네, 현재 오픈 베타 기간으로 <strong>모든 핵심 기능을 100% 무료</strong>로 제공하고 있습니다. 
                매일 제공되는 AI 추천과 호감 보내기 기능을 비용 부담 없이 마음껏 활용해보세요.
              </p>
            </div>
          </div>

           <div className="mt-12 flex flex-col items-center gap-6">
              <Link href="/start" className="w-full max-w-sm">
                <button className="w-full rounded-full bg-[#FFE812] py-5 text-xl font-bold text-[#3C1E1E] shadow-xl transition hover:bg-[#EED500] active:scale-95">
                  무료로 시작하기
                </button>
              </Link>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-gray-500">
        <p>© 2026 SIBOM. 50대 이후의 설레는 시작, 시봄.</p>
      </footer>
    </div>
  );
}
