'use client';

import React, { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitText?: string;
  onSubmit?: () => void;
  children: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  submitText,
  onSubmit,
  children,
}: BottomSheetProps) {
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300 bg-white">
        {/* Drag Handle (Visual only) */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-12 h-1.5 bg-[#E5E5E5] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[#2D2D2D]">{title}</h3>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto no-scrollbar">{children}</div>

        {/* Submit Button (Optional - specific for our use case like 'Done') */}
        {submitText && onSubmit && (
          <div className="mt-6">
            <button
              onClick={onSubmit}
              className="w-full rounded-full bg-[#FF8B7D] text-white py-4 text-lg font-bold shadow-md hover:bg-[#ff7a6a] transition-colors"
            >
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
