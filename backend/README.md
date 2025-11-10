# Verse - backend

- 프레임워크: NestJS
- 언어: TypeScript
- 목적: Settings 서비스의 백엔드 API

## 주요 기술 스택

- Node.js, TypeScript
- NestJS
- class-validator, class-transformer (DTO 검증/변환)
- dotenv / @nestjs/config (환경변수 관리)
- Jest, Supertest (테스트)

## 요구사항(Prerequisites)

- Node.js >= 18
- npm 또는 pnpm

## 빠른 시작

1. 리포지토리 루트에서 `backend` 디렉터리로 이동합니다.

```bash
cd backend
```

2. 의존성 설치:

```bash
npm install
```

3. 개발 서버 실행:

```bash
npm run start:dev
```

4. 프로덕션 빌드 및 실행:

```bash
npm run build
npm run start:prod
```

## 환경 변수

`.env` 파일을 프로젝트 루트(`backend` 폴더) 또는 환경에 맞게 설정하세요. 예시:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
```

이 프로젝트는 `@nestjs/config`를 사용하여 환경변수를 로드합니다. 민감한 값은 절대 버전관리 시스템에 커밋하지 마세요.

## 스크립트

- `npm run start` : 애플리케이션 실행
- `npm run start:dev` : 개발 모드 (watch)
- `npm run start:prod` : 프로덕션 빌드된 파일로 실행
- `npm run build` : TypeScript 빌드 (dist 생성)
- `npm run lint` : ESLint 실행 및 자동 수정
- `npm run format` : Prettier 포맷
- `npm run test` : 유닛 테스트
- `npm run test:e2e` : E2E 테스트

## 폴더 구조 (요약)

```
backend/
├─ src/
│  ├─ main.ts          # 앱 진입점
│  ├─ app.module.ts    # 루트 모듈
│  ├─ app.controller.ts
│  ├─ app.service.ts
│  ├─ common/          # 필터/예외 처리 등 공통 모듈
│  └─ utils/           # 유틸리티 함수
├─ test/               # e2e 테스트
├─ package.json
└─ tsconfig.json
```

## 테스트

유닛/통합 테스트는 Jest를 사용합니다. E2E 테스트는 `test` 폴더를 따릅니다.

```bash
npm run test
npm run test:e2e
```

테스트 실행 시 필요한 외부 서비스(예: 데이터베이스)가 있다면, 테스트 전 간단한 모의(Mock) 또는 테스트 전용 DB를 준비하세요.

## 코드 스타일 / 린트

- ESLint + Prettier 설정이 포함되어 있습니다.
- 커밋 전에 포맷 및 린트 자동 실행 훅을 추가하면 일관된 스타일을 유지하기 쉽습니다.

```bash
npm run lint
npm run format
```

## 주요 의존성

- @nestjs/\* (프레임워크)
- class-validator, class-transformer (DTO 검증/변환)
- joi (추가 검증용)

현재 `package.json`에 정의된 의존성은 이 리포지토리의 dev/prod 환경에 맞게 구성되어 있습니다.

## 배포

간단한 배포 흐름:

1. `npm run build`로 빌드
2. 빌드 결과(`dist`)와 `package.json`, 필요한 환경변수(.env)를 서버에 배포
3. `npm run start:prod`로 실행

## 추가 설정

- Validation (전역): `ValidationPipe` 적용 (whitelist, forbidNonWhitelisted, transform)
- Env & Validation: `@nestjs/config` + `joi`로 env 파일 로드 및 유효성 검사 (`src/utils/validation.ts`)
- Exception Filter: `HttpExceptionFilter`로 모든 예외 로깅 및 응답 처리 (`src/common/filters`)
- Logger: 개발 환경에서 실행 URL 로그 출력
- VS Code: `.vscode/settings.json` 및 `vscode-user-settings-sample.json`로 저장 시 import 정리/포맷/ESLint 자동 수정 활성화
