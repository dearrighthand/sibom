'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { alert: openAlert } = useDialog();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      openAlert('유효하지 않은 링크입니다.');
      return;
    }

    if (password.length < 6) {
      openAlert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      openAlert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      openAlert('비밀번호가 성공적으로 변경되었습니다. 변경된 비밀번호로 로그인해주세요.');
      router.push('/login');
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      // Determine error message based on response status if possible
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        openAlert('만료되었거나 유효하지 않은 링크입니다. 비밀번호 재설정을 다시 요청해주세요.');
      } else {
        openAlert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm" style={{ paddingTop: 'calc(12px + var(--safe-area-inset-top, 0px))' }}>
        <button
          onClick={() => router.push('/login')}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          aria-label="로그인으로 가기"
        >
          <ArrowLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold">비밀번호 재설정</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            새로운 비밀번호를 입력해주세요
          </h2>
          <p className="text-gray-500">이후부터는 변경된 비밀번호로 로그인할 수 있습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="password" className="sr-only">
                새 비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새 비밀번호 입력 (6자 이상)"
                required
                minLength={6}
                className="min-h-[56px] w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-lg text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FF8B7D] focus:bg-white focus:ring-1 focus:ring-[#FF8B7D]"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 다시 입력"
                required
                minLength={6}
                className="min-h-[56px] w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-lg text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FF8B7D] focus:bg-white focus:ring-1 focus:ring-[#FF8B7D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-xl bg-[#FF8B7D] px-6 py-4 text-white shadow-md transition-transform active:scale-95 hover:bg-[#FF7A6B] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <span className="text-xl font-bold">
              {isLoading ? '변경 중...' : '확인'}
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
