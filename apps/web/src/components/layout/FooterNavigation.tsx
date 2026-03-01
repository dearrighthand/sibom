'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, MessageCircle, User, Search } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/main', label: '홈', icon: Home },
  { href: '/match', label: '매칭', icon: Search },
  { href: '/likes', label: '호감', icon: Heart },
  { href: '/chat', label: '채팅', icon: MessageCircle },
  { href: '/mypage', label: 'MY', icon: User },
];

interface FooterNavigationProps {
  bottomOffset?: number;
}

export function FooterNavigation({ bottomOffset = 0 }: FooterNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 right-0 bg-white border-t border-gray-200 px-8 pt-3 flex justify-between items-center z-50"
      style={{ bottom: bottomOffset, paddingBottom: 'calc(12px + var(--safe-area-inset-bottom, 0px))' }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center min-w-[56px] ${
              isActive ? 'text-[#FF8B7D]' : 'text-gray-400'
            }`}
          >
            <Icon className="w-7 h-7" />
            <span className="text-xs font-bold mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
