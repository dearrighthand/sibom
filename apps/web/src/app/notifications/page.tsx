'use client';

import { useState, useEffect } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { api } from '@/lib/api';
import { Heart, MessageCircle, Bell, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'MATCH' | 'MESSAGE' | 'SYSTEM';
  content: string;
  metadata?: { matchId?: string; senderId?: string; partnerId?: string };
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/login');
          return;
        }
        const data = await api.get<Notification[]>(`/notifications?userId=${userId}`);
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, [router]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    try {
      await api.patch(`/notifications/${notification.id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }

    // Navigate based on type
    if (notification.type === 'MATCH') {
      router.push('/likes');
    } else if (notification.type === 'MESSAGE' && notification.metadata?.matchId) {
      router.push(`/chat/room?id=${notification.metadata.matchId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'MATCH':
        return <Heart className="w-6 h-6 text-[#FF8B7D]" />;
      case 'MESSAGE':
        return <MessageCircle className="w-6 h-6 text-[#4A90E2]" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500 animate-pulse">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] pb-32">
      <TopNavigation />

      <main className="flex-1 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">알림</h1>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">아직 알림이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all active:scale-[0.98] ${
                  notification.isRead
                    ? 'bg-white border border-gray-100'
                    : 'bg-[#FFF8F7] border border-[#FFAD9F]/30 shadow-sm'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    notification.isRead ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-base truncate ${
                      notification.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'
                    }`}
                  >
                    {notification.content}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </main>

      <FooterNavigation />
    </div>
  );
}
