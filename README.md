# 코드벌스

## 프로젝트 노션 페이지

프로젝트 관련 전체 문서는 [코드벌스 노션 페이지](https://vivid-thyme-ac6.notion.site/1-29b9e3e335cc801d872dff9be4127134?source=copy_link)에서 확인 가능합니다.

## 기능 시연 영상

[기능 시연 영상 보기](https://drive.google.com/file/d/1Oi_Zl2SKq6MtqJW_Xo4AfSwaxVPsj0dW/view?usp=drive_link)

## UI/UX 및 반응형 시연 영상

[UI/UX 및 반응형 시연 영상 보기](https://drive.google.com/file/d/1hulv2SiyJmPqHohY1GOigqowSo3ODas5/view?usp=drive_link)

<br>
<br>
<br>
<br>
<br>

# 코드 컨벤션

## 브랜치

| Prefix | 설명              |
| ------ | ----------------- |
| main   | 서비스 브랜치     |
| dev    | 배포 전 작업 기준 |
| feat   | 기능 단위 구현    |
| hotfix | 긴급 버그 수정    |

## 커밋 메시지

| Type     | 설명                                          |
| -------- | --------------------------------------------- |
| Init     | 초기 세팅 (패키지 설치, eslint/prettier 설정) |
| Feat     | 새로운 기능 추가                              |
| Fix      | 버그 수정                                     |
| Docs     | 문서 추가/수정/삭제                           |
| Style    | 코드 포맷팅 등 코드 변경 없는 수정            |
| Refactor | 코드 리팩토링                                 |
| Test     | 테스트 코드 추가/리팩토링                     |
| Chore    | 패키지 매니저 수정, 기타 환경 설정            |
| Build    | 빌드 관련 파일 수정                           |
| Design   | UI/CSS 디자인 변경                            |
| Comment  | 주석 추가/변경                                |
| Rename   | 파일/폴더 이름 변경                           |
| Remove   | 파일 삭제                                     |
| !HOTFIX  | 긴급 치명적 버그 수정                         |

## 코드

| 항목              | 네이밍 규칙                      | 예시                             |
| ----------------- | -------------------------------- | -------------------------------- |
| Components        | PascalCase                       | `LoginForm`, `UserCard`          |
| State variables   | Boolean → `is/has/should` 접두사 | `isOpen`, `hasError`             |
| Event handlers    | handle + 동작 이름               | `handleClick`, `handleSubmit`    |
| Constants         | UPPER_SNAKE_CASE                 | `MAX_LENGTH`, `API_URL`          |
| Utility functions | camelCase                        | `formatDate()`, `calculateSum()` |

<br>
<br>
<br>

# 실행

로컬 도커 컨테이너에 있는 MySQL에 접속하려면 아래 명령을 사용하세요:

```bash
docker compose exec db mysql -u codeverse -psecret -D codeverse
```
