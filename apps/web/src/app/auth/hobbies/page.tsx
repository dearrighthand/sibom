'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';
import { HOBBY_CODES } from '../../../constants/hobbies';

export default function HobbiesPage() {
  const router = useRouter();
  const { hobbies, setHobbies } = useRegistrationStore();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(hobbies || []);

  const toggleHobby = (code: string) => {
    if (selectedHobbies.includes(code)) {
      setSelectedHobbies((prev) => prev.filter((h) => h !== code));
    } else {
      if (selectedHobbies.length >= 5) {
        alert('최대 5개까지만 선택할 수 있어요.');
        return;
      }
      setSelectedHobbies((prev) => [...prev, code]);
    }
  };

  const handleSubmit = () => {
    setHobbies(selectedHobbies);
    console.log('Hobbies Saved:', selectedHobbies);
    router.push('/auth/meeting-type'); // Go to Meeting Type selection
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 pb-4 pt-4 flex items-center justify-between shadow-sm">
        <Link
          href="/auth/intro"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <div className="text-lg font-bold text-[#2D2D2D]">프로필 생성</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#FF8B7D]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <main className="px-6 pt-8 max-w-lg mx-auto flex flex-col">
        {/* Character Chat Bubble */}
        <div className="flex items-start gap-4 mb-8">
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
                평소 어떤 활동을 즐기시나요?
                <br />
                <span className="font-bold text-[#FF8B7D]">최대 5개까지</span> 선택해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-2 gap-4">
          {HOBBY_CODES.map((hobby) => {
            const isSelected = selectedHobbies.includes(hobby.code);
            return (
              <button
                key={hobby.code}
                onClick={() => toggleHobby(hobby.code)}
                className={`
                                    flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all shadow-sm active:scale-95 min-h-[140px]
                                    ${
                                      isSelected
                                        ? 'bg-[#7D9D85]/10 border-[#7D9D85] shadow-md'
                                        : 'bg-white border-[#EBEBE6] hover:border-[#7D9D85]/50'
                                    }
                                `}
              >
                <span className="text-4xl filter drop-shadow-sm">{hobby.icon}</span>
                <span
                  className={`text-lg font-bold ${isSelected ? 'text-[#2D2D2D]' : 'text-[#666666]'}`}
                >
                  {hobby.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Fixed Next Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleSubmit}
          disabled={selectedHobbies.length === 0}
          className={`w-full max-w-lg mx-auto rounded-full py-4 text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                         ${
                           selectedHobbies.length > 0
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
