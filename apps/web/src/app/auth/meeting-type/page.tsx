'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';
import { MEETING_TYPE_CODES } from '../../../constants/meetingTypes';

export default function MeetingTypePage() {
  const router = useRouter();
  const { meetingType, setMeetingType } = useRegistrationStore();
  const [selectedType, setSelectedType] = useState<string | null>(meetingType);

  const handleSelect = (code: string) => {
    setSelectedType(code);
  };

  const handleSubmit = () => {
    if (selectedType) {
      setMeetingType(selectedType);
      console.log('Meeting Type Saved:', selectedType);
      router.push('/auth/photos'); // Go to Photo Registration
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between shadow-sm">
        <Link
          href="/auth/hobbies"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <div className="text-lg font-bold text-[#2D2D2D]">프로필 생성</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#FF8B7D]"></div>
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
                어떤 분을 만나고 싶으신가요?
              </p>
            </div>
          </div>
        </div>

        {/* Meeting Type List (Radio Style) */}
        <div className="flex flex-col gap-4">
          {MEETING_TYPE_CODES.map((type) => {
            const isSelected = selectedType === type.code;
            return (
              <button
                key={type.code}
                onClick={() => handleSelect(type.code)}
                className={`
                                    w-full flex items-center p-5 rounded-3xl border-2 transition-all shadow-sm active:scale-95 text-left
                                    ${
                                      isSelected
                                        ? 'bg-[#FFEAE8] border-[#FF8B7D] shadow-md'
                                        : 'bg-white border-[#EBEBE6] hover:border-[#FF8B7D]/50'
                                    }
                                `}
              >
                <div
                  className={`
                                    w-14 h-14 rounded-full flex items-center justify-center text-2xl mr-4 flex-shrink-0
                                    ${isSelected ? 'bg-white' : 'bg-[#F5F5F5]'}
                                `}
                >
                  {type.icon}
                </div>

                <span
                  className={`text-lg font-bold flex-1 ${isSelected ? 'text-[#2D2D2D]' : 'text-[#666666]'}`}
                >
                  {type.label}
                </span>

                <div
                  className={`
                                    w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
                                    ${
                                      isSelected
                                        ? 'border-[#FF8B7D] bg-[#FF8B7D]'
                                        : 'border-gray-300 bg-white'
                                    }
                                `}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Fixed Next Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleSubmit}
          disabled={!selectedType}
          className={`w-full max-w-lg mx-auto rounded-full py-4 text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                         ${
                           selectedType
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
