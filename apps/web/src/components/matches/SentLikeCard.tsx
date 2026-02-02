'use client';

import { differenceInHours, differenceInDays } from 'date-fns';
import Image from 'next/image';
import { MessageCircle, Clock } from 'lucide-react';

interface SentLikeCardProps {
  match: {
    id: string; // Receiver's ID
    matchId: string;
    name: string;
    age: number;
    location: string;
    imageUrl: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    sentAt: string | Date;
  };
}

export function SentLikeCard({ match }: SentLikeCardProps) {
  const timeAgo = () => {
    const date = new Date(match.sentAt);
    const now = new Date();
    const hours = differenceInHours(now, date);
    
    if (hours < 24) {
      return `${hours === 0 ? '방금' : `${hours}시간`} 전`;
    }
    return `${differenceInDays(now, date)}일 전`;
  };

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
      {/* Profile Image */}
      <div className="relative w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
        <Image
          src={match.imageUrl}
          alt={match.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info & Status */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-[#2D2D2D]">
                {match.name}, {match.age}세
            </h3>
            <span className="text-xs text-gray-400">{timeAgo()}</span>
        </div>
        
        {match.status === 'PENDING' ? (
             <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>상대방이 확인 중이에요 ⏳</span>
             </div>
        ) : match.status === 'ACCEPTED' ? (
            <button 
                onClick={() => window.location.href = `/chat/${match.matchId}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7D9D85] text-white text-sm font-bold shadow-sm hover:bg-[#6d8d75] transition-colors mt-1"
            >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>매칭 성공! 대화하기</span>
            </button>
        ) : (
            <span className="text-sm text-gray-400">연결되지 않았습니다.</span>
        )}
      </div>
    </div>
  );
}
