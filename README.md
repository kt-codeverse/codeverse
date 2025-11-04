# ✅ Convention

## Branch Naming Convention 🪵

| 머릿말  | 설명                               |
| ------- | ---------------------------------- |
| main    | 서비스 브랜치                      |
| develop | 배포 전 작업 기준                  |
| feat    | 기능 단위 구현                     |
| hotfix  | 서비스 중 긴급 수정 건에 대한 처리 |

## **🔥 Commit Message Convention**

| **커밋 유형** | **설명**                                                     |
| ------------- | ------------------------------------------------------------ |
| `Init`        | 초기 세팅시에만 사용 (패키지 설치, eslint/ prettier 작성)    |
| `Feat`        | 새로운 기능 추가                                             |
| `Fix`         | 버그 수정                                                    |
| `Docs`        | 문서 추가, 수정, 삭제                                        |
| `Style`       | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| `Refactor`    | 코드 리팩토링                                                |
| `Test`        | 테스트 코드, 리팩토링 테스트 코드 추가                       |
| `Chore`       | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore           |
| `Build`       | 빌드 관련 파일 수정에 대한 커밋                              |
| `Design`      | CSS 등 사용자 UI 디자인 변경                                 |
| `Comment`     | 필요한 주석 추가 및 변경                                     |
| `Rename`      | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우          |
| `Remove`      | 파일을 삭제하는 작업만 수행한 경우                           |
| `!HOTFIX`     | 급하게 치명적인 버그를 고쳐야 하는 경우                      |

---

## **🌿 Branch Convention**

### **Branch Naming 규칙**

- **형식**: `<prefix>/<#issue 번호>/<상세기능>`
- **Prefix 목록**:
  - `Init/`: 초기 세팅 (패키지 설치, eslint/prettier 설정 등)
  - `Feat/`: 새로운 기능 개발
  - `Fix/`: 버그 수정
  - `Docs/`: 문서 추가, 수정, 삭제
  - `Style/`: 코드 formatting, 세미콜론 누락 등 코드 자체 변경이 없는 작업
  - `Refactor/`: 코드 리팩토링
  - `Test/`: 테스트 코드 작성 및 리팩토링
  - `Chore/`: 기타 작업 (패키지 매니저 수정, `.gitignore` 변경 등)
  - `Build/`: 빌드 관련 파일 수정
  - `Design/`: CSS 등 사용자 UI 디자인 변경
  - `Comment/`: 주석 추가 및 변경
  - `Rename/`: 파일 또는 폴더 이름 변경 및 이동
  - `Remove/`: 파일 삭제 작업만 수행한 경우
  - `Hotfix/`: 긴급하게 치명적인 버그 수정
- **예시**:
  - `Feat/#12/logInPage`
  - `Fix/#25/headerBug`

---

## **📋 Issue Convention**

### **Issue Title 규칙**

- **형식**: `[태그] 제목`
- **태그 목록**:
  - `Init`: 초기 세팅 (패키지 설치, eslint/prettier 설정 등)
  - `Feat`: 새로운 기능 개발
  - `Fix`: 버그 수정
  - `Docs`: 문서 추가, 수정, 삭제
  - `Style`: 코드 formatting, 세미콜론 누락 등 코드 자체 변경이 없는 작업
  - `Refactor`: 코드 리팩토링
  - `Test`: 테스트 코드 작성 및 리팩토링
  - `Chore`: 기타 작업 (패키지 매니저 수정, `.gitignore` 변경 등)
  - `Build`: 빌드 관련 파일 수정
  - `Design`: CSS 등 사용자 UI 디자인 변경
  - `Comment`: 주석 추가 및 변경
  - `Rename`: 파일 또는 폴더 이름 변경 및 이동
  - `Remove`: 파일 삭제 작업만 수행한 경우
  - `Hotfix`: 긴급하게 치명적인 버그 수정
- **예시**:
  - `[Feat] Tool List Card 공통 컴포넌트 구현`
  - `[Init] ESLint, Prettier, StyleLint 초기세팅`

### **Issue Template**

- **제목**: `[Feat] 간단한 요약`
- **내용**:

  ```markdown
  ## 📄 작업할 내용

  - 작업할 기능에 대한 설명을 작성해주세요.

  ## ✅ 작업할 내용

  - 작업할 내용을 최대한 세분화 하여 작성해주세요.
  - [ ] todo
  - [ ] todo

  ## 🎨 뷰 미리보기

  - 작업하고자 하는 기능의 뷰를 첨부해주세요.
  ```

- **제목**: `[Bug] 간단한 요약`

- **내용**:

  ```markdown
  ## 🐛 버그 설명

  - 버그가 언제, 어떻게 발생했는지 작성해주세요.

  ## 👍 정상 동작

  - 정상적인 동작에 대해 설명해주세요.

  ---
  ```

## **🔄 Pull Request (PR) Convention**

### **PR Title 규칙**

- **형식**: `[태그] 제목`
- **태그 목록**:
  - `Feat`: 새로운 기능 개발
  - `Fix`: 버그 수정
  - `Docs`: 문서 추가/수정
  - `Style`: 코드 스타일 변경
  - `Refactor`: 코드 리팩토링
  - `Test`: 테스트 코드 작성/수정
  - `Chore`: 기타 작업
  - `Build`: 빌드 관련 작업
  - `Design`: UI/디자인 작업
  - `Comment`: 주석 추가/수정
  - `Rename`: 파일/폴더 이름 변경
  - `Remove`: 파일 삭제
  - `Hotfix`: 긴급한 버그 수정
- **예시**:
  - `[Feat] Tool List Card 공통 컴포넌트 구현`
  - `[Fix] Header 컴포넌트의 버그 수정`

### **PR Template**

- **PR 작성 규칙**:

  ```markdown
  ## 📑 이슈 번호

  <!-- 이슈 번호를 작성해주세요 ex) #11 -->

  - close #

  ## ✨️ 작업 내용

  <!-- 작업 내용을 간략히 설명해주세요 -->

  ## 💙 코멘트

  <!-- 리뷰어가 중점적으로 봐주었으면 하는 부분이나 궁금한 점을 자유롭게 남겨주세요! -->

  ## 📸 구현 결과

  <!-- 구현한 기능이 모두 결과물에 포함되도록 자유롭게 첨부해주세요 (스크린샷, gif, 동영상, 배포링크 등) -->

  <!-- ⚠️⚠️⚠️⚠️⚠️⚠️ 잠깐 !!!! ⚠️⚠️⚠️⚠️⚠️ -->
  <!-- PR 제목 컨벤션에 맞게 잘 작성했는지, assignee 및 reviewer 지정했는지 다시 한 번 체크하기 !! -->
  ```

## Naming Rule 📄

| 머릿말            | 설명                             |
| ----------------- | -------------------------------- |
| Components        | PascalCase                       |
| State variables   | (boolean values) is, has, should |
| Event handlers    | handle                           |
| Constants         | UPPER_SNAKE_CASE                 |
| Utility functions | camelCase                        |
