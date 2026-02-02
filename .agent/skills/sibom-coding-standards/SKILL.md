---
name: sibom-coding-standards
description: General coding standards and conventions for the SIBOM project.
---

# SIBOM Coding Standards

This skill outlines the general coding standards and conventions for the SIBOM project.

## Comments

- **No Self-Judgment/Internal Monologue**: Do not write comments that express personal judgment, uncertainty, or "thinking out loud" (e.g., "This looks simplified", "Should I do this?", "Let's fetch default first").
- **Language**: All maintenance-related comments (explanations of *why* something is done, complex logic, TODOs, etc.) must be written in **Korean**.
- **Clarity**: Comments should be professional and purely descriptive of the code's intent or behavior.

## Example

### Bad
```typescript
// Open filter immediately on first load to encourage selection?
// Or just fetch default 'nationwide'. Let's fetch default first.
fetchData();
```

### Good
```typescript
// 초기 로딩 시 기본 필터로 데이터를 조회합니다.
fetchData();
```
