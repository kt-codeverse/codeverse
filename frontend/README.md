# Verse - frontend

간단하고 확장 가능한 Next.js + TypeScript 템플릿입니다. App Router(`/app`)와 TailwindCSS 스타일링을 사용하며, 컴포넌트 기반 구조로 구성되어 있습니다.

## 핵심 사항

- Next.js 16, React 19, TypeScript
- TailwindCSS 기반 스타일링
- `app/` 디렉터리 기반 App Router 구조

## 요구사항

- Node.js 18 이상 권장
- npm 또는 pnpm / yarn

## 빠른 시작

터미널에서 프로젝트 루트에서 다음을 실행하세요:

```zsh
npm install
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000` 에서 실행됩니다.

## 빌드 및 프로덕션 실행

```zsh
npm run build
npm start
```

## Lint 실행

```zsh
npm run lint
```

## 프로젝트 구조 (간단)

- `app/` - 페이지와 레이아웃
- `components/` - 재사용 가능한 UI 컴포넌트
- `lib/` - 유틸 함수
- `public/` - 정적 자원
- `types/` - 전역 타입 선언

## 🎨 스타일 가이드

- TailwindCSS를 기본 스타일링 방식으로 사용합니다.
- 컴포넌트는 작은 단위로 쪼개고, `components/ui` (shadcn/ui 스타일), `components/forms`, `components/layout` 등으로 분리하세요.
- 코드 포맷터로 Prettier를 사용하고, 리포지토리 루트의 `.prettierrc`를 참고하세요.

## 🔗 유용한 링크

- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [TailwindCSS 문서](https://tailwindcss.com)
- [Next.js 문서](https://nextjs.org/docs)

## 라이브러리 설치

```zsh
# 상태 관리 (가볍게: Zustand)
npm install zustand

# 서버 상태 관리: React Query
npm install @tanstack/react-query

# 폼 관리: React Hook Form + zod
npm install react-hook-form @hookform/resolvers zod

# 아이콘: Lucide React (shadcn와 잘 어울림)
npm install lucide-react

# 유틸
npm install clsx date-fns
```
