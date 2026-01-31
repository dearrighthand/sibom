'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface GlobalDialogProps {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  type: 'alert' | 'confirm';
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function GlobalDialog({
  isOpen,
  title,
  description,
  type,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: GlobalDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[320px] bg-white rounded-3xl p-6 shadow-xl transform transition-all animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
        {/* Icon for Alert (Success) - Only showing check for alert type as per screenshot 1 */}
        {type === 'alert' && (
          <div className="w-12 h-12 bg-[#E7F4E8] rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-[#7D9D85]" strokeWidth={3} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2 whitespace-pre-wrap">{title}</h3>

        {/* Description */}
        {description && (
          <div className="text-[#666666] text-base mb-6 whitespace-pre-wrap">{description}</div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 w-full mt-2">
          {type === 'confirm' ? (
            <>
              <button
                onClick={onCancel}
                className="flex-1 py-3.5 rounded-full bg-[#F5F5F0] text-[#666666] font-bold text-lg hover:bg-[#EBEBE6] transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3.5 rounded-full bg-[#7D9D85] text-white font-bold text-lg hover:bg-[#6d8d75] transition-colors"
              >
                {confirmText}
              </button>
            </>
          ) : (
            // Alert - Single Button
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 rounded-full bg-[#FF8B7D] text-white font-bold text-lg hover:bg-[#ff7a6a] transition-colors shadow-md"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalDialog;
