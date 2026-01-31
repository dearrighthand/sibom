# Project Context & Operations

## Business Goal

**시봄(SIBOM)**은 60대 이상 액티브 시니어를 대상으로 하는 프리미엄 데이팅 서비스입니다. 단순한 만남을 넘어 '정서적 동반자'를 찾는 것에 집중하며, 시니어의 디지털 문해력을 고려한 고대비/대형 UI와 철저한 신원 인증을 통한 신뢰 구축을 핵심 가치로 합니다.

## Key Features:

- 안심 매칭: AI 기반 성향/관심사 분석 및 본인 인증 기반 사용자 연결.
- 시니어 친화 UI: 최소 18px 이상의 폰트, 바텀 시트 기반 선택 시스템.
- 느린 호흡의 대화: AI 대화 가이드를 통한 어색함 해소 및 정서적 교감 지원.

## Tech Stack

- Monorepo: Turborepo
- Frontend: Next.js (App Router), Tailwind CSS, Shadcn UI
- Backend: Node.js, Nest.js, Prisma
- Database: Supabase (PostgreSQL, Edge Functions)
- Auth: JWT auth 별도 구축
- AI Integration: Gemini API (사용자 분석 및 매칭 문구 생성)
- Deployment: Frontend - Vercel, Backend - railway

## Design Reference: design_system.html (Vanilla HTML/JS 기반 디자인 시스템)

## Operational Commands

- **Install Dependencies:** `npm install`
- **Run Dev Server:** frontend - `npm run dev`, backend - `npm run start:dev`
- **Build Production:** `npm run build`
- **Lint Code:** `npm run lint`

## Golden Rules

### 불변의 원칙 (Immutable)

- 클린 아키텍처 준수: 모든 로직은 domain(비즈니스), application(유즈케이스), infrastructure(외부 서비스), presentation(UI) 계층으로 엄격히 분리한다.
- 완벽한 타입 안전성: any 사용을 금지한다. 인터페이스를 명확히 정의하고 Strict 모드를 유지한다.

### 시니어 UI 원칙 준수

- 최소 폰트 크기 18px (디자인 시스템 기준).
- 최소 터치 영역(버튼 높이) 56px.
- 모든 인터랙티브 요소는 높은 명도 대비를 유지한다.
- 폰트는 Pretendard를 기본으로 사용한다.

### 데이터 접근 제한

- 프론트엔드는 직접 DB를 조작하지 않으며, 반드시 Supabase Connection String 방식과 Prisma ORM을 통해서만 데이터에 접근한다.

### 디자인 시스템 엄격 적용

- 모든 UI 컴포넌트는 design_system.html에 명시된 스타일(Blooming Peach, Sage Green 등)과 컴포넌트 구조(Bottom Sheet, Card 등)를 강제로 따른다.

### 독백 주석 금지

- "가정하건대...", "확인해보자..."와 같은 내부 사고 과정을 주석으로 남기지 않는다. 주석은 코드의 기능을 설명하는 한국어로만 작성한다.

### 한국어 응답 원칙

- AI의 모든 응답, 설명, 구현 계획 및 사용자 인터랙션은 반드시 **한국어(한글)**로 제공한다.

## 권장 및 금지 사항 (Do's & Don'ts)

### 권장 사항 (Do's)

- 모든 텍스트 상수는 별도의 파일로 관리하여 다국어 및 문구 수정에 대비한다.
- 시니어 사용자가 길을 잃지 않도록 모든 화면에 명확한 '뒤로가기' 버튼을 배치한다.
- use the shared tailwind config in `packages/shared`.
- define core entities in the `domain` layer before implementing controllers.

### 금지 사항 (Don'ts)

- 비즈니스 로직을 UI 컴포넌트 내부에 직접 작성하지 않는다. (Custom Hooks 활용)
- 팝업이나 모달을 남발하지 않는다. 대신 디자인 시스템의 **바텀 시트(Bottom Sheet)**를 우선 사용한다.
- hardcode API URLs. Use environment variables.

## MCP Tools Usage

- remote-github: Use for all GitHub interactions (issues, PRs, code search).
- sequential-thinking: Use for complex logic analysis or architectural planning before execution.

## Maintenance Policy

If a rule blocks development or is obsolete, propose an update to this file via Pull Request immediately.

## 표준 및 참조

### 컨벤션 요약

- 명명 규칙: 컴포넌트/클래스는 PascalCase, 함수/변수는 camelCase를 사용한다.
- 커밋 메시지: Conventional Commits (feat, fix, docs, style, refactor 등) 형식을 따른다.
- 아이콘: lucide-react를 사용하며, 시인성을 위해 기본 크기는 24px 이상으로 설정한다.

### 컨텍스트 맵 (라우팅 가이드)

Frontend (UI/UX) — 디자인 시스템 적용 및 클라이언트 로직.
Backend (Supabase/DB) — 테이블 스키마, 보안 정책(RLS), 인증 로직.
AI Logic (Matching) — Gemini API 연동 및 시니어 맞춤형 프롬프트 엔지니어링.

# Context Map (Action-Based Routing)

- [Frontend Development (Next.js)](./apps/web/AGENTS.md) — UI implementation, client-side logic, and page routing.
- [Backend Development (Nest.js)](./apps/api/AGENTS.md) — API endpoints, database interactions, and business logic.
- [Shared Modules & Config](./packages/shared/AGENTS.md) — Common types, utilities, and design system tokens.
