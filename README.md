# 🌸 SIBOM (시봄)
> **"50대 이후, 새로운 인연을 만나보세요."** > Active Senior를 위한 프리미엄 소셜 네트워킹 서비스

![SIBOM Logo](apps/web/public/images/logo-text.png)

## 📋 Project Overview
**SIBOM**은 디지털 환경에 익숙해진 '액티브 시니어'를 타겟으로 한 소셜 데이팅 서비스입니다. 단순한 만남을 넘어 시니어 세대의 특성을 고려한 직관적인 UX와 AI 기반의 맞춤형 경험을 제공합니다. 

본 프로젝트는 **TurboRepo 기반의 모노레포**로 설계되어 프론트엔드와 백엔드 간의 코드 공유를 극대화하고, **Capacitor**를 통해 웹 기술만으로 네이티브 앱 환경을 구축한 고효율 아키텍처를 지향합니다.

---

## 🏗️ Architecture & Tech Stack

### 🚀 Monorepo Architecture (TurboRepo)
- **apps/web**: Next.js 기반 프론트엔드 (App Router)
- **apps/api**: NestJS 기반 백엔드 API
- **packages/shared**: 공통 타입(TypeScript) 및 유틸리티 함수 공유

### 💻 Frontend (apps/web)
- **Framework**: `Next.js 16` (React 19)
- **Styling**: `Tailwind CSS 4` (최신 사양 도입)
- **State**: `Zustand` (가벼운 상태 관리), `Zod` (런타임 타입 검증)
- **Animation**: `Framer Motion`, `React Spring` (부드러운 카드 스와이프 UX)
- **Mobile**: `Capacitor 8` (Android 환경 최적화)

### ⚙️ Backend (apps/api)
- **Framework**: `NestJS 11`
- **Database**: `PostgreSQL` with `Prisma ORM`
- **AI Integration**: `Google Generative AI (Gemini)`를 활용한 프로필/대화 보조
- **Storage**: `AWS S3 SDK` (Cloudflare R2 호환)
- **Docs**: `Swagger`를 이용한 API 문서화

---

## ✨ Key Features (Technical Points)

### 1. 시니어 특화 UX (Tinder-style Card Swiping)
- 시니어 사용자의 인지적 편의를 위해 `Framer Motion`을 활용한 직관적인 카드 스와이프 인터페이스를 구현했습니다. 
- 복잡한 뎁스를 줄이고 큰 폰트와 명확한 대비를 적용한 디자인 시스템을 구축했습니다.

### 2. 고성능 모노레포 환경
- `TurboRepo`를 활용하여 빌드 캐싱 및 병렬 실행을 통해 개발 생산성을 높였습니다.
- 프론트엔드와 백엔드 간에 DTO 및 인터페이스를 `packages/shared`에서 공유함으로써 타입 안정성을 확보했습니다.

### 3. AI 기반 인연 추천 (Gemini API)
- `Google Gemini` 모델을 연동하여 사용자의 프로필 키워드를 분석하고, 단순 매칭을 넘어선 개인화된 인연 추천 로직의 기반을 마련했습니다.

### 4. 하이브리드 앱 배포 전략
- 단일 코드베이스로 웹과 안드로이드 앱을 동시 지원하도록 `Capacitor` 환경을 설정하여 유지보수 비용을 절감했습니다.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)

### Installation
```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 개발 서버 실행 (Full Stack)
pnpm dev

# Android 앱 배포
# cd apps/web
pnpm run deploy:android

# 🔗 Links
Live Demo: sibom-api.vercel.app
API Documentation: sibom-api.vercel.app/docs

## 👤 Author
Name:   Dearrighthand (dearrighthand)

Email:  dearrighthand@gmail.com