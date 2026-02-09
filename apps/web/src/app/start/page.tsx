'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Smartphone, Download } from 'lucide-react';

export default function StartPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [os, setOs] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // Detect OS
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setOs('android');
      setIsMobile(true);
      // Try to open Android App
      window.location.href = 'intent://open#Intent;scheme=sibom;package=com.dearrighthand.sibom;end';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setOs('ios');
      setIsMobile(true);
      // Try to open iOS App (Custom Scheme)
      window.location.href = 'sibom://open';
      
      // Fallback to App Store after delay (implementation varies, often just let user click)
      setTimeout(() => {
         // Optional: Redirect to App Store automatically? 
         // window.location.href = 'https://apps.apple.com/app/id...';
      }, 2500);
    }
  }, []);

  const handleOpenApp = () => {
    if (os === 'android') {
      window.location.href = 'intent://open#Intent;scheme=sibom;package=com.dearrighthand.sibom;end';
    } else if (os === 'ios') {
      window.location.href = 'sibom://open';
    } else {
        alert('모바일 기기에서 이용해주세요.');
    }
  };

  const handleDownload = () => {
    if (os === 'android') {
       window.location.href = 'https://play.google.com/store/apps/details?id=com.dearrighthand.sibom';
    } else if (os === 'ios') {
       // TODO: Replace with actual App Store ID
       window.location.href = 'https://apps.apple.com/kr/app/sibom/id6740682281'; 
    } else {
       // Default to One Link or Homepage
       alert('모바일 기기에서 스토어를 열어주세요.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-8 relative h-32 w-32 overflow-hidden rounded-3xl shadow-xl">
         <Image 
           src="/icons/icon-192x192.png" 
           alt="SIBOM App Icon" 
           fill 
           className="object-cover"
         />
      </div>

      <h1 className="mb-4 text-3xl font-bold text-gray-900">
        SIBOM 앱에서<br />
        더 편하게 만나보세요
      </h1>
      
      <p className="mb-12 text-gray-500">
        앱을 설치하면 실시간 알림과<br />
        더 많은 기능을 이용할 수 있어요.
      </p>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <button 
          onClick={handleOpenApp}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFE812] py-4 text-lg font-bold text-[#3C1E1E] shadow-md transition active:scale-95"
        >
          <Smartphone className="h-6 w-6" />
          앱 실행하기
        </button>

        <button 
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-lg font-bold text-gray-900 shadow-sm transition hover:bg-gray-50 active:scale-95"
        >
          <Download className="h-6 w-6" />
          {os === 'ios' ? 'App Store에서 다운로드' : 'Google Play에서 다운로드'}
        </button>
      </div>
      
      {!isMobile && (
        <p className="mt-8 text-sm text-gray-400">
           PC에서는 앱 다운로드가 불가능합니다.<br/>
           모바일 기기로 접속해주세요.
        </p>
      )}
    </div>
  );
}
