'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HOBBY_CODES } from '@sibom/shared';
import { AGE_GROUP_OPTIONS, DISTANCE_OPTIONS } from '@/constants/filters';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, unknown>) => void;
}

export function BottomSheet({ isOpen, onClose, onApply }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedDistance, setSelectedDistance] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid synchronous setState inside useEffect warning
      const timer = setTimeout(() => setIsVisible(true), 0);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleInterest = (interestCode: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestCode)
        ? prev.filter(i => i !== interestCode)
        : [...prev, interestCode]
    );
  };

  const handleApply = () => {
    const ageOption = AGE_GROUP_OPTIONS.find(o => o.label === selectedAge);
    
    onApply({
        ageMin: ageOption?.min,
        ageMax: ageOption?.max,
        distance: selectedDistance,
        interestCodes: selectedInterests.length > 0 ? selectedInterests : undefined
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={cn(
          "relative w-full max-w-md bg-white rounded-t-[2rem] p-6 shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle Bar */}
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-300" />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">관심사로 찾기</h2>
          <button 
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content (Scrollable if needed) */}
        <div className="flex max-h-[70vh] flex-col gap-8 overflow-y-auto pb-24">
          
          {/* Age Section */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-500">연령대</h3>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUP_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedAge(option.label)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selectedAge === option.label
                      ? "border-[#FF8B7D] bg-[#FFE8E6] text-[#FF8B7D]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Distance Section */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-500">거주 지역 (내 위치 기준)</h3>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDistance(option.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selectedDistance === option.value
                      ? "border-[#FF8B7D] bg-[#FFE8E6] text-[#FF8B7D]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Interests Section */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-500">관심사</h3>
            <div className="flex flex-wrap gap-2"> 
              {HOBBY_CODES.map((hobby) => (
                <button
                  key={hobby.code}
                  onClick={() => toggleInterest(hobby.code)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                    selectedInterests.includes(hobby.code)
                      ? "border-[#FF8B7D] bg-[#FFE8E6] text-[#FF8B7D]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                 {hobby.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-6 pt-2">
          <button
            onClick={handleApply}
            className="w-full rounded-xl bg-[#2D2D2D] py-4 text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
          >
            적용하기
          </button>
        </div>

      </div>
    </div>
  );
}
