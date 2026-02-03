'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

export function TopNavigation() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        const data = await api.get<{ count: number }>(`/notifications/unread-count?userId=${userId}`);
        setUnreadCount(data.count);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    }
    fetchUnreadCount();
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm">
      {/* Logo Area */}
      <Link href="/main" className="flex items-center">
        <span className="text-2xl font-black tracking-tight text-[#FF8B7D]">SIBOM</span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="relative text-gray-700 hover:text-gray-900"
          aria-label="알림"
        >
          <Bell className="h-6 w-6" />
          {/* Red Dot for notifications */}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/settings"
          className="text-gray-700 hover:text-gray-900"
          aria-label="설정"
        >
          <Settings className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
