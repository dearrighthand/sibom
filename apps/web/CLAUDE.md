# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**SIBOM (시봄)** - A premium dating service for active seniors (60+) focusing on emotional companionship with senior-friendly UI/UX design.

This is the **frontend application** within a Turborepo monorepo structure:
- `apps/web` (this app) - Next.js frontend + Capacitor mobile app
- `apps/api` - NestJS backend API
- `packages/shared` - Shared TypeScript types and utilities

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **State Management**: Zustand for global state
- **Animation**: Framer Motion, React Spring (for card swipe interactions)
- **Mobile**: Capacitor 8 (Android/iOS hybrid apps)
- **Package Manager**: pnpm with workspace protocol
- **TypeScript**: Strict mode enabled

## Development Commands

```bash
# Development server (Next.js)
pnpm dev

# Production build (static export for Capacitor)
pnpm build

# Lint
pnpm lint

# Mobile app commands
pnpm run generate:assets     # Generate Capacitor assets
pnpm run build:android        # Build and sync Android
pnpm run open:android         # Open Android Studio
pnpm run deploy:android       # Full Android deployment pipeline
```

## Architecture Overview

### Next.js Configuration

- **Static export mode** (`output: 'export'`) for Capacitor compatibility
- Export directory: `out/` (configured in `capacitor.config.ts` as `webDir`)
- Images are unoptimized for static export
- Transpiles `@sibom/shared` package

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication flows
│   ├── chat/              # Messaging features
│   ├── main/              # Main feed/swipe interface
│   ├── match/             # Match management
│   ├── mypage/            # User profile
│   ├── settings/          # App settings
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── home/             # Home screen components
│   ├── layout/           # Layout components
│   ├── matches/          # Match-related components
│   ├── ui/               # shadcn/ui base components
│   ├── AppInitializer.tsx
│   ├── BottomSheet.tsx
│   └── GlobalDialog.tsx
├── lib/                   # Utilities and services
│   ├── api.ts            # Centralized API client (use this, not fetch/axios)
│   ├── recommendation.service.ts
│   ├── pushNotifications.ts
│   └── utils.ts
├── hooks/                 # Custom React hooks
├── stores/                # Zustand store definitions
├── constants/             # App constants and text
└── context/               # React contexts
```

### Capacitor Integration

- **App ID**: `com.dearrighthand.sibom`
- **Web directory**: `out/` (Next.js static export output)
- **Production hostname**: `sibom-web.vercel.app`
- **Plugins**: SplashScreen, StatusBar, PushNotifications, AdMob

## Critical Development Rules

### Architectural Patterns

1. **Clean Architecture**: Separate domain logic, application use cases, infrastructure, and presentation layers. Never mix business logic directly into UI components - use custom hooks instead.

2. **Strict TypeScript**: No `any` types allowed. All interfaces must be explicitly defined.

3. **API Access**: Always use the centralized `api` object from `@/lib/api.ts`. Never use `fetch` or `axios` directly in components.

4. **Shared Types**: Import types from `@sibom/shared` package when working with backend contracts.

### Senior-Friendly UI Requirements

These constraints are non-negotiable for accessibility:

- **Minimum font size**: 18px (design system standard)
- **Minimum touch target**: 56px height for all interactive elements
- **High contrast**: Maintain high luminosity contrast for all interactive elements
- **Typography**: Use Pretendard font family
- **Interactions**: Prefer Bottom Sheets (`BottomSheet.tsx`) over modals/popups

### Design System

- Reference: `design_system.html` (separate design system file)
- Color palette: Blooming Peach, Sage Green (senior-friendly colors)
- All UI components must follow the established design system patterns

### Code Style

- **Comments**: Write in Korean (한국어) to explain functionality
- **No inner monologue**: Avoid comments like "let's check..." or "assuming...". Only functional explanations.
- **Naming conventions**: PascalCase for components/classes, camelCase for functions/variables
- **Icons**: Use `lucide-react`, minimum 24px size for senior visibility
- **Text constants**: Manage in separate files for easy maintenance

### Environment Variables

Never hardcode API URLs or sensitive data. Use environment variables:
- `.env.local.bak` - Local development backup
- `.env.production` - Production configuration

## Common Patterns

### Making API Calls

```typescript
// ✅ Correct: Use centralized API client
import { api } from '@/lib/api';
const response = await api.get('/endpoint');

// ❌ Wrong: Don't use fetch/axios directly
const response = await fetch('/api/endpoint');
```

### State Management

```typescript
// Zustand stores in src/stores/
import { useStore } from '@/stores/yourStore';

const Component = () => {
  const state = useStore();
  // ...
};
```

### Navigation

Always include clear "back" buttons on all screens to prevent seniors from getting lost.

## Testing and Building

### Local Development

1. Run `pnpm dev` to start Next.js dev server at `http://localhost:3000`
2. Hot reload is enabled for rapid development

### Building for Mobile

1. **Static build**: `pnpm build` generates the static export in `out/`
2. **Sync Capacitor**: `pnpm run build:android` builds and syncs with Android project
3. **Open native IDE**: `pnpm run open:android` opens Android Studio
4. Build native apps from Android Studio/Xcode

### Environment-Specific Builds

The build command uses `NEXT_PRIVATE_SKIP_SWC_PATCHING=true` to avoid SWC patching issues during builds.

## Monorepo Integration

### Working with Shared Package

The `@sibom/shared` package contains:
- Shared TypeScript types and interfaces
- Common utilities
- Tailwind config (use this for consistent styling)

To modify shared types:
```bash
cd ../../packages/shared
# Edit src files
pnpm build  # Rebuild shared package
```

### Backend Integration

The backend API (`apps/api`) uses:
- NestJS with Prisma ORM
- PostgreSQL via Supabase
- JWT authentication
- Gemini AI for matching/recommendations

When implementing features that need backend changes, ensure both frontend and backend changes maintain type safety via the shared package.

## Response Language

All AI responses, explanations, and user interactions must be in **Korean (한글)**.
