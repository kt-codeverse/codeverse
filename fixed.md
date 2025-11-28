# Codeverse 프로젝트 Docker 배포 설정 가이드

이 문서는 프로젝트의 Docker 환경 설정 및 문제 해결 과정을 기록한 최종 가이드입니다.

---

## 1. Kakao 지도 API 키 설정

- **필요 파일**: `.env` (프로젝트 루트), `frontend/Dockerfile`, `docker-compose.yml`
- **환경 변수**: `NEXT_PUBLIC_KAKAO_MAP_KEY`
- **설정 내용**:
  1.  **`.env` (프로젝트 루트)**:
      ```
      NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_app_key # <-- 반드시 실제 발급받은 키로 교체해야 합니다.
      ```
      (참고: `frontend/.env.local`에서는 이 변수를 제거해야 합니다.)
  2.  **`frontend/Dockerfile`**:
      - `ARG NEXT_PUBLIC_KAKAO_MAP_KEY` 추가
      - `ENV NEXT_PUBLIC_KAKAO_MAP_KEY=$NEXT_PUBLIC_KAKAO_MAP_KEY` 추가 (빌드 시점에 변수 주입)
  3.  **`docker-compose.yml`**:
      - `frontend` 서비스의 `build.args`에 `NEXT_PUBLIC_KAKAO_MAP_KEY: ${NEXT_PUBLIC_KAKAO_MAP_KEY}` 추가
- **설명**: `NEXT_PUBLIC_KAKAO_MAP_KEY`는 Next.js 빌드 시점에 코드에 포함되어야 하므로, Docker Compose 빌드 인자로 전달될 수 있도록 **프로젝트 루트의 `.env` 파일**에 정의해야 합니다. `frontend/.env.local`에만 정의되어 있으면 빌드 시점에 이 값이 전달되지 않아 `appkey=undefined` 오류가 발생합니다. **`.env` 파일의 `your_kakao_app_key` 플레이스홀더를 반드시 실제 유효한 카카오맵 JavaScript 키로 교체해야 지도가 정상적으로 표시됩니다.**

---

## 2. 서버 사이드 렌더링(SSR) 오류

### 문제 상황

- **오류**: `Application error: a server-side exception has occurred...`
- **원인**: Next.js의 서버 컴포넌트(홈, 검색 페이지 등)가 API 데이터를 가져올 때, 클라이언트용 상대 경로인 `/api`를 사용했습니다. 이 코드가 서버(프론트엔드 컨테이너)에서 실행되면, 자기 자신(`http://localhost:3000/api`)에게 API를 요청하는 꼴이 되어 `404 Not Found`가 발생하고 렌더링에 실패했습니다.

### 최종 해결책

서버에서 실행될 때와 클라이언트에서 실행될 때를 구분하여 올바른 API 주소를 반환하는 유틸리티 함수를 만들어 문제를 해결했습니다.

1.  **`getBaseUrl.ts` 유틸리티 생성**:
    - 서버 환경(`typeof window === 'undefined'`)에서는 Docker 내부 네트워크 주소인 `http://backend:8080/api`를 반환하고, 클라이언트 환경에서는 Caddy 프록시를 통하는 `/api`를 반환하는 `getBaseUrl` 함수를 생성했습니다.

2.  **환경 변수 추가**:
    - `frontend/.env.local` 파일에 서버 전용 주소인 `API_URL=http://backend:8080/api`를 추가했습니다.

3.  **코드 리팩토링**:
    - 오류가 발생하던 홈 페이지(`page.tsx`), 검색 페이지(`search/page.tsx`), 룸 상세 페이지(`rooms/[id]/page.tsx`)에서 기존의 `process.env.NEXT_PUBLIC_API_URL` 대신 `getBaseUrl()` 함수를 사용하도록 코드를 수정하여, 실행 환경에 맞는 올바른 API 경로로 데이터를 요청하도록 변경했습니다.

---

## 3. 백엔드 데이터베이스 연결 및 시딩(Seeding)

### 문제 상황

EC2 배포를 위한 Docker 환경에서 `docker compose up` 실행 시, 백엔드 컨테이너가 데이터베이스 마이그레이션 및 시딩(초기 데이터 생성)에 반복적으로 실패했습니다.

- **초기 오류**: `DATABASE_URL` 환경 변수 누락으로 DB 연결 실패.
- **중간 오류**: 시딩 스크립트 실행 시 `테이블이 존재하지 않습니다` 또는 `Unknown file extension ".ts"` 오류 발생.

### 근본 원인

`backend/tsconfig.json`의 `"module": "nodenext"` 설정으로 인해, Docker 컨테이너의 Node.js가 TypeScript 파일(`.ts`)을 ES 모듈로 해석하려고 시도했습니다. 하지만 컨테이너의 `ts-node` 실행 환경이 이와 호환되지 않아 TypeScript 파일을 제대로 처리하지 못하는 충돌이 발생했습니다.

### 최종 해결책

Docker 환경에서 `ts-node`가 모듈 시스템에 구애받지 않고 TypeScript 시드 스크립트를 안정적으로 실행하도록 강제하는 방식으로 문제를 해결했습니다.

1.  **`package.json` 수정**:
    - `devDependencies`에 있던 `prisma`, `ts-node`, `typescript`를 `dependencies`로 옮겨, 최종 Docker 이미지에 항상 포함되도록 보장했습니다.
    - `prisma.seed` 명령어를 `ts-node prisma/seed.ts`로 변경하여 TypeScript 파일을 직접 실행하도록 수정했습니다.

2.  **`seed.ts` 수정**:
    - 매번 `docker compose down -v`로 DB를 초기화하므로, 오류를 유발하던 `clearDatabase()` 함수 호출부를 주석 처리했습니다.

3.  **`resolve-and-deploy.sh` 최종 수정**:
    - 복잡한 `try_seed` 로직을 제거했습니다.
    - `ts-node`가 `tsconfig.json`의 `nodenext` 설정을 무시하고 `CommonJS` 방식으로 실행되도록 `--compiler-options` 플래그를 추가했습니다. 이 부분이 결정적인 해결책이었습니다.
      ```sh
      npx ts-node --compiler-options '{"module": "CommonJS"}' prisma/seed.ts
      ```

---

## 4. EC2 배포를 위한 프로덕션 레벨 설정

### 단일 진입점 설정

- **문제**: `docker-compose.yml`에서 `frontend`의 `3000`번 포트와 `caddy`의 `80`번 포트가 동시에 외부에 노출되어 있어, EC2 환경에서 혼란을 유발하고 잘못된 경로로 접속할 가능성이 있었습니다.
- **해결**: `frontend` 서비스의 `ports` 설정을 제거했습니다. 이로써 모든 외부 트래픽은 Caddy 리버스 프록시(포트 80)를 통해서만 들어오도록 강제하여, 아키텍처를 단순화하고 보안을 강화했습니다. 이제 `http://localhost:3000`으로는 접속이 불가능합니다.

---

## 5. 최종 실행 절차

아래 절차에 따라 애플리케이션을 실행하면, 데이터베이스가 초기화되고 모든 서비스가 정상적으로 실행됩니다.

1.  **모든 컨테이너 및 볼륨 삭제 (완전 초기화 시)**:
    ```bash
    docker compose down -v
    ```

2.  **데이터베이스 마이그레이션 및 시딩**:
    ```bash
    docker compose up --build migrate
    ```

3.  **전체 애플리케이션 실행**:
    ```bash
    docker compose up -d --build
    ```
4.  **애플리케이션 접속**:
    - 브라우저를 열고 **http://localhost** 로 접속합니다. (`:3000`을 붙이지 않습니다.)