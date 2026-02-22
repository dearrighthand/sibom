'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useDialog } from '@/hooks/useDialog';

export default function FindPasswordPage() {
  const router = useRouter();
  const { alert: openAlert } = useDialog();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSuccess(true);
      openAlert('입력하신 이메일로 비밀번호 재설정 링크를 전송했습니다. 이메일함을 확인해주세요.');
    } catch (err) {
      console.error('Find password error:', err);
      openAlert('비밀번호 재설정 이메일 전송에 실패했습니다. 이메일 주소를 다시 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold">비밀번호 찾기</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 py-8">
        {!isSuccess ? (
          <>
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                가입하신 이메일을 입력해주세요
              </h2>
              <p className="text-gray-500">
                해당 이메일로 비밀번호 재설정 링크를 보내드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소 입력"
                  required
                  className="min-h-[56px] w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-lg text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FF8B7D] focus:bg-white focus:ring-1 focus:ring-[#FF8B7D]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-xl bg-[#FF8B7D] px-6 py-4 text-white shadow-md transition-transform active:scale-95 hover:bg-[#FF7A6B] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <span className="text-xl font-bold">
                  {isLoading ? '전송 중...' : '다음'}
                </span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9]">
              <svg className="h-10 w-10 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              이메일이 전송되었습니다
            </h2>
            <p className="mb-8 text-gray-500">
              {email}으로 비밀번호 재설정 링크를 보냈습니다.<br />
              이메일을 확인해주세요.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="flex min-h-[56px] w-full items-center justify-center rounded-xl bg-[#FF8B7D] px-6 py-4 text-white shadow-md transition-transform active:scale-95 hover:bg-[#FF7A6B]"
            >
              <span className="text-xl font-bold">로그인으로 돌아가기</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
