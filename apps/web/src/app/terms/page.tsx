'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">서비스 이용약관</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <p className="text-sm text-gray-500">
              시행일자: 2026년 1월 1일
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제1조 (목적)</h2>
            <p>
              이 약관은 SIBOM(이하 "회사")이 제공하는 매칭 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제2조 (용어의 정의)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>"서비스"란 회사가 제공하는 50대 이상을 위한 AI 기반 매칭 플랫폼 및 관련 서비스를 의미합니다.</li>
              <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 회사와 서비스 이용계약을 체결하고 회원 아이디(ID)를 부여받은 자를 의미합니다.</li>
              <li>"매칭"이란 회사가 제공하는 AI 알고리즘 또는 이용자의 선택에 따라 다른 회원을 추천하는 서비스를 의미합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제3조 (약관의 게시와 개정)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면 또는 연결화면에 게시합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
              <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터
              적용일자 전일까지 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제4조 (회원가입)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
              <li>회원가입은 만 50세 이상의 성인만 가능합니다.</li>
              <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승인을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>부정한 용도로 서비스를 이용하고자 하는 경우</li>
                  <li>이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제5조 (서비스의 제공 및 변경)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사는 다음과 같은 서비스를 제공합니다.
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>AI 기반 매칭 추천 서비스</li>
                  <li>관심사 기반 매칭 서비스</li>
                  <li>메시지 교환 서비스</li>
                  <li>프로필 관리 서비스</li>
                  <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 서비스</li>
                </ul>
              </li>
              <li>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제6조 (서비스의 중단)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을
              일시적으로 중단할 수 있습니다.</li>
              <li>회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여
              배상하지 않습니다. 단, 회사에 고의 또는 중과실이 있는 경우에는 그러하지 아니합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제7조 (회원의 의무)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회원은 다음 행위를 하여서는 안됩니다.
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                  <li>금전적 이득을 목적으로 서비스를 이용하는 행위</li>
                  <li>타 회원에게 불쾌감을 주거나 괴롭히는 행위</li>
                </ul>
              </li>
              <li>회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을
              준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제8조 (개인정보의 보호)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사는 관계 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.</li>
              <li>개인정보의 보호 및 이용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제9조 (회원탈퇴 및 자격 상실)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</li>
              <li>회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                  <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제10조 (책임제한)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한
              책임이 면제됩니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
              <li>회사는 회원이 서비스를 통해 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
              <li>회사는 이용자 간 또는 이용자와 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제11조 (분쟁해결)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를
              설치·운영합니다.</li>
              <li>회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다.</li>
              <li>서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">제12조 (준거법 및 재판관할)</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>회사와 이용자 간 제기된 소송은 대한민국법을 준거법으로 합니다.</li>
              <li>회사와 이용자 간 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제소합니다.</li>
            </ol>
          </section>

          <section className="rounded-lg bg-gray-50 p-4">
            <p className="font-semibold">부칙</p>
            <p className="mt-2">본 약관은 2026년 1월 1일부터 시행됩니다.</p>
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
