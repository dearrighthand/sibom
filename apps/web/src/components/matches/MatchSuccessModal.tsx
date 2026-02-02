'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X, Heart } from 'lucide-react';

interface MatchSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  partnerImage: string;
  onChatStart: () => void;
}

export function MatchSuccessModal({ 
  isOpen, 
  onClose, 
  partnerName, 
  partnerImage,
  onChatStart 
}: MatchSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Use a small timeout to avoid synchronous setState inside useEffect warning
      const confettiTimer = setTimeout(() => setShowConfetti(true), 0);
      const stopTimer = setTimeout(() => setShowConfetti(false), 4000);
      return () => {
          clearTimeout(confettiTimer);
          clearTimeout(stopTimer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/60 dark:bg-black/60 backdrop-blur-md flex flex-col items-center justify-end sm:justify-center animate-in fade-in duration-300">
      
      {/* Dismiss Button */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
        >
          <X className="w-6 h-6 text-[#181110]" />
        </button>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <>
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#FF8B7D] left-[10%] animate-[fall_3s_linear_infinite]" />
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#FFD166] left-[20%] animate-[fall_2.5s_linear_infinite] delay-1000" />
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#FF8B7D] left-[30%] animate-[fall_3.2s_linear_infinite] delay-500" />
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#7D9D85] left-[50%] animate-[fall_2.8s_linear_infinite] delay-1500" />
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#FF8B7D] left-[60%] animate-[fall_3.5s_linear_infinite] delay-200" />
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#FFD166] left-[80%] animate-[fall_2.2s_linear_infinite] delay-1200" />
          <div className="absolute w-2.5 h-2.5 top-[-10%] bg-[#7D9D85] left-[90%] animate-[fall_3s_linear_infinite] delay-700" />
        </>
      )}

      {/* Main Content Card */}
      <div className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl p-6 pb-10 flex flex-col items-center relative overflow-hidden">
        
        {/* Soft Gradient Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#FF8B7D]/10 to-transparent pointer-events-none" />

        {/* Mascot / Text Content */}
        <div className="mt-8 mb-6 relative z-10 w-full flex flex-col items-center text-center">
            <h2 className="text-[#181110] tracking-tight text-[28px] font-bold leading-tight mb-3">
                축하합니다!
            </h2>
            <p className="text-[#4A4A4A] text-lg sm:text-xl font-medium leading-snug break-keep">
                <span className="text-[#FF8B7D] font-bold">{partnerName}</span>님과 대화를<br/>
                시작해보세요 💕
            </p>
        </div>

        {/* Profile Avatars */}
        <div className="flex items-center justify-center gap-4 mt-2 mb-8 z-10">
            {/* User Avatar (Placeholder or passed prop if available) */}
             {/* Note: We might want to pass user image too, but simpler to just show partner for now or fetch it. 
                 Let's just show partner focused design or simplified version. 
                 The mock showed two avatars. For simplicity let's assume we show the partner large. 
                 Or actually, simplified version: just the partner image with a heart. 
             */}
            
            <div className="relative">
                <div 
                    className="w-24 h-24 rounded-full border-4 border-[#FF8B7D] shadow-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${partnerImage})` }}
                />
                <div className="absolute -bottom-2 -right-2 bg-[#FF8B7D] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                    <Heart className="w-4 h-4 text-white fill-current" />
                </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-2 z-10 space-y-3">
            <button 
                onClick={onChatStart}
                className="w-full cursor-pointer items-center justify-center rounded-full h-14 bg-[#FF8B7D] hover:bg-[#ff7a6b] active:scale-[0.98] transition-all duration-200 text-white text-lg font-bold shadow-[0_4px_14px_0_rgba(255,140,128,0.39)] flex gap-2"
            >
                <MessageCircle className="w-6 h-6" />
                <span>대화 시작하기</span>
            </button>
            
            <button 
                onClick={onClose}
                className="w-full py-2 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
            >
                나중에 하기
            </button>
        </div>

      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
