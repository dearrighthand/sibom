'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';

export default function IntroPage() {
  const router = useRouter();
  const { name, setIntro } = useRegistrationStore();
  const [introText, setIntroText] = useState('');
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [refineCount, setRefineCount] = useState(0);
  const MAX_RETRIES = 4;

  const handleSubmit = () => {
    console.log('Intro:', introText);
    setIntro(introText); // Save to store
    router.push('/auth/hobbies');
  };

  const handleAiRefine = async () => {
    if (!introText.trim()) {
      alert('먼저 자기소개를 간단히 작성해주세요!');
      return;
    }

    // If it's the first time opening chat or a retry
    if (chatHistory.length === 0 || refineCount > 0) {
      // Add user message if it's the first interaction
      if (chatHistory.length === 0) {
        setChatHistory([{ role: 'user', text: introText }]);
      }

      if (refineCount >= MAX_RETRIES) return;

      setIsRefining(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/refine`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: introText }),
        });

        if (res.ok) {
          const data = await res.json();
          setChatHistory((prev) => [...prev, { role: 'ai', text: data.result }]);
          setRefineCount((prev) => prev + 1);
        }
      } catch (e) {
        console.error('AI Refine failed', e);
      } finally {
        setIsRefining(false);
      }
    }
    setShowAiHelp(true);
  };

  const handleUseRefined = (text: string) => {
    setIntroText(text);
    setShowAiHelp(false);
    setRefineCount(0);
    setChatHistory([]);
  };

  // AI Chat View (Overlay)
  if (showAiHelp) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] font-sans flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
          <h2 className="text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF8B7D]" />
            자기소개 작성
          </h2>
          <button onClick={() => setShowAiHelp(false)} className="p-2 -mr-2 text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6 pb-40">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-[#FFEAE8] border border-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/inyeon_character.png"
                    alt="AI"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl leading-relaxed text-[15px] shadow-sm relative
                                ${
                                  msg.role === 'user'
                                    ? 'bg-[#FF8B7D] text-white rounded-tr-none'
                                    : 'bg-white text-[#2D2D2D] rounded-tl-none border border-gray-100'
                                }`}
              >
                {msg.role === 'ai' && (
                  <div className="text-xs text-[#FF8B7D] font-bold mb-1">인연이 (In-yeon-i)</div>
                )}
                {msg.role === 'user' && (
                  <div className="text-xs text-white/80 font-bold mb-1 text-right">나 (Me)</div>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {isRefining && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFEAE8] border border-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/inyeon_character.png"
                  alt="AI"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <span className="animate-pulse text-gray-400">작성 중...</span>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Actions */}
        {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'ai' && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent from-white/90 via-white/50 to-transparent pt-10 pb-8 flex flex-col gap-3">
            <button
              onClick={() => handleUseRefined(chatHistory[chatHistory.length - 1].text)}
              className="w-full bg-[#FF8B7D] text-white rounded-full py-4 font-bold shadow-md hover:bg-[#FF7B6D] transition-all flex items-center justify-center gap-2"
            >
              <span className="text-white">✔</span> 이대로 쓸래요
            </button>

            <button
              onClick={handleAiRefine}
              disabled={refineCount >= MAX_RETRIES || isRefining}
              className={`w-full bg-white text-[#555] border border-gray-200 rounded-full py-4 font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2
                                ${refineCount >= MAX_RETRIES ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
            >
              <span className="text-lg">↻</span> 다시 만들기 ({MAX_RETRIES - refineCount}/
              {MAX_RETRIES})
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link
          href="/auth/profile"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <div className="text-lg font-bold text-[#2D2D2D]">프로필 생성</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#FF8B7D]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <main className="px-6 pt-8 max-w-lg mx-auto flex flex-col">
        {/* Character Chat Bubble */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-[#E0F7FA]">
            <Image
              src="/images/inyeon_character.png"
              alt="인연이"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">인연이 (AI 매니저)</span>
            <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-[#F0F0F0]">
              <p className="text-[#2D2D2D] text-[16px] font-medium leading-relaxed">
                <span className="font-bold">{name || '회원'}님</span>, 자신을 소개하는 글을 편하게
                적어주세요.
                <br />
                <span className="text-[#FF8B7D]">어떤 성격이신가요?</span>
              </p>
            </div>
          </div>
        </div>

        {/* AI Help Trigger */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAiRefine}
            className="flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-[#C8E6C9] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI 도움 받기
          </button>
        </div>

        {/* Text Area */}
        <div className="bg-white rounded-2xl border border-[#EBEBE6] p-5 shadow-sm focus-within:border-[#FF8B7D] focus-within:ring-1 focus-within:ring-[#FF8B7D] transition-all">
          <textarea
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            placeholder="솔직하고 담백하게 작성해보세요. 예) 저는 등산을 좋아하고 웃음이 많은 편입니다."
            className="w-full min-h-[160px] text-lg text-[#2D2D2D] placeholder:text-[#999999] outline-none resize-none bg-transparent leading-relaxed"
            maxLength={200}
          />
          <div className="text-right mt-2 text-sm text-[#999999]">{introText.length}/200</div>
        </div>

        <p className="text-center text-[#999999] text-sm mt-6">
          작성이 어려우시면 위 <span className="font-bold text-[#2E7D32]">AI 도움 받기</span> 버튼을
          눌러보세요.
        </p>
      </main>

      {/* Bottom Fixed Next Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleSubmit}
          disabled={introText.length < 5}
          className={`w-full max-w-lg mx-auto rounded-full py-4 text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                         ${
                           introText.length >= 5
                             ? 'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a] shadow-[0_10px_25px_-5px_rgba(255,139,125,0.4)]'
                             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         }
                     `}
        >
          다음 <span className="text-xl">➜</span>
        </button>
      </div>
    </div>
  );
}
