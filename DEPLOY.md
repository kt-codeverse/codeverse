# 배포 가이드 (Docker Hub 기반)

이 문서는 GitHub Actions → Docker Hub → EC2(도커 컴포즈) 순으로 배포하는 절차를 정리합니다.

## 요약

- 워크플로: `dev` 브랜치 푸시 시 백엔드/프론트 이미지를 빌드하여 Docker Hub에 푸시
- EC2: `docker-compose.prod.yml`에서 지정한 Docker Hub 이미지를 pull 하여 컨테이너 시작

## 필수 GitHub Secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (Docker Hub에서 생성한 personal access token)
- `EC2_HOST`, `EC2_USER`, `SSH_PRIVATE_KEY`
- `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `NEXT_PUBLIC_API_URL`

### GitHub Actions 추가 Secrets (CI/CD 자동화용)

- `SSH_PRIVATE_KEY` : EC2에 접속 가능한 PEM 개인키 내용 전체(개행 포함). Repository > Settings > Secrets and variables > Actions 에 추가하세요.
- `EC2_HOST` : 배포 대상 EC2 퍼블릭 IP 또는 DNS
- `EC2_USER` : EC2 접속 사용자(예: `ec2-user` 또는 `ubuntu`)
- `DEPLOY_PATH` : EC2에서 리포지토리가 위치한 경로(예: `/home/ec2-user/codeverse`) — 워크플로는 해당 경로로 이동해 `deploy/pull-and-restart.sh`를 실행합니다.

참고: 워크플로는 먼저 백엔드/프론트 빌드를 수행한 뒤(빌드 성공 시) SSH로 EC2에 접속해 `deploy/pull-and-restart.sh`를 실행합니다. Secrets가 정확히 설정되어 있어야 자동 배포가 작동합니다.

## Docker Hub 리포지토리

- Docker Hub에서 `DOCKERHUB_USERNAME/TripNest-backend` 및 `DOCKERHUB_USERNAME/TripNest-frontend` 리포지토리를 만들거나, 워크플로가 기존 리포지토리에 푸시하도록 설정하세요(프라이빗 리포지토리도 가능).

## EC2 준비

1. Ubuntu 22.04 권장

2. `deploy/bootstrap-ec2.sh`를 복사하여 EC2에서 실행(또는 GitHub Actions로 파일을 전송 후 실행)

```bash
# EC2에서
chmod +x ~/repo/deploy/bootstrap-ec2.sh
~/repo/deploy/bootstrap-ec2.sh
```

- EC2에서 private Docker Hub 리포지토리를 pull 하려면 `docker login`이 필요합니다. 워크플로가 EC2에 SSH로 접속해 배포 중에 자동으로 `docker login`을 실행하도록 구성되어 있으므로 별도 조치는 필요하지 않습니다.

## 배포 흐름(수동 검증)

1. GitHub Actions가 Docker Hub에 이미지 푸시 (작업 로그 확인)

2. Actions가 `docker-compose.prod.yml`을 EC2 `~/deploy`로 복사

3. Actions 원격 명령 실행: `.env` 생성 → `docker login`(EC2에서) → `docker compose -f docker-compose.prod.yml pull` → `docker compose -f docker-compose.prod.yml up -d`

4. EC2에서 상태 확인:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f frontend
```

## 시스템 재시작/자동 시작

- 필요하면 `systemd` 유닛을 만들어 서버가 재부팅되면 자동으로 `docker compose up` 하도록 구성할 수 있습니다. 예시(문서 내 참고)

## 안정성/운영 권장

- 빌드 → 푸시 → pull 흐름은 빌드 부담을 GitHub Actions로 옮겨 EC2에서 빠르게 디플로이 가능
- 롤백: 이전 태그(`latest` 또는 특정 SHA)를 보존하면 빠른 롤백 가능
- 모니터링: container health check, 로그 집계, 알람을 설정하세요
