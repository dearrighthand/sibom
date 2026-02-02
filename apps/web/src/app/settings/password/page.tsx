'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';
import { api } from '@/lib/api';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { alert: openAlert } = useDialog();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      await openAlert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      await openAlert('비밀번호 불일치', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      await openAlert('비밀번호 길이', '비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    try {
      await api.patch('/auth/password', {
        userId,
        currentPassword,
        newPassword,
      });

      await openAlert('변경 완료', '비밀번호가 성공적으로 변경되었습니다.');
      router.push('/settings');
    } catch (err: any) {
      console.error('Failed to change password:', err);
      const message = err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다. 현재 비밀번호를 다시 확인해주세요.';
      await openAlert('오류', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] font-sans pb-20">
      <TopNavigation />

      {/* Header */}
      <header className="bg-white px-4 py-3 sticky top-14 z-10 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </button>
        <h1 className="text-lg font-bold text-[#2D2D2D]">비밀번호 변경</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="text-xl font-bold mb-4 block text-[#2D2D2D]">현재 비밀번호</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 사용 중인 비밀번호"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-[#FF8B7D] text-xl font-medium min-h-[56px]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-xl font-bold mb-4 block text-[#2D2D2D]">새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6자 이상 입력"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-[#FF8B7D] text-xl font-medium min-h-[56px]"
              />
              <p className="text-[#666666] text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                보안을 위해 6자 이상 입력해주세요.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xl font-bold mb-4 block text-[#2D2D2D]">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 다시 입력"
                className={`w-full px-6 py-4 rounded-2xl border-2 outline-none text-xl font-medium min-h-[56px] ${
                  confirmPassword && newPassword === confirmPassword 
                    ? 'border-green-500 focus:border-green-600' 
                    : 'border-gray-200 focus:border-[#FF8B7D]'
                }`}
              />
              {confirmPassword && (
                <p className={`text-sm mt-2 flex items-center gap-1 ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {newPassword === confirmPassword ? (
                    <><CheckCircle2 className="w-4 h-4" /> 비밀번호가 일치합니다.</>
                  ) : (
                    <><AlertCircle className="w-4 h-4" /> 비밀번호가 일치하지 않습니다.</>
                  )}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className={`w-full py-4 rounded-full text-xl font-bold transition-all shadow-md mt-4 ${
              isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a] active:scale-95'
            }`}
          >
            {isLoading ? '변경 중...' : '비밀번호 변경하기'}
          </button>
        </form>
      </main>

      <FooterNavigation />
    </div>
  );
}
