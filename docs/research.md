# 안드로이드 UI 깨짐 분석 보고서 (Safe Area 및 레이아웃 버그)

사용자께서 첨부해주신 스크린샷 3장을 분석한 결과, 주로 **안드로이드 기기에서 화면 상단의 상태표시줄(Status Bar)과 하단의 시스템 내비게이션 바(Navigation Bar) 영역**을 침범하는 문제가 발생하고 있는 것을 확인했습니다. 구체적인 페이지와 문제의 원인, 그리고 해결 방안을 검토했습니다.

## 1. 매칭 탭 (apps/web/src/app/match/page.tsx)
- **증상:** 최상단 헤더(TopNavigation - "새로운 인연찾기")가 아예 보이지 않거나 스크롤되어 사라지며, 그 하위의 "오늘의 추천 인연" 텍스트가 안드로이드 상태표시줄 영역까지 침범하여 상단 글씨가 잘립니다. 또한 "AI에 요청하기" 또는 "관심사로 찾기" 하단 플로팅 버튼이 제대로 뜨지 않습니다.
- **원인 분석:** 
  1. 페이지 최상위 `div`에 `overflow-hidden` 속성이 들어가 있었습니다. 부모 요소에 `overflow: hidden`이 적용될 경우, 자식 요소의 `position: sticky` 속성(TopNavigation이 사용 중)이 무력화되어 고정되지 않고 일반 컨텐츠처럼 화면 위로 스크롤되어 사라집니다. TopNavigation이 위로 올라가버리면, 그 자리에 "오늘의 추천 인연"이 밀고 올라가 상태표시줄(Safe Area) 영역을 침범하게 됩니다.
  2. 하단 플로팅 버튼의 위치를 잡을 때 `bottom: calc(80px + env(safe-area-inset-bottom, 0px))` 수식을 쓰고 있었습니다. 하지만 안드로이드 (Capacitor 환경)에서는 `env()` 대신 커스텀 변수 `var(--safe-area-inset-bottom)`을 통해 여백을 주입받으므로, 해당 수식이 제대로 계산되지 않아 UI가 하단 시스템 바 쪽에 묻히게 되었습니다.
- **수정 사항:** 
  - `overflow-hidden` 클래스를 제거하여 TopNavigation의 `sticky` CSS가 정상 작동하도록 수정했습니다.
  - 플로팅 버튼의 `env(safe-area-inset-bottom)`을 `var(--safe-area-inset-bottom)`으로 변경 적용했습니다.

## 2. 맞춤 매칭 탭 (apps/web/src/app/match/custom/page.tsx)
- **증상:** 상단의 "원하는 조건을 선택하세요(필터)" 헤더가 다른 상단 UI와 겹치거나 잘립니다.
- **원인 분석:** 필터 헤더의 위치를 `top-16`(고정 64px)으로 지정해 두었으나, TopNavigation이 상태표시줄(safe-area-inset-top, 약 30~50px)만큼 윗 공간을 차지하여 높이가 늘어난 상태이기 때문에 서로 겹치게 됩니다. 또한 이곳 역시 `overflow-hidden` 때문에 스크롤 버그가 발생할 수 있습니다.
- **수정 사항:** 
  - 필터 메뉴의 위치를 `top-[calc(64px+var(--safe-area-inset-top))]`으로 변경하여 TopNavigation의 변화된 높이를 동적으로 반영하도록 수정했습니다.
  - 매칭과 동일하게 `overflow-hidden` 및 `env()` 변수 버그를 수정했습니다.

## 3. 채팅방 (apps/web/src/app/chat/room/page.tsx)
- **증상:** 세 번째 스크린샷에서처럼 상단 상대방 이름이 표시되는 헤더가 위쪽 노치(혹은 카메라 구멍) 공간을 침범하고, 맨 아래의 "메시지를 입력하세요" 텍스트 폼이 안드로이드 하단 시스템 버튼(세모, 동그라미, 네모) 영역에 깔려 글자를 입력하기 불가능한 상태입니다.
- **원인 분석:** 상단 헤더와 하단 텍스트 폼 컨테이너에 Safe Area(안전 영역) 여백을 주도록 처리된 코드가 없었습니다. 단순히 일반적인 `py-3`, `p-4` 패딩만 적용되어 있어 시스템 바 영역과 UI가 완전히 겹치게 되었습니다.
- **수정 사항:** 
  - 상단 헤더 영역에 `paddingTop: 'calc(12px + var(--safe-area-inset-top, 0px))'` 를 주어 상태표시줄만큼 컨텐츠를 아래로 밀어냈습니다.
  - 하단 메시지 입력 폼 영역에 `paddingBottom: 'calc(12px + var(--safe-area-inset-bottom, 0px))'` 를 주어 시스템 내비게이션 바 높이만큼 입력창을 위로 올렸습니다.

## 요약
문제의 가장 큰 원인은 **CSS의 `overflow-hidden` 제한으로 인한 `sticky` 무력화** 및 안드로이드 시스템 바 변수(`var(--safe-area-inset-*)`) **미적용**이었습니다. 관련된 3개 페이지를 대상으로 해당 문제들을 모두 코딩으로 해결했습니다.
