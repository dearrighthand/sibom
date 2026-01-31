---
name: sibom-ui-design
description: 'Implement Next.js UI components following the SIBOM (시봄) design system specifications for senior-friendly social platform. Use this skill when the user asks to: (1) Build Next.js components based on SIBOM design system, (2) Create pages or layouts following SIBOM brand guidelines, (3) Implement senior-optimized UI with SIBOM design tokens, (4) Convert SIBOM design specifications into working Next.js code. This skill contains the complete SIBOM design system including colors, typography, components, and senior-friendly UX patterns.'
license: MIT
---

# Next.js SIBOM Design System Implementation

This skill guides implementation of Next.js UI components following the SIBOM (시봄) design system - a senior-friendly social platform design system.

## SIBOM Design System Overview

SIBOM is a design system optimized for senior users (60+), focusing on:

- High readability and accessibility
- Large touch targets (minimum 56px height)
- Clear visual hierarchy
- Warm, friendly color palette
- Senior-optimized interaction patterns

## Design Tokens

### Color Palette

```typescript
// All components MUST use these exact color values
const colors = {
  // Primary brand color - warm coral
  primary: '#FF8B7D',
  primaryHover: '#ff7a6a',

  // Secondary - calming green
  secondary: '#7D9D85',

  // Accent - warm yellow
  accent: '#FFD166',

  // Background
  bg: '#FDFCFB',

  // Text colors
  textMain: '#2D2D2D',
  textSub: '#666666',

  // Border
  border: '#E5E5E5',

  // Semantic colors
  success: '#7D9D85',
  error: '#EF4444',
  info: '#3B82F6',

  // Derived colors for badges/tags
  secondaryBg: 'rgba(125, 157, 133, 0.1)', // #7D9D85 at 10% opacity
  accentBg: 'rgba(255, 209, 102, 0.1)', // #FFD166 at 10% opacity
  accentText: '#B8860B', // Darker yellow for text
};
```

### Typography

```typescript
const typography = {
  // Font family - MUST use Pretendard
  fontFamily: {
    sans: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
  },

  // Font sizes - Larger for seniors
  fontSize: {
    xs: '0.75rem', // 12px - rarely used
    sm: '0.875rem', // 14px - badges, labels
    base: '1rem', // 16px - body text
    lg: '1.125rem', // 18px - emphasized text
    xl: '1.25rem', // 20px - subtitles
    '2xl': '1.5rem', // 24px - headings
    '3xl': '1.75rem', // 28px - OTP input
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
    black: 900,
  },

  // Line height - generous for readability
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
};
```

### Spacing & Layout

```typescript
const spacing = {
  // All spacing MUST use these values
  base: '1rem', // 16px
  tight: '0.5rem', // 8px
  comfortable: '1.5rem', // 24px
  spacious: '2rem', // 32px

  // Component-specific spacing
  buttonPadding: {
    x: '2rem', // 32px horizontal
    y: '1rem', // 16px vertical
  },
  inputPadding: {
    x: '1.5rem', // 24px horizontal
    y: '1rem', // 16px vertical
  },
  cardPadding: '1.5rem', // 24px

  // Minimum touch target
  minTouchTarget: '56px',
};
```

### Border Radius

```typescript
const borderRadius = {
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '1.75rem', // 28px
  '3xl': '2rem', // 32px
  full: '9999px', // Pill shape
};
```

### Shadows

```typescript
const shadows = {
  // Standard shadow for cards and buttons
  senior: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

  // Standard Tailwind shadows
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};
```

### Animation

```typescript
const animations = {
  // Fade in (for tab content)
  fadeIn: {
    keyframes: {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    duration: '0.4s',
    timing: 'ease-out',
  },

  // Slide down (for toast)
  slideDown: {
    keyframes: {
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    duration: '0.3s',
    timing: 'ease-out',
  },

  // Fade out (for toast hide)
  fadeOut: {
    keyframes: {
      to: { opacity: 0, transform: 'translateY(-20px)' },
    },
    duration: '0.3s',
    timing: 'ease-in',
  },

  // Active scale (for buttons)
  activeScale: 'scale-95',

  // Hover lift (for cards)
  hoverLift: '-translate-y-1',
};
```

## Component Specifications

### Logo

**Brand Logo:**

```typescript
// MUST use the official image asset, NOT text or icons
// Path: /images/logo.png (from public/images/logo.png)
// Default size references:
<Image
  src="/images/logo.png"
  alt="SIBOM"
  width={540}
  height={294}
  className="h-40 w-auto object-contain" // adjust height as needed, maintain aspect ratio
/>
```

### Button

**Primary Button:**

```typescript
// Large, high-contrast, senior-friendly
className =
  'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a] px-8 py-4 rounded-full transition-all active:scale-95 shadow-md text-lg font-medium min-h-[56px]';
```

**Secondary Button:**

```typescript
className =
  'bg-[#7D9D85] text-white hover:bg-[#6d8d75] px-8 py-4 rounded-full transition-all active:scale-95 shadow-md text-lg font-medium min-h-[56px]';
```

**Icon Button:**

```typescript
className =
  'flex items-center gap-2 px-6 py-3 rounded-full transition-all active:scale-95 text-[#666666] hover:bg-gray-100 text-lg font-medium min-h-[56px]';
```

**Button with Icon:**

```typescript
// Always include gap-2 between icon and text
className = 'flex items-center justify-center gap-2';
// Icon size: w-6 h-6 (24px)
```

### Input Fields

**Text Input:**

```typescript
// Large, clear borders, generous padding
className =
  'w-full px-6 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-[#FF8B7D] text-xl font-medium min-h-[56px]';
```

**Input with Active State:**

```typescript
className = 'border-2 border-[#FF8B7D]';
```

**Input Label:**

```typescript
className = 'text-xl font-bold mb-4';
```

**Helper Text:**

```typescript
className = 'text-lg font-medium text-[#666666]';
```

### OTP (One-Time Password) Input

**Special component for verification codes:**

```typescript
// Individual digit input
className =
  'w-[50px] h-[64px] text-center text-[28px] font-bold border-2 border-[#E5E5E5] rounded-xl bg-white focus:border-[#FF8B7D] outline-none';

// Active (filled) state
className = 'border-2 border-[#FF8B7D]';
```

### Cards

**User Card:**

```typescript
className =
  'bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group transition-transform hover:-translate-y-1';

// Card image container
className = 'relative h-64 overflow-hidden';

// Card content
className = 'p-6';

// Card title
className = 'text-2xl font-bold leading-snug';

// Card description
className = 'text-base font-normal text-[#666666] mt-2';
```

**Content Card:**

```typescript
className = 'bg-white rounded-3xl p-8 shadow-lg border border-gray-100';
```

### Badges & Tags

**Location Badge:**

```typescript
className = 'bg-[#7D9D85]/10 text-[#7D9D85] px-3 py-1 rounded-lg font-bold flex items-center gap-1';
```

**Info Badge:**

```typescript
className = 'bg-[#FFD166]/10 text-[#B8860B] px-3 py-1 rounded-lg font-bold flex items-center gap-1';
```

**Status Badge (on image):**

```typescript
className = 'bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm';
```

### Radio Button (Custom)

**List-style Radio:**

```typescript
// Container
className =
  'flex items-center justify-between p-6 rounded-3xl border-2 border-gray-100 bg-white cursor-pointer transition-all shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]';

// Icon container
className = 'w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center';

// Radio indicator
className =
  'w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all';

// Checked state (add via JS or CSS)
// background-color: var(--primary)
// border-color: var(--primary)
```

### Toast Notification

**Toast Container:**

```typescript
className =
  'fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center w-full max-w-sm px-4 pointer-events-none';
```

**Success Toast:**

```typescript
className =
  'bg-[#7D9D85] text-white px-8 py-5 rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] flex items-center gap-4 min-w-[320px] animate-[slideDown_0.3s_ease-out] pointer-events-auto';

// Icon size: w-8 h-8 (32px)
// Text: text-xl font-bold
```

**Error Toast:**

```typescript
className =
  'bg-red-500 text-white px-8 py-5 rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] flex items-center gap-4 min-w-[320px] animate-[slideDown_0.3s_ease-out] pointer-events-auto';
```

### Navigation

**Top Navigation Bar:**

```typescript
className =
  'sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm';

// Logo container
className = 'w-10 h-10 bg-[#FF8B7D] rounded-xl flex items-center justify-center shadow-inner';

// Logo text
className = 'text-2xl font-black tracking-tight text-[#FF8B7D]';

// Nav link (active)
className = 'text-lg font-bold px-2 py-1 transition-all text-[#FF8B7D] border-b-4 border-[#FF8B7D]';

// Nav link (inactive)
className = 'text-lg font-bold px-2 py-1 transition-all text-gray-400 hover:text-gray-600';
```

**Bottom Tab Bar (Mobile):**

```typescript
className =
  'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 md:hidden flex justify-between items-center z-50';

// Tab item (active)
className = 'flex flex-col items-center text-[#FF8B7D]';

// Tab item (inactive)
className = 'flex flex-col items-center text-gray-400';

// Tab icon: w-7 h-7 (28px)
// Tab label: text-xs font-bold mt-1
```

### Select Dropdown

**Custom Select:**

```typescript
className =
  'w-full px-6 py-4 rounded-2xl border-2 border-gray-200 outline-none focus:border-[#FF8B7D] text-xl font-medium min-h-[56px] appearance-none bg-[url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="m6 9 6 6 6-6"/%3E%3C/svg%3E\')] bg-no-repeat bg-[right_1.5rem_center]';
```

## Senior-Friendly UX Patterns

### Touch Target Optimization

**CRITICAL RULE:** All interactive elements MUST have minimum height of 56px.

```typescript
// Apply to ALL buttons, inputs, selects
min-h-[56px]

// For icon-only buttons, ensure adequate padding
className="p-4 min-h-[56px] min-w-[56px]"
```

### Font Smoothing

**Always apply to body:**

```css
-webkit-font-smoothing: antialiased;
```

### Generous Spacing

Use spacious layouts:

- Card padding: `p-6` (24px) or `p-8` (32px)
- Section spacing: `gap-6` or `gap-8`
- Content margins: `mt-4`, `mt-6`, `mt-8`

### High Contrast

Maintain strong contrast:

- Primary text: `#2D2D2D` on `#FDFCFB`
- Never use light gray text below `#666666`
- Ensure WCAG AA compliance minimum

### Clear Visual Hierarchy

Use consistent heading sizes:

- Section heading: `text-2xl font-bold leading-snug`
- Card title: `text-2xl font-bold leading-snug`
- Subtitle: `text-xl font-bold`
- Body: `text-base` or `text-lg`

## Implementation Workflow

### 1. Set Up Design Tokens

**Option A: Tailwind Config (Recommended)**

See `references/tailwind-config.md` for complete configuration.

**Option B: CSS Variables**

See `references/css-variables.md` for complete configuration.

### 2. Import Required Assets

**Font:**

```typescript
// app/layout.tsx
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    { path: './fonts/Pretendard-Light.woff2', weight: '300' },
    { path: './fonts/Pretendard-Regular.woff2', weight: '400' },
    { path: './fonts/Pretendard-Medium.woff2', weight: '500' },
    { path: './fonts/Pretendard-Bold.woff2', weight: '700' },
    { path: './fonts/Pretendard-Black.woff2', weight: '900' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});
```

**Icons:**
Use Lucide React:

```bash
npm install lucide-react
```

### 3. Create Base Components

Build components in this order:

1. Button (Primary, Secondary, Icon)
2. Input (Text, OTP)
3. Card
4. Badge
5. Toast
6. Navigation

Refer to `references/component-implementations.md` for complete code.

### 4. Implement Pages

Follow these patterns:

- Max width: `max-w-5xl mx-auto`
- Page padding: `p-8 pb-32`
- Section spacing: `mb-16` between major sections

### 5. Add Responsive Behavior

**Mobile-first approach:**

- Show bottom tab bar on mobile: `md:hidden`
- Hide bottom tab bar on desktop
- Adjust grid: `grid-cols-1 md:grid-cols-2` or `md:grid-cols-3`
- Responsive padding: `px-4 md:px-8`

## Quality Checklist

Before finalizing ANY component:

- [ ] Uses exact SIBOM colors (no approximations)
- [ ] All text uses Pretendard font
- [ ] All interactive elements are minimum 56px height
- [ ] Font sizes are large enough (minimum 16px for body)
- [ ] Has generous padding and spacing
- [ ] Includes hover states (`hover:` classes)
- [ ] Includes active states (`active:scale-95`)
- [ ] Has proper focus states for accessibility
- [ ] Icons are from Lucide and sized correctly (w-6 h-6 for most, w-7 h-7 for tabs)
- [ ] Shadows use `senior-shadow` style or equivalent
- [ ] Border radius follows design system (rounded-2xl, rounded-3xl, rounded-full)
- [ ] Responsive breakpoints use `md:` prefix
- [ ] No hard-coded values (uses design tokens)

## Anti-Patterns to Avoid

**DO NOT:**

- Use small fonts (below 16px for body text)
- Create small touch targets (below 56px)
- Use thin font weights for important text
- Use insufficient contrast
- Use subtle or minimal styling
- Create dense layouts with tight spacing
- Use complex hover effects (keep it simple)
- Use non-Pretendard fonts
- Approximate SIBOM colors
- Create buttons without icons when showing icon examples

## Reference Files

For detailed implementation examples:

- `references/tailwind-config.md` - Complete Tailwind configuration
- `references/css-variables.md` - CSS variables setup
- `references/component-implementations.md` - Full component code
- `references/page-examples.md` - Complete page implementations

## Brand Voice

When implementing SIBOM designs:

- Warm and approachable
- Clear and simple language
- Encouraging and positive
- Senior-respectful (not patronizing)
- Focus on connection and companionship
