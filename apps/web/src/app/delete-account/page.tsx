'use client';

import { useState } from 'react';
import { AlertTriangle, Mail, CheckCircle } from 'lucide-react';

export default function DeleteAccountPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('dearrighthand@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">계정 삭제 요청</h1>

        <div className="space-y-8 text-gray-700">
          {/* Warning Section */}
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-red-900">계정 삭제 시 주의사항</h2>
                <ul className="space-y-2 text-red-800">
                  <li>• 계정 삭제 후에는 <strong>복구가 불가능</strong>합니다.</li>
                  <li>• 삭제된 데이터는 <strong>영구적으로 삭제</strong>되며 복원할 수 없습니다.</li>
                  <li>• 삭제 처리 후에는 동일한 정보로 재가입이 가능하나, 이전 데이터는 복구되지 않습니다.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What will be deleted */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">삭제되는 정보</h2>
            <div className="rounded-lg bg-gray-50 p-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-[#FF8B7D]">•</span>
                  <span>프로필 정보 (이름, 사진, 자기소개, 관심사 등)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-[#FF8B7D]">•</span>
                  <span>매칭 기록 및 좋아요 내역</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-[#FF8B7D]">•</span>
                  <span>채팅 메시지 및 대화 내역</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-[#FF8B7D]">•</span>
                  <span>서비스 이용 기록</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-[#FF8B7D]">•</span>
                  <span>기타 모든 개인정보</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                * 단, 관계 법령에 따라 보관이 필요한 정보는 일정 기간 보관 후 삭제됩니다.
              </p>
            </div>
          </section>

          {/* How to delete */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">계정 삭제 방법</h2>

            <div className="space-y-6">
              {/* Method 1: In-app */}
              <div className="rounded-lg border-2 border-gray-200 p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">방법 1: 앱 내에서 직접 삭제</h3>
                <ol className="space-y-2 pl-6">
                  <li className="list-decimal">SIBOM 앱 실행</li>
                  <li className="list-decimal">마이페이지(MY) 탭 이동</li>
                  <li className="list-decimal">설정(⚙️) 버튼 클릭</li>
                  <li className="list-decimal">'계정 관리' 메뉴 선택</li>
                  <li className="list-decimal">'계정 삭제' 버튼 클릭</li>
                  <li className="list-decimal">주의사항 확인 후 최종 삭제 진행</li>
                </ol>
                <p className="mt-4 text-sm text-gray-600">즉시 처리되며 별도의 승인 절차가 없습니다.</p>
              </div>

              {/* Method 2: Email */}
              <div className="rounded-lg border-2 border-[#FF8B7D] bg-[#FFF5F3] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">방법 2: 이메일로 삭제 요청</h3>
                <p className="mb-4">앱에 접속할 수 없는 경우, 이메일로 계정 삭제를 요청하실 수 있습니다.</p>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold text-gray-900">받는 사람:</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={copyEmail}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-mono text-sm hover:bg-gray-50"
                      >
                        <Mail className="h-4 w-4 text-[#FF8B7D]" />
                        dearrighthand@gmail.com
                        {copied && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </button>
                      {copied && <span className="text-sm text-green-600">복사됨!</span>}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-gray-900">이메일 제목:</p>
                    <p className="rounded bg-white px-4 py-2 font-mono text-sm">[계정 삭제 요청] 이름</p>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-gray-900">필수 포함 정보:</p>
                    <ul className="space-y-1 rounded bg-white px-4 py-3">
                      <li>• 이름 (가입 시 등록한 이름)</li>
                      <li>• 휴대전화번호 (가입 시 사용한 번호)</li>
                      <li>• 삭제 요청 사유 (선택사항)</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-yellow-50 p-4">
                    <p className="text-sm text-gray-700">
                      <strong>처리 기간:</strong> 영업일 기준 3-5일 이내 처리됩니다.
                      <br />
                      처리 완료 시 등록하신 이메일로 안내드립니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Email template */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">이메일 작성 예시</h2>
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
{`제목: [계정 삭제 요청] 홍길동

안녕하세요.
SIBOM 계정 삭제를 요청합니다.

■  가입 정보
- 이름: 홍길동
- 휴대전화번호: 010-1234-5678
- 삭제 사유: 서비스 이용 종료

위 계정과 관련된 모든 개인정보 삭제를 요청합니다.

감사합니다.`}
              </pre>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Q. 계정 삭제 후 재가입이 가능한가요?</h3>
                <p className="text-gray-700">
                  네, 가능합니다. 다만 이전 데이터는 복구되지 않으며, 새로운 계정으로 시작하게 됩니다.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Q. 일부 정보만 삭제할 수 있나요?</h3>
                <p className="text-gray-700">
                  계정을 유지하면서 일부 정보만 수정하시려면 앱 내 '프로필 수정' 기능을 이용해주세요.
                  계정 삭제 시에는 모든 정보가 삭제됩니다.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Q. 삭제 처리가 완료되었는지 어떻게 확인하나요?</h3>
                <p className="text-gray-700">
                  이메일로 요청하신 경우, 처리 완료 시 등록된 이메일로 안내드립니다.
                  앱 내에서 직접 삭제하신 경우 즉시 처리됩니다.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Q. 삭제를 취소할 수 있나요?</h3>
                <p className="text-gray-700">
                  이메일 요청의 경우 처리 전까지는 취소 가능합니다. 앱 내에서 직접 삭제한 경우 즉시 처리되어 취소가 불가능합니다.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-lg bg-gray-100 p-6">
            <h2 className="mb-3 text-xl font-bold text-gray-900">문의사항</h2>
            <p className="mb-2 text-gray-700">
              계정 삭제와 관련하여 추가 문의사항이 있으시면 아래로 연락주세요.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#FF8B7D]" />
              <span className="font-semibold text-gray-900">dearrighthand@gmail.com</span>
            </div>
          </section>
        </div>

        {/* Back button */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
