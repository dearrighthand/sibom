# 안드로이드 Safe Area UI 수정 계획안 (Plan)

이 문서는 모바일 화면 최적화 이슈(Safe Area 여백 침범, 하단 콘텐츠 잘림, 푸터 겹침 등)를 수정하기 위한 구체적인 작업 단계를 정리한 것입니다.

---

## 1. 전역 스타일(globals.css) 수정
**목적:** `body` 태그의 이중 패딩 이슈를 해결하고, 불필요한 상단/하단 빈 공간을 제거합니다.

**작업 내용:** (완료)
- `apps/web/src/app/globals.css` 파일 오픈
- `@layer base` 내부 `body` 스타일에 선언된 `padding-top` 및 `padding-bottom` 줄임 및 완전 제거.

---

## 2. 홈 랜딩 페이지(page.tsx) 수정
**목적:** 카카오톡 로그인 버튼 하단의 약관 링크들이 안드로이드 화면 바 밑에 가려지는(잘리는) 현상을 해결합니다.

**작업 내용:** (완료)
- `apps/web/src/app/page.tsx` 파일 수정
- 모바일 뷰포트 높이 문제를 해결하기 위해 `<main>`의 CSS 클래스에서 `min-h-screen` 속성을 찾아 `min-h-[100dvh]`로 변경합니다.
- 하단 컨텐츠 여유 공간 확보를 위해 제일 마지막 `<div>` 요소나 메인 컨테이너에 `pb-[calc(1.5rem+env(safe-area-inset-bottom,20px))]` 클래스를 추가하여 여분 패딩을 부여합니다.

---

## 3. 하단 네비게이션(FooterNavigation.tsx) 수정
**목적:** 네비게이션 탭(`FooterNavigation.tsx`)이 안드로이드 하단 시스템 바(소프트키/제스처 바)와 겹치지 않게 보호 여백을 확실히 보장합니다.

**작업 내용:** (완료)
- `apps/web/src/components/layout/FooterNavigation.tsx` 내부 `<nav>` 요소의 `style` 검토.
- `paddingBottom` 속성이 현재 `'calc(20px + env(safe-area-inset-bottom, 0px))'`으로 되어 있는 부분을 수정합니다.
- 안드로이드의 `env()` 값이 0이 될 때를 대비하여 안전거리를 늘린 `'calc(max(24px, env(safe-area-inset-bottom)))'` 포맷 등으로 강력한 fallback 공간을 확보합니다. (필요 시 `32px`까지 여유를 주어 명확하게 띄워지게 합니다)

---

## 4. 상단 네비게이션(TopNavigation.tsx) 수정
**목적:** `globals.css`에서 `body` 기준 글로벌 패딩을 제거한 만큼, 상단에 고정된 헤더는 안전하게 Safe Area 만큼의 공간을 스스로 확보하도록 다듬습니다.

**작업 내용:** (완료)
- `apps/web/src/components/layout/TopNavigation.tsx` 내 `<header>` 요소의 인라인 스타일인 `paddingTop: 'env(safe-area-inset-top, 0px)'` 유지 확인.
- 만약 iOS나 Android 환경에 대해 기본 패딩을 살짝 주려면 `paddingTop: 'max(env(safe-area-inset-top), 16px)'` 등의 Fallback을 설정하는 것을 고려합니다. (기본적으로는 `1번` 단계가 완료되면 이중 패딩 문제가 풀리며 위치가 정상화됩니다.)

---

## 5. 변경 사항 테스트 및 빌드 검증
**목적:** 위 변경 사항들이 실제 안드로이드 모바일 기기(크롬 개발자 도구 및 Capacitor 안드로이드 뷰어)에서 깨짐 없이 정상 동작하는지 테스트합니다.

- `pnpm run dev` 를 통해 로컬에서 iOS/Android Viewport 검토.
- 문제없을 시 `Test Ad` 배너 등과의 겹침도 최종 확인.

---

위 계획서의 각 항목 내용을 바탕으로 순차적으로 코딩 작업을 허가해주시면 즉시 반영하겠습니다.
