'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { differenceInHours, differenceInDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import NextImage from 'next/image';

interface ChatRoom {
  id: string; // Room ID (Match ID)
  partnerId: string;
  partnerName: string;
  partnerImage: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function ChatListPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/login';
        return;
    }

    try {
        const data = await api.get<ChatRoom[]>(`/messages/rooms?userId=${userId}`);
        setRooms(data);
    } catch (error) {
        console.error('Failed to fetch rooms:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);

    if (hoursDiff < 24) {
        if (hoursDiff === 0) {
             const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
             return minutes < 1 ? '방금' : `${minutes}분 전`;
        }
        return format(date, 'a h:mm', { locale: ko });
    }
    if (daysDiff < 7) {
        return format(date, 'EEEE', { locale: ko }); // 요일
    }
    return format(date, 'MM.dd', { locale: ko });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <TopNavigation title="대화중인 인연" />

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
             <div className="flex h-40 items-center justify-center text-gray-500">
                 불러오는 중...
             </div>
        ) : rooms.length > 0 ? (
            <div className="bg-white divide-y divide-gray-100">
                {rooms.map(room => (
                    <div 
                        key={room.id}
                        onClick={() => router.push(`/chat/room?id=${room.id}`)}
                        className="px-6 py-5 flex items-center gap-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                    >
                        {/* Profile Image (60x60) */}
                        <div className="relative w-[60px] h-[60px] rounded-2xl overflow-hidden bg-gray-200 shrink-0">
                            <NextImage 
                                src={room.partnerImage} 
                                alt={room.partnerName} 
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-[#2D2D2D] truncate">
                                    {room.partnerName}
                                </h3>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {formatTime(room.lastMessageAt)}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <p className="text-[#666666] text-sm truncate pr-2">
                                    {room.lastMessage}
                                </p>
                                {room.unreadCount > 0 && (
                                    <div className="bg-[#FF8B7D] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                                        {room.unreadCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">아직 대화가 없어요</h3>
                <p className="text-gray-500 text-sm">
                    호감을 주고받아 매칭이 되면<br/>대화를 시작할 수 있습니다.
                </p>
            </div>
        )}
      </div>

      <FooterNavigation />
    </div>
  );
}
