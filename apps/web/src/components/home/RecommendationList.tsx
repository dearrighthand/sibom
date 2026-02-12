'use client';

import { RecommendationCard } from './RecommendationCard';
import React from 'react';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  quote: string;
  interests: string[];
  matchReason: string;
}

interface RecommendationListProps {
  profiles: Profile[];
  onAction: (direction: 'left' | 'right', id: string) => void;
  userName: string;
  showAiReason?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function RecommendationList({ 
  profiles, 
  onAction, 
  userName, 
  showAiReason = true,
  title,
  description
}: RecommendationListProps) {
  if (profiles.length === 0) {
      return (
          <div className="flex h-[60vh] flex-col items-center justify-center p-6 text-center text-gray-500">
              {showAiReason ? (
                <>
                  <h3 className="text-xl font-bold mb-2">AI가 아직 딱 맞는 인연을 찾지 못했어요</h3>
                  <p className="whitespace-pre-wrap">잠시 후에 다시 확인하시거나,<br/>관심사로 직접 인연을 찾아보세요!</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">선택하신 관심사에 맞는 인연을 찾지 못했어요.</h3>
                  <p className="whitespace-pre-wrap">관심사를 바꿔보세요!</p>
                </>
              )}
          </div>
      )
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 pt-6 pb-6">
      <div className="flex flex-col gap-2 mb-2 z-0">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {title || '오늘의 추천 인연'}
        </h1>
        {description ? (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {description}
          </div>
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            🤖 <span className="font-semibold text-[#FF8B7D]">AI 추천:</span> {userName ? `${userName}님` : '회원님'}과 취미가 비슷한 분들이에요!
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
        {profiles.map((profile) => (
          <div key={profile.id} className="w-full">
            <RecommendationCard
              profile={profile}
              onInterest={() => onAction('right', profile.id)}
              onPass={() => onAction('left', profile.id)}
              showAiReason={showAiReason}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
