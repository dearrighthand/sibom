'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDialog } from '../../../hooks/useDialog';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';
import { api } from '@/lib/api';

export default function PhoneAuthPage() {
  const { setPhoneNumber } = useRegistrationStore();
  const [phoneNumber, setPhoneNumberState] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes = 180 seconds
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Ref for OTP inputs to handle focus management
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone number as user types (010-1234-5678)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const rawValue = e.target.value.replace(/[^0-9]/g, '');

    // Limit to 11 digits
    const truncatedValue = rawValue.slice(0, 11);

    // Format
    let formattedValue = truncatedValue;
    if (truncatedValue.length > 3 && truncatedValue.length <= 7) {
      formattedValue = `${truncatedValue.slice(0, 3)}-${truncatedValue.slice(3)}`;
    } else if (truncatedValue.length > 7) {
      formattedValue = `${truncatedValue.slice(0, 3)}-${truncatedValue.slice(3, 7)}-${truncatedValue.slice(7)}`;
    }

    setPhoneNumberState(formattedValue);

    // Simple validation (must be 10 or 11 digits originally)
    setIsPhoneValid(truncatedValue.length >= 10);
  };

  // Start timer when OTP section is shown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  // Format timer text (e.g., "3분 00초")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs.toString().padStart(2, '0')}초`;
  };

  const { alert } = useDialog();
  const router = useRouter();

  const handleRequestOtp = async () => {
    if (isPhoneValid) {
      try {
        const cleanedPhone = phoneNumber.replace(/-/g, '');
        await api.post('/auth/phone/send', { phone: cleanedPhone });
        
        // Success handling
        setShowOtp(true);
        setTimer(180); // Reset timer
        alert('인증번호가 발송되었습니다.', '문자메시지를 확인해 주세요.');
      } catch (error: any) {
        console.error(error);
        if (error.response?.status === 409) {
             alert('가입된 번호', '이미 가입된 휴대폰 번호입니다.');
             return;
        }
        alert('발송 실패', '인증번호 발송에 실패했습니다.\n다시 시도해주세요.');
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (isOtpComplete) {
      try {
        const cleanedPhone = phoneNumber.replace(/-/g, '');
        const code = otp.join('');
        await api.post('/auth/phone/verify', { phone: cleanedPhone, code });

        // Success handling

        await alert('인증 완료', '본인 인증이 완료되었습니다.');
        setPhoneNumber(cleanedPhone); // Save to store
        router.push('/auth/profile');
      } catch (error) {
        console.error(error);
        alert('인증 실패', '인증번호가 일치하지 않거나 만료되었습니다.');
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-10">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center shadow-sm">
        <Link href="/" className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <h1 className="text-xl font-bold text-[#2D2D2D]">본인 인증</h1>
      </div>

      <main className="px-6 pt-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Main Title */}
        <h2 className="w-full text-2xl font-bold text-[#2D2D2D] mb-8 leading-snug">
          휴대폰 번호를
          <br />
          인증해 주세요
        </h2>

        {/* Phone Input */}
        <div className="w-full mb-6">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
            disabled={showOtp}
            className={`w-full px-6 py-4 rounded-2xl border-2 bg-white outline-none text-2xl font-bold tracking-wider text-center transition-colors min-h-[64px]
              ${isPhoneValid || phoneNumber.length > 0 ? 'border-[#FF8B7D]' : 'border-gray-200 focus:border-[#FF8B7D]'}
              ${showOtp ? 'bg-gray-100 text-gray-500' : ''}
            `}
          />
        </div>

        {/* Request OTP Button */}
        <button
          onClick={handleRequestOtp}
          disabled={!isPhoneValid}
          className={`w-full rounded-full py-4 text-lg font-bold shadow-md transition-all active:scale-95 min-h-[56px] mb-10
            ${
              isPhoneValid
                ? 'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          인증번호 받기
        </button>

        {/* OTP Section (Conditional Render) */}
        {showOtp && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-4 px-2">
              <span className="text-lg font-medium text-[#666666]">인증번호 입력</span>
              <span className="text-lg font-bold text-[#EF4444]">{formatTime(timer)} 남음</span>
            </div>

            <div className="flex justify-between gap-1 mb-12">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputMode="numeric"
                  className={`w-[48px] h-[64px] text-center text-[28px] font-bold border-2 rounded-xl bg-white outline-none transition-colors
                    ${digit ? 'border-[#FF8B7D]' : 'border-[#E5E5E5] focus:border-[#FF8B7D]'}
                  `}
                />
              ))}
            </div>

            {/* Complete Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete}
              // Assuming "Secondary" color (#7D9D85) for success action per design system
              className={`w-full rounded-full py-4 text-lg font-bold shadow-md transition-all active:scale-95 min-h-[56px]
                ${
                  isOtpComplete
                    ? 'bg-[#7D9D85] text-white hover:bg-[#6d8d75]'
                    : 'bg-[#7D9D85]/50 text-white cursor-not-allowed'
                }
              `}
            >
              인증 완료
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
