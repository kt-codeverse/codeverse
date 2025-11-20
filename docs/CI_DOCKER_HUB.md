# CI / Docker Hub 설정

GitHub Actions에서 Docker 이미지를 `docker.io`에 푸시하려면 Docker Hub 액세스 토큰을 생성한 뒤 레포지토리 Secrets에 추가해야 합니다.

1. Docker Hub에서 Access Token 생성: `https://hub.docker.com/settings/security` → `Access Tokens` → `New Access Token` (예: 이름 `github-actions`)
2. GitHub 레포지토리 → `Settings` → `Secrets` → `Actions` → `New repository secret` 에 아래 값 추가
   - `DOCKERHUB_USERNAME`: Docker Hub 사용자명 (예: `dbalsrl7648`)
   - `DOCKERHUB_TOKEN`: 방금 생성한 Docker Hub Access Token

워크플로 파일: `.github/workflows/build-and-push.yml` 에서 `docker/login-action`은 다음과 같이 시크릿을 참조하도록 설정되어 있습니다.

```yaml
with:
  registry: ${{ env.REGISTRY }}
  username: ${{ secrets.DOCKERHUB_USERNAME }}
  password: ${{ secrets.DOCKERHUB_TOKEN }}
```

토큰을 잘못 넣으면 `unauthorized: incorrect username or password` 오류가 발생합니다.
