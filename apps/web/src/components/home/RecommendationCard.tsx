'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';

interface RecommendationProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  quote: string;
  interests: string[];
  matchReason: string;
}

interface RecommendationCardProps {
  profile: RecommendationProfile;
  onInterest: () => void;
  onPass: () => void;
  showAiReason?: boolean;
}

export function RecommendationCard({
  profile,
  onInterest,
  onPass,
  showAiReason = true,
}: RecommendationCardProps) {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-lg border border-gray-100">
      {/* Profile Image Section */}
      <div className="relative h-64 w-full bg-gray-200">
        <Image
          src={profile.imageUrl}
          alt={profile.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 text-white">
          <h2 className="text-2xl font-bold shadow-black/30 drop-shadow-md">
            {profile.name}, {profile.age}
          </h2>
          <p className="flex items-center gap-1 text-sm font-medium opacity-90 shadow-black/30 drop-shadow-md">
            📍 {profile.location}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Quote */}
        <div className="mb-4 rounded-xl bg-[#FFF5F4] p-4 text-[#FF8B7D]">
          <p className="text-lg font-bold leading-snug">
            &ldquo;{profile.quote}&rdquo;
          </p>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <span className="mb-2 block text-sm font-semibold text-gray-500">
            공통 관심사
          </span>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* AI Match Reason (Highlight) */}
        {showAiReason && (
          <div className="mb-6 rounded-xl border border-[#FF8B7D]/20 bg-white p-4 shadow-sm">
            <span className="mb-1 block text-xs font-bold text-[#FF8B7D]">
              ✨ AI 매칭 이유
            </span>
            <p className="text-sm leading-relaxed text-gray-700">
              {profile.matchReason}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={onPass}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex h-14 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-transform active:scale-95 text-lg font-medium hover:bg-gray-50"
          >
            다음에
          </button>
          
          <button
            onClick={onInterest}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#FF8B7D] text-white shadow-md shadow-[#FF8B7D]/30 transition-transform active:scale-95 text-lg font-bold hover:bg-[#ff7a6b]"
          >
            <Heart className="h-6 w-6 fill-current" />
            관심 있어요
          </button>
        </div>
      </div>
    </div>
  );
}
