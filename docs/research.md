# 안드로이드 Safe Area UI 이슈 — 심층 분석 보고서 (v2)

이전 수정에도 불구하고 상단 텍스트가 안드로이드 영역을 침범하고, 푸터 네비게이션이 기능 버튼에 가려지는 문제가 계속되고 있습니다. 전체 코드베이스를 정밀하게 검토한 결과를 보고합니다.

---

## 핵심 근본 원인

### ❗ `env(safe-area-inset-*)` CSS 환경 변수가 안드로이드 Capacitor WebView에서 동작하지 않음

현재 프로젝트의 Safe Area 처리는 전부 CSS `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)` 에 의존합니다.
하지만 **Capacitor Android WebView에서는 이 값이 항상 `0px`**로 반환됩니다.

**이유:**
- CSS `env(safe-area-inset-*)` 는 iOS Safari의 `viewport-fit=cover` 환경용으로 설계된 기능입니다.
- Android의 Chrome WebView(Capacitor가 사용)는 이 값을 네이티브 인셋으로 자동 채워주지 않습니다.
- 현재 `capacitor.config.ts`에서 `StatusBar: { overlaysWebView: false }` 설정이므로 상태바 아래부터 WebView가 시작되어야 하지만, `styles.xml`의 `windowLayoutInDisplayCutoutMode: shortEdges` 설정으로 인해 컷아웃(노치) 영역까지 콘텐츠가 침범할 수 있습니다.
- 결국 CSS `env()` 값은 `0px`이므로, 모든 safe area 패딩이 사실상 적용되지 않고 있습니다.

---

## 문제 1: 상단 Safe Area 침범 — 모든 커스텀 헤더 페이지

### 현상
스크린샷의 `auth/phone` 페이지에서 "본인 인증" 텍스트가 안드로이드 상태바 영역과 겹칩니다.

### 영향받는 파일 목록 (커스텀 `sticky top-0` 헤더를 가진 페이지들)
| # | 파일 | 헤더 내용 |
|---|------|----------|
| 1 | `auth/phone/page.tsx` (L133) | "본인 인증" |
| 2 | `auth/verification/page.tsx` (L137) | "신분증 인증" |
| 3 | `auth/find-password/page.tsx` (L35) | "비밀번호 찾기" |
| 4 | `auth/reset-password/page.tsx` (L62) | 비밀번호 재설정 |
| 5 | `auth/meeting-type/page.tsx` (L31) | 만남 유형 |
| 6 | `auth/photos/page.tsx` (L65) | 사진 등록 |
| 7 | `auth/hobbies/page.tsx` (L37) | 취미 선택 |
| 8 | `auth/profile/page.tsx` (L183) | 프로필 작성 |
| 9 | `auth/intro/page.tsx` (L71, L165) | 자기소개 |

### 원인
- 위 9개 페이지 모두 `sticky top-0`으로 고정된 커스텀 헤더를 가지고 있지만, **어느 것도 상단 Safe Area 패딩을 적용하지 않습니다**.
- `TopNavigation.tsx` 컴포넌트만 `paddingTop: 'env(safe-area-inset-top, 0px)'`를 갖고 있으나, 안드로이드에서 `env()` 값이 `0px`이므로 의미가 없습니다.

### 해결 방향
- CSS `env()` 에 의존하지 말고, **고정 fallback 값** 사용.
- 모든 `sticky top-0` 헤더에 `pt-[env(safe-area-inset-top,_FALLBACK_)]` 형태로 적용하되, 안드로이드에서 0px이 되는 것을 방지하기 위해 고정 상단 패딩(예: 상태바 높이 약 `24px~28px`)을 하드코딩으로 보장합니다.
- 혹은 Capacitor의 `StatusBar.getInfo()` API를 활용하여 런타임에서 상태바 높이를 취득 후 CSS 커스텀 프로퍼티로 주입하는 방법. (가장 정확하지만 복잡함.)

---

## 문제 2: 홈 랜딩 페이지 하단 약관 잘림

### 현상
`page.tsx`의 '서비스 이용약관', '개인정보처리방침' 링크가 안드로이드 하단 시스템 바 아래로 밀려나 보이지 않음.

### 원인
- `min-h-[100dvh]` 변경은 적용했으나, `dvh` 단위도 Android WebView에서 시스템 하단바 높이를 완벽히 반영하지 못합니다.
- 하단 패딩에 `env(safe-area-inset-bottom, 20px)` fallback을 사용했으나, 이 fallback 값이 부족하거나 브라우저에 따라 다르게 반영될 수 있음.

### 해결 방향
- 하드코딩 된 충분한 패딩 (`pb-16` = 4rem, 약 64px) 등으로 넉넉한 여유 공간을 확보.

---

## 문제 3: 푸터 네비게이션 안드로이드 기능 버튼에 가려짐

### 현상
메인/호감/채팅 등 탭 화면 하단의 `FooterNavigation`이 안드로이드 하단 네비게이션 바(소프트키)에 의해 잘림.

### 영향받는 파일 및 화면
- `FooterNavigation.tsx` — 하단 네비게이션 (홈, 매칭, 호감, 채팅, MY)
- `AdMobBanner.tsx` — 광고 배너도 하단 시스템 바와 겹칠 수 있음

### 원인
- `FooterNavigation`에 `paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))'` 를 적용했지만, 안드로이드에서 `env(safe-area-inset-bottom)`이 `0px`을 반환하므로 결국 `max(24px, 0px) = 24px`만 적용.
- 안드로이드 소프트키/제스처 바 높이는 기기마다 다르지만 보통 **48px** 정도. `24px`로는 부족.

### 해결 방향
- 하단 패딩의 fallback을 `48px` 이상으로 상향하여, 안드로이드 소프트키 영역을 물리적으로 피합니다.
- 또는 `@capacitor-community/safe-area` 플러그인을 추가하여 네이티브에서 정확한 인셋 값을 구한 후 CSS 변수로 강제 세팅하는 근본적 해결 방안 적용.

---

## 전체 영향 범위 요약

| 영역 | 문제 | 파일 수 | 해결 방식 |
|------|------|---------|----------|
| 상단 Safe Area | `sticky top-0` 헤더가 상태바 침범 | 10개 (9 커스텀 + TopNavigation) | 모든 헤더에 고정 상단 패딩 적용 |
| 하단 랜딩 | 약관 링크 잘림 | 1개 (page.tsx) | 충분한 하단 패딩 |
| 하단 푸터 | 네비가 소프트키에 가려짐 | 1개 (FooterNavigation.tsx) | 패딩을 48px 이상으로 상향 |
| 전역 | `env()` 미동작 | globals.css 등 | 하드코딩 fallback 또는 Safe Area 플러그인 추가 |

---

## 결론 및 다음 단계

**근본 원인**: 안드로이드 Capacitor WebView에서 CSS `env(safe-area-inset-*)` 환경 변수가 동작하지 않아, 모든 Safe Area 처리가 무효화되고 있습니다.

**실행 가능한 해결책 (2가지 중 선택):**

### A안. 하드코딩 Fallback (간단, 즉시 적용 가능)
- 상단: 모든 커스텀 헤더 + TopNavigation에 최소 `pt-7` (28px) 고정 패딩
- 하단: FooterNavigation 패딩을 `48px` 이상으로 조정
- 장점: 즉시 적용 가능, 추가 플러그인 불필요
- 단점: 기기별 상태바/하단바 높이가 다를 수 있음

### B안. `@capacitor-community/safe-area` 플러그인 도입 (정확, 권장)
- 네이티브에서 정확한 인셋 값을 가져와 CSS 변수에 주입
- 모든 페이지에서 해당 변수를 참조
- 장점: 모든 기기에서 정확히 동작
- 단점: 플러그인 추가 설치 + 약간의 초기화 코드 필요

확인 후 어느 방안으로 진행할지 결정해 주시면 바로 코딩을 시작하겠습니다.
