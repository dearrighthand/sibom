'use client';

import { differenceInHours, differenceInDays } from 'date-fns';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

interface ReceivedLikeCardProps {
  match: {
    id: string; // The sender's ID
    matchId: string;
    name: string;
    age: number;
    location: string;
    imageUrl: string;
    interests: string[];
    bio: string | null;
    status?: 'PENDING' | 'ACCEPTED';
    receivedAt: string | Date;
  };
  onAccept: (id: string, name: string, image: string) => void;
  onReject: (id: string) => void;
}

export function ReceivedLikeCard({ match, onAccept, onReject }: ReceivedLikeCardProps) {
  const timeAgo = () => {
    const date = new Date(match.receivedAt);
    const now = new Date();
    const hours = differenceInHours(now, date);
    
    if (hours < 24) {
      if (hours === 0) {
        const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
        return minutes < 1 ? '방금' : `${minutes}분 전`;
      }
      return `${hours}시간 전`;
    }
    return `${differenceInDays(now, date)}일 전`;
  };

  const isAccepted = match.status === 'ACCEPTED';

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex gap-4">
        {/* Profile Image */}
        <div className="relative w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
            <Image
                src={match.imageUrl}
                alt={match.name}
                fill
                className="object-cover"
            />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-lg font-bold text-[#2D2D2D]">
                {match.name}, {match.age}세
              </span>
              <span className="text-xs text-gray-400">{timeAgo()}</span>
            </div>
            
            <p className="text-sm text-[#666666] line-clamp-1 mt-1">
              {match.bio || '자기소개가 없습니다.'}
            </p>
          </div>

          <div className="flex gap-1.5 mt-2">
            {match.interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                {interest}
              </span>
            ))}
            {match.interests.length > 3 && (
              <span className="text-xs font-medium text-gray-400 px-1 py-1">
                +{match.interests.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-1">
        {isAccepted ? (
          <button 
            onClick={() => window.location.href = `/chat/${match.matchId}`}
            className="flex-1 py-3 rounded-xl bg-[#7D9D85] text-white font-bold text-sm hover:bg-[#6d8d75] transition-colors shadow-md shadow-[#7D9D85]/20 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            채팅하기
          </button>
        ) : (
          <>
            <button 
              onClick={() => onReject(match.id)}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              거절하기
            </button>
            <button 
              onClick={() => onAccept(match.id, match.name, match.imageUrl)}
              className="flex-[2] py-3 rounded-xl bg-[#FF8B7D] text-white font-bold text-sm hover:bg-[#ff7a6a] transition-colors shadow-md shadow-[#FF8B7D]/20"
            >
              수락하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
