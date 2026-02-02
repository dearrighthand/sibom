'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { useDialog } from '@/hooks/useDialog';

import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';

export default function SettingsPage() {
  const router = useRouter();
  const { alert: openAlert, confirm: openConfirm } = useDialog();

  // Notification State
  const [notifyLike, setNotifyLike] = useState(true);
  const [notifyMessage, setNotifyMessage] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // Display State
  const [fontSize, setFontSize] = useState(2); // 1: Small, 2: Medium, 3: Large, 4: XL
  const [brightnessMode, setBrightnessMode] = useState<'auto' | 'manual'>('auto');

  // Font Size Label Helper
  const getFontSizeLabel = (val: number) => {
    switch (val) {
      case 1: return '작게';
      case 2: return '보통';
      case 3: return '크게';
      case 4: return '매우 크게';
      default: return '보통';
    }
  };

  const handleLogout = async () => {
    const isConfirmed = await openConfirm(
        '로그아웃', 
        '정말 로그아웃 하시겠습니까?', 
        '로그아웃', 
        '취소'
    );
    
    if (isConfirmed) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      router.push('/login');
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = await openConfirm(
        '회원 탈퇴', 
        '탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠습니까?', 
        '탈퇴하기', 
        '취소'
    );

    if (isConfirmed) {
      // API call would go here
      localStorage.clear();
      await openAlert('탈퇴 완료', '회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] font-sans pb-20">
      <TopNavigation />

      {/* Page Header (Sub-header) */}
      <header className="bg-white px-4 py-3 sticky top-14 z-10 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </button>
        <h1 className="text-lg font-bold text-[#2D2D2D]">설정</h1>
      </header>

      <main className="flex-1 max-w-3xl mx-auto p-6 space-y-8 w-full">
        
        {/* Notification Settings */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">알림 설정</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-[#2D2D2D]">새 호감 알림</span>
              <Switch checked={notifyLike} onCheckedChange={setNotifyLike} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-[#2D2D2D]">새 메시지 알림</span>
              <Switch checked={notifyMessage} onCheckedChange={setNotifyMessage} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-[#2D2D2D]">마케팅 알림</span>
              <Switch checked={notifyMarketing} onCheckedChange={setNotifyMarketing} />
            </div>
          </div>
        </section>

        {/* Display Settings */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">화면 설정</h2>
          
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <span className="text-lg font-medium text-[#2D2D2D]">글자 크기</span>
              <span className="text-lg font-bold text-[#FF8B7D]">{getFontSizeLabel(fontSize)}</span>
            </div>
            <div className="px-2">
                <Slider 
                    min={1} 
                    max={4} 
                    value={fontSize} 
                    onChange={setFontSize} 
                />
                <div className="flex justify-between mt-2 text-sm text-[#999999] font-medium">
                    <span>가</span>
                    <span className="text-lg">가</span>
                    <span className="text-xl">가</span>
                    <span className="text-2xl">가</span>
                </div>
            </div>
          </div>

          <div>
             <span className="text-lg font-medium text-[#2D2D2D] block mb-4">화면 밝기</span>
             <div className="flex bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                <button
                    onClick={() => setBrightnessMode('auto')}
                    className={`flex-1 py-3.5 rounded-xl text-lg font-bold transition-all ${
                        brightnessMode === 'auto' 
                        ? 'bg-white text-[#2D2D2D] shadow-sm ring-1 ring-black/5' 
                        : 'text-[#999999] hover:text-[#666666]'
                    }`}
                >
                    자동
                </button>
                <button
                    onClick={() => setBrightnessMode('manual')}
                    className={`flex-1 py-3.5 rounded-xl text-lg font-bold transition-all ${
                        brightnessMode === 'manual' 
                        ? 'bg-white text-[#2D2D2D] shadow-sm ring-1 ring-black/5' 
                        : 'text-[#999999] hover:text-[#666666]'
                    }`}
                >
                    수동
                </button>
             </div>
          </div>
        </section>

        {/* Account Management */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">계정 관리</h2>
          <div className="space-y-1">
             <button className="w-full flex items-center justify-between py-4 text-left group">
                <span className="text-lg font-medium text-[#2D2D2D] group-hover:text-[#FF8B7D] transition-colors">비밀번호 변경</span>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </button>
             <div className="h-[1px] bg-gray-50" />
             <button className="w-full flex items-center justify-between py-4 text-left group">
                <span className="text-lg font-medium text-[#2D2D2D] group-hover:text-[#FF8B7D] transition-colors">휴대폰 번호 변경</span>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </button>
             <div className="h-[1px] bg-gray-50" />
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between py-4 text-left group"
             >
                <span className="text-lg font-medium text-[#2D2D2D] group-hover:text-[#FF8B7D] transition-colors">로그아웃</span>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </button>
             <div className="h-[1px] bg-gray-50" />
             <button 
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between py-4 text-left group"
             >
                <span className="text-lg font-medium text-red-500">계정 탈퇴</span>
                <ChevronRight className="w-6 h-6 text-red-300" />
             </button>
          </div>
        </section>

        {/* Customer Support */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">고객 지원</h2>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between py-4 text-left group">
                <span className="text-lg font-medium text-[#2D2D2D] group-hover:text-[#FF8B7D] transition-colors">자주 묻는 질문 (FAQ)</span>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </button>
             <div className="h-[1px] bg-gray-50" />
             <button className="w-full flex items-center justify-between py-4 text-left group">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-[#2D2D2D] group-hover:text-[#FF8B7D] transition-colors">1:1 문의하기</span>
                    <span className="bg-[#FAE100] text-[#3c1e1e] text-xs px-2 py-0.5 rounded font-bold">Kakao</span>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </button>
             <div className="h-[1px] bg-gray-50" />
             <Link href="/terms" className="w-full flex items-center justify-between py-4 text-left group">
                <span className="text-lg font-medium text-[#666666] group-hover:text-[#FF8B7D] transition-colors">서비스 이용약관</span>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </Link>
             <Link href="/privacy" className="w-full flex items-center justify-between py-4 text-left group">
                <span className="text-lg font-medium text-[#666666] group-hover:text-[#FF8B7D] transition-colors">개인정보 처리방침</span>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#FF8B7D]" />
             </Link>
          </div>
        </section>

        {/* Version Info */}
        <div className="text-center py-6">
            <p className="text-[#999999] text-sm">현재 버전 1.0.0</p>
        </div>

      </main>

      <FooterNavigation />
    </div>
  );
}
