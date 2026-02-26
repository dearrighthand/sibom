'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">개인정보처리방침</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <p className="mb-4">
              SIBOM(이하 '회사')은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등
              개인정보 보호 관련 법령을 준수하고 있습니다.
            </p>
            <p className="text-sm text-gray-500">
              시행일자: 2026년 1월 1일
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="mb-2">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
            이용 목적이 변경되는 경우에는 개인정보 보호법에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공, 본인확인, 부정 이용 방지</li>
              <li>매칭 서비스 제공: AI 기반 매칭 추천, 프로필 정보 제공, 관심사 기반 매칭</li>
              <li>서비스 개선: 서비스 이용 통계 분석, 맞춤형 서비스 제공</li>
              <li>고객 지원: 문의사항 처리, 공지사항 전달</li>
              <li>마케팅 및 광고: 이벤트 및 프로모션 정보 제공 (선택 동의 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. 수집하는 개인정보 항목</h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">가. 필수 수집 항목</h3>
                <ul className="list-disc space-y-1 pl-6">
                  <li>이름, 휴대전화번호</li>
                  <li>생년월일, 성별</li>
                  <li>거주 지역</li>
                  <li>프로필 사진</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">나. 선택 수집 항목</h3>
                <ul className="list-disc space-y-1 pl-6">
                  <li>관심사, 취미</li>
                  <li>자기소개</li>
                  <li>선호하는 매칭 조건</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">다. 자동 수집 항목</h3>
                <ul className="list-disc space-y-1 pl-6">
                  <li>서비스 이용 기록, 접속 로그</li>
                  <li>기기 정보 (OS, 앱 버전 등)</li>
                  <li>IP 주소</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">라. 카카오톡 간편 로그인 시</h3>
                <ul className="list-disc space-y-1 pl-6">
                  <li>카카오 계정 정보 (이메일, 프로필 정보)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. 개인정보의 보유 및 이용 기간</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>회원 탈퇴 시까지: 회원 정보, 서비스 이용 기록</li>
              <li>탈퇴 후 즉시 파기 (단, 관련 법령에 따라 보관이 필요한 경우 예외)</li>
              <li>부정 이용 방지를 위한 정보: 탈퇴 후 6개월</li>
            </ul>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">관련 법령에 따른 보관</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                <li>접속에 관한 기록: 3개월 (통신비밀보호법)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. 개인정보의 제3자 제공</h2>
            <p className="mb-2">회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. 개인정보 처리의 위탁</h2>
            <p className="mb-2">회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">수탁업체</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">위탁 업무 내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Google (Gemini AI)</td>
                    <td className="border border-gray-300 px-4 py-2">AI 매칭 추천 서비스</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">카카오</td>
                    <td className="border border-gray-300 px-4 py-2">카카오톡 간편 로그인</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. 정보주체의 권리·의무 및 행사 방법</h2>
            <p className="mb-2">이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정 요구</li>
              <li>개인정보 삭제 요구</li>
              <li>개인정보 처리 정지 요구</li>
            </ul>
            <p className="mt-4">권리 행사는 앱 내 '설정 &gt; 개인정보 관리' 메뉴 또는 고객센터를 통해 가능합니다.</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">7. 개인정보의 파기</h2>
            <p className="mb-2">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>

            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">파기 절차 및 방법</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>전자적 파일: 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">8. 개인정보 보호책임자</h2>
            <p className="mb-4">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
            아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold">개인정보 보호책임자</p>
              <ul className="mt-2 space-y-1">
                <li>담당자: SIBOM 개인정보보호팀</li>
                <li>이메일: dearrighthand@gmail.com</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">9. 개인정보의 안전성 확보 조치</h2>
            <p className="mb-2">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>개인정보 암호화: 비밀번호 등 중요 정보는 암호화하여 저장 및 관리</li>
              <li>해킹 등에 대비한 기술적 대책: 방화벽, 백신 프로그램 등 설치</li>
              <li>개인정보 취급 직원의 최소화 및 교육: 담당 직원에 한하여 개인정보 접근 권한 부여</li>
              <li>접근 통제: 개인정보를 처리하는 시스템에 대한 접근권한의 부여, 변경, 말소 등을 통하여 개인정보에 대한 접근통제</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">10. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
            <p className="mb-2">회사는 서비스 이용 과정에서 다음과 같은 정보가 자동으로 생성되어 수집될 수 있습니다.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>IP주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록, 기기정보</li>
              <li>모바일 앱 이용 시: 광고식별자, 기기 고유번호, OS 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">11. 개인정보 처리방침의 변경</h2>
            <p>이 개인정보 처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
            변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">12. 개인정보 침해 관련 상담 및 신고</h2>
            <p className="mb-2">개인정보 침해에 관한 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>개인정보 침해신고센터 (한국인터넷진흥원 운영): 국번없이 118 (privacy.kisa.or.kr)</li>
              <li>개인정보 분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
              <li>대검찰청 사이버수사과: 국번없이 1301 (www.spo.go.kr)</li>
              <li>경찰청 사이버안전국: 국번없이 182 (cyberbureau.police.go.kr)</li>
            </ul>
          </section>
        </div>

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
