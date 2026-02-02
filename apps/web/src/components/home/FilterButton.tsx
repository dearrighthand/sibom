'use client';

import { Search } from 'lucide-react';

interface FilterButtonProps {
  onClick?: () => void;
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 mx-auto flex w-full max-w-md justify-center px-4">
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-white shadow-xl transition-transform active:scale-95 hover:bg-gray-800"
      >
        <Search className="h-5 w-5" />
        <span className="text-lg font-semibold">관심사로 찾기</span>
      </button>
    </div>
  );
}
