import Link from 'next/link';

export default function ChildSafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">아동 안전 표준</h1>
          <p className="text-lg text-gray-600">
            SIBOM은 모든 사용자의 안전을 최우선으로 하며, 특히 아동 및 미성년자 보호를 위해 엄격한 정책을 시행합니다.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-12">
          {/* 1. 연령 제한 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. 연령 제한 정책</h2>
            <div className="rounded-lg bg-[#FFF5F3] border border-[#FF8B7D]/30 p-6">
              <p className="mb-3 font-semibold text-gray-900">SIBOM은 만 50세 이상만 이용 가능합니다</p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>회원가입 시 생년월일 인증 필수</li>
                <li>만 50세 미만의 사용자는 서비스 이용 불가</li>
                <li>허위 정보 입력 시 계정 영구 정지</li>
                <li>연령 확인은 휴대폰 본인인증을 통해 진행</li>
              </ul>
            </div>
          </section>

          {/* 2. 아동 성적 학대 및 착취 방지 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. 아동 성적 학대 및 착취(CSAE) 제로 톨러런스 정책
            </h2>
            <p className="mb-4 text-gray-700">
              SIBOM은 아동 성적 학대 및 착취(Child Sexual Abuse and Exploitation)에 대해 절대 관용하지 않습니다.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>아동 성적 학대 자료(CSAM) 업로드, 공유, 배포 행위 즉시 신고 및 계정 영구 정지</li>
              <li>미성년자를 대상으로 한 성적 콘텐츠 또는 그루밍(grooming) 행위 금지</li>
              <li>의심되는 활동 발견 시 즉시 관련 법 집행 기관에 신고</li>
              <li>국제아동성착취영상신고센터(INHOPE) 및 국내 관련 기관과 협력</li>
            </ul>
          </section>

          {/* 3. 콘텐츠 모더레이션 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. 콘텐츠 모더레이션 및 안전 조치</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">자동 필터링 시스템</h3>
                <ul className="list-disc space-y-1 pl-6">
                  <li>AI 기반 부적절한 콘텐츠 자동 감지</li>
                  <li>욕설, 비속어, 성적 표현 실시간 차단</li>
                  <li>프로필 사진 및 메시지 자동 모니터링</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">수동 검토 프로세스</h3>
                <ul className="list-disc space-y-1 pl-6">
                  <li>신고된 콘텐츠 24시간 이내 검토</li>
                  <li>전문 검토팀의 신속한 대응</li>
                  <li>정책 위반 시 경고 또는 계정 정지 조치</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. 신고 및 차단 기능 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. 사용자 신고 및 차단 기능</h2>
            <p className="mb-4 text-gray-700">
              모든 사용자는 부적절한 행동을 쉽게 신고하고 원치 않는 사용자를 차단할 수 있습니다.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>
                <strong>신고 기능:</strong> 채팅 중 부적절한 언행, 성적 메시지, 스팸, 사기 등 신고 가능
              </li>
              <li>
                <strong>차단 기능:</strong> 원치 않는 사용자 즉시 차단, 더 이상 서로 표시되지 않음
              </li>
              <li>
                <strong>익명 신고:</strong> 신고자 정보는 보호되며 피신고자에게 공개되지 않음
              </li>
              <li>
                <strong>빠른 접근:</strong> 앱 내 모든 대화 및 프로필에서 신고/차단 버튼 제공
              </li>
            </ul>
          </section>

          {/* 5. 개인정보 보호 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. 개인정보 보호 및 데이터 보안</h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>모든 사용자 데이터는 암호화되어 안전하게 저장</li>
              <li>개인 연락처 정보는 매칭 이후에만 공유 가능</li>
              <li>제3자에게 사용자 정보 무단 공유 금지</li>
              <li>
                <Link href="/privacy" className="text-[#FF8B7D] hover:underline">
                  개인정보처리방침
                </Link>{' '}
                준수
              </li>
            </ul>
          </section>

          {/* 6. 법 집행 기관 협력 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. 법 집행 기관과의 협력</h2>
            <p className="mb-4 text-gray-700">
              SIBOM은 관련 법률 및 규정을 준수하며, 범죄 행위 발견 시 적극적으로 협력합니다.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>아동 성적 학대 자료(CSAM) 발견 시 즉시 경찰청 사이버안전국에 신고</li>
              <li>법적 요청 시 수사 기관에 필요한 정보 제공</li>
              <li>국내외 아동 보호 단체와 협력</li>
            </ul>
          </section>

          {/* 7. 정책 위반 시 조치 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">7. 정책 위반 시 조치 사항</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      위반 사항
                    </th>
                    <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      조치
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">아동 성적 학대 자료(CSAM) 관련</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="font-semibold text-red-600">즉시 계정 영구 정지 + 법 집행 기관 신고</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">부적절한 성적 메시지</td>
                    <td className="px-6 py-4 text-sm text-gray-700">경고 후 반복 시 계정 정지</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">욕설, 혐오 발언</td>
                    <td className="px-6 py-4 text-sm text-gray-700">경고 또는 일시 정지 (1~30일)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">스팸, 광고 행위</td>
                    <td className="px-6 py-4 text-sm text-gray-700">경고 후 반복 시 계정 정지</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">연령 허위 기재</td>
                    <td className="px-6 py-4 text-sm text-gray-700">즉시 계정 영구 정지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. 신고 연락처 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">8. 신고 및 문의 연락처</h2>
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="mb-4 font-semibold text-gray-900">
                아동 안전 관련 신고 및 문의는 아래 연락처로 해주시기 바랍니다.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>이메일:</strong>{' '}
                  <a href="mailto:dearrighthand@gmail.com" className="text-[#FF8B7D] hover:underline">
                    dearrighthand@gmail.com
                  </a>
                </li>
                <li>
                  <strong>담당부서:</strong> SIBOM 안전관리팀
                </li>
                <li>
                  <strong>대응 시간:</strong> 24시간 이내 검토 및 대응
                </li>
              </ul>
            </div>
          </section>

          {/* 9. 외부 기관 신고 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">9. 외부 아동 보호 기관</h2>
            <p className="mb-4 text-gray-700">
              아동 성적 학대 및 착취 관련 긴급 신고는 아래 기관에도 직접 신고 가능합니다.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>경찰청 사이버안전국:</strong>{' '}
                <a href="https://www.police.go.kr" className="text-[#FF8B7D] hover:underline" target="_blank" rel="noopener noreferrer">
                  www.police.go.kr
                </a>
              </li>
              <li>
                <strong>한국인터넷진흥원(KISA) 불법·유해정보 신고:</strong>{' '}
                <a href="https://www.kisa.or.kr" className="text-[#FF8B7D] hover:underline" target="_blank" rel="noopener noreferrer">
                  www.kisa.or.kr
                </a>
              </li>
              <li>
                <strong>아동권리보장원:</strong>{' '}
                <a href="https://www.ncrc.or.kr" className="text-[#FF8B7D] hover:underline" target="_blank" rel="noopener noreferrer">
                  www.ncrc.or.kr
                </a>
              </li>
            </ul>
          </section>

          {/* 10. 정책 업데이트 */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">10. 정책 업데이트</h2>
            <p className="mb-4 text-gray-700">
              본 아동 안전 표준은 관련 법률 및 규정의 변경, 서비스 개선에 따라 업데이트될 수 있습니다.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>정책 변경 시 앱 공지 및 이메일 안내</li>
              <li>중요 변경 사항은 최소 7일 전 사전 공지</li>
              <li>최신 정책은 항상 본 페이지에서 확인 가능</li>
            </ul>
            <p className="mt-6 text-sm text-gray-500">
              <strong>최종 업데이트:</strong> 2025년 2월 26일
            </p>
          </section>

          {/* Footer */}
          <div className="mt-12 rounded-lg border border-[#FF8B7D]/30 bg-[#FFF5F3] p-6 text-center">
            <p className="mb-4 text-lg font-semibold text-gray-900">
              SIBOM은 모든 사용자의 안전을 최우선으로 합니다
            </p>
            <p className="text-gray-700">
              부적절한 행동을 발견하시면 즉시 신고해 주시기 바랍니다.
              <br />
              함께 안전한 커뮤니티를 만들어 갑니다.
            </p>
            <div className="mt-6 flex justify-center gap-4 text-sm">
              <Link href="/terms" className="text-[#FF8B7D] hover:underline">
                서비스 이용약관
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/privacy" className="text-[#FF8B7D] hover:underline">
                개인정보처리방침
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/delete-account" className="text-[#FF8B7D] hover:underline">
                계정 삭제
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
