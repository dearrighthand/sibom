'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { ReceivedLikeCard } from '@/components/matches/ReceivedLikeCard';
import { SentLikeCard } from '@/components/matches/SentLikeCard';
import { MatchSuccessModal } from '@/components/matches/MatchSuccessModal';
import { useDialog } from '@/hooks/useDialog';

interface LikeProfile {
    id: string; // The partner's ID
    matchId: string;
    name: string;
    age: number;
    location: string;
    imageUrl: string;
    interests: string[];
    bio: string | null;
    status?: 'PENDING' | 'ACCEPTED';
    receivedAt: string | Date;
}

interface SentLike {
    id: string;
    matchId: string;
    name: string;
    age: number;
    location: string;
    imageUrl: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    sentAt: string | Date;
}

type Tab = 'received' | 'sent';

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('received');
  const [receivedLikes, setReceivedLikes] = useState<LikeProfile[]>([]);
  const [sentLikes, setSentLikes] = useState<SentLike[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const { alert } = useDialog();

  // Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [matchedPartner, setMatchedPartner] = useState<{ name: string; image: string; matchId: string } | null>(null);

  const fetchLikes = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/login';
        return;
    }

    setIsLoading(true);
    try {
        if (activeTab === 'received') {
            const data = await api.get<LikeProfile[]>(`/matches/received?userId=${userId}`);
            setReceivedLikes(data);
        } else {
            const data = await api.get<SentLike[]>(`/matches/sent?userId=${userId}`);
            setSentLikes(data);
        }
    } catch (error) {
        console.error('Failed to fetch likes:', error);
    } finally {
        setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]); // Correct dependency

  const handleAccept = async (partnerId: string, partnerName: string, partnerImage: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        const response = await api.post<{ isMatch: boolean; matchId: string }>('/matches/like', { 
            userId, 
            receiverId: partnerId 
        });

        if (response.isMatch) {
            setMatchedPartner({ 
                name: partnerName, 
                image: partnerImage, 
                matchId: response.matchId 
            });
            setIsSuccessModalOpen(true);
            
            // Update local state instead of removing
            setReceivedLikes(prev => prev.map(item => 
                item.id === partnerId ? { ...item, status: 'ACCEPTED', matchId: response.matchId } : item
            ));
        } else {
             // Technically shouldn't happen if it was a received like (it's always a match if accepted)
             // But if status wasn't PENDING anymore, maybe just refresh
             fetchLikes();
        }
    } catch (error) {
        console.error('Accept failed:', error);
        await alert('오류', '처리에 실패했습니다.');
    }
  };

  const handleReject = async (partnerId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        await api.post('/matches/pass', { userId, receiverId: partnerId });
        setReceivedLikes(prev => prev.filter(item => item.id !== partnerId));
    } catch (error) {
        console.error('Reject failed:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <TopNavigation />
      
      {/* Page Title & Tabs */}
      <div className="bg-white px-6 pt-2 pb-0 border-b border-gray-200">
          <h1 className="text-2xl font-bold mb-4">호감</h1>
          
          <div className="flex">
            <button
                onClick={() => setActiveTab('received')}
                className={`flex-1 pb-4 text-center text-lg font-bold transition-colors border-b-2 ${
                    activeTab === 'received' 
                    ? 'text-[#FF8B7D] border-[#FF8B7D]' 
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
            >
                받은 호감
                {receivedLikes.filter(l => l.status !== 'ACCEPTED').length > 0 && activeTab === 'received' && (
                    <span className="ml-1.5 text-xs bg-[#FF8B7D] text-white px-1.5 py-0.5 rounded-full align-middle">
                        {receivedLikes.filter(l => l.status !== 'ACCEPTED').length}
                    </span>
                )}
            </button>
            <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 pb-4 text-center text-lg font-bold transition-colors border-b-2 ${
                    activeTab === 'sent' 
                    ? 'text-[#FF8B7D] border-[#FF8B7D]' 
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
            >
                보낸 호감
            </button>
          </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {isLoading ? (
             <div className="flex h-40 items-center justify-center text-gray-500">
                 불러오는 중...
             </div>
        ) : activeTab === 'received' ? (
            receivedLikes.length > 0 ? (
                receivedLikes.map(like => (
                    <ReceivedLikeCard 
                        key={like.matchId} 
                        match={like} 
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📭</span>
                    </div>
                    <p className="text-gray-500 text-lg">아직 받은 호감이 없어요.</p>
                    <p className="text-gray-400 text-sm mt-1">먼저 호감을 보내보세요!</p>
                </div>
            )
        ) : (
            sentLikes.length > 0 ? (
                sentLikes.map(like => (
                    <SentLikeCard key={like.matchId} match={like} />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                     <p className="text-gray-500 text-lg">보낸 호감이 없습니다.</p>
                </div>
            )
        )}
      </div>

      <FooterNavigation />

      <MatchSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        partnerName={matchedPartner?.name || ''}
        partnerImage={matchedPartner?.image || ''}
        onChatStart={() => {
            setIsSuccessModalOpen(false);
            if (matchedPartner?.matchId) {
                window.location.href = `/chat/${matchedPartner.matchId}`; 
            } else {
                window.location.href = '/chat';
            }
        }}
      />
    </div>
  );
}
