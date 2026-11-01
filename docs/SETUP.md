# O_Dae ✦ 프로필 적용 가이드

## 1. GitHub에 올리기

1. GitHub 계정 **odh97**에서 **odh97**라는 이름의 공개 저장소를 만듭니다. 기존 odh97/odh97가 있다면 백업한 뒤 필요한 파일을 교체합니다.
2. 이 패키지 **안쪽 파일과 폴더**를 저장소 최상위에 올립니다. odh97-profile 폴더 자체를 한 단계 더 넣지 마세요.
3. README.md와 cards/·assets/는 필수입니다. 자동 갱신에는 **숨김 폴더 .github/**도 필요합니다. 웹 업로드 시 .github가 누락되지 않았는지 저장소 파일 목록에서 확인하세요.
4. 프로필 https://github.com/odh97 에서 결과를 확인합니다. 기본 브랜치가 main/master가 아니면 워크플로의 push.branches를 수정합니다.

## 2. 프로필 카드

프로필 카드는 터미널 화면 스타일입니다. 캐릭터는 GitHub 프로필 사진에서 보여 주므로 카드에는 넣지 않습니다. 문구는 cards/profile/profile.svg의 text 요소에서 수정하고, 새 글자를 쓰면 `node cards/embed.mjs cards/profile/profile.svg`를 실행하세요.

## 3. 통계 첫 실행

저장소 **Actions → Update profile stats → Run workflow**를 한 번 실행하세요. 이후 매일 **한국 시간 09:23**에 갱신을 시도합니다. 예약 실행은 지연될 수 있습니다. 별도 개인 토큰 입력 없이 저장소의 GITHUB_TOKEN을 사용합니다.

통계 카드에는 실제 공개 통계와 UTC 갱신 시각이 표시됩니다. 페이지를 열 때 API를 호출하는 방식이 아니라, Actions가 매일 데이터를 조회해 저장소의 SVG 파일을 갱신하는 방식입니다. API 요청이 실패하면 기존 카드는 유지되고 Actions에 실패가 표시됩니다. **--**는 아직 통계를 받지 않은 초기 상태를 뜻합니다.

| 항목 | 집계 기준 |
| --- | --- |
| PUBLIC REPOS | odh97 소유의 공개 저장소 수, fork 포함 |
| STARS | fork가 아닌 공개 저장소의 받은 star 합계 |
| FOLLOWERS | odh97 공개 팔로워 수 |
| FORKS | fork가 아닌 공개 저장소의 forks_count 합계 |

커밋 수·비공개 기여·회사 또는 조직 소유 저장소는 집계하지 않습니다. STARS와 FORKS는 저장소 API 필드의 합계이며 기여도 점수가 아닙니다.

통계가 갱신되지 않으면 Actions 활성화 여부, 실패 로그, 저장소 정책의 Actions 쓰기 권한과 기본 브랜치 보호 규칙을 확인하세요. 이 워크플로는 cards/stats/stats.svg를 기본 브랜치에 커밋합니다. 조직 정책이 쓰기를 금지하거나 브랜치 보호가 직접 푸시를 막으면 관리 정책에 맞는 변경이 필요합니다. 장기간 활동이 없는 공개 저장소의 예약 실행은 비활성화될 수 있으므로 Actions에서 재활성화하세요.

## 4. 디자인과 배지

첨부 시안에 맞춘 남색 카드와 보라색 테두리 디자인입니다. 소개(cards/profile/profile.svg)와 기술(cards/skills/skills.svg)은 별도 카드로 README에 차례로 표시합니다. SVG는 960px 기준이며 화면에 맞춰 축소됩니다. 외부 폰트·CSS·스크립트를 불러오지 않습니다. 글자는 Arial과 맑은 고딕 등 시스템 글꼴을 사용하므로 기기별 자형에 작은 차이가 있을 수 있습니다.

소개는 cards/profile/profile.svg, 기술 배지는 cards/skills/skills.svg의 text 요소에서 수정합니다. 별도 빌드 없이 바로 반영됩니다. 기술 카드는 캐릭터 배경을 따른 픽셀 야경 스타일이며, 배지 좌표 규칙은 파일 상단 주석에 있습니다. 글꼴(제목 Silkscreen, 본문 JetBrains Mono·IBM Plex Sans KR)은 GitHub에서도 보이도록 SVG 안에 넣었습니다. 새 글자를 쓰면 `node cards/embed.mjs cards/profile/profile.svg cards/skills/skills.svg`를 실행하세요.

| 색 | 용도 |
| --- | --- |
| #111526 / #202841 | 바깥 배경·남색 카드 |
| #28324D / #46516F | 기술 배지 배경·테두리 |
| #9786EC | 보라색 테두리 |
| #EDE9FE | 밝은 글자 |
| #BDEDDD | 민트 포인트 |

기술 배지는 cards/skills/skills.svg에 직접 그리므로 외부 배지 서비스 없이 표시됩니다. 중복된 펼침 배지 영역을 제거하고 소개 카드 안에서 기술 목록을 한 번에 볼 수 있도록 구성했습니다. README에는 이미지 대체 텍스트를 포함했습니다.

## 5. 기여 그래프 (아파트 카드)

README 세 번째 카드는 1년치 기여 기록을 아파트 외벽의 창문으로 보여 줍니다. 기여가 없는 날은 꺼진 창문, 많을수록 밝은 불빛입니다. 위로는 하늘과 옥상(안테나·화분·위성 안테나), 아래로는 화단·산책로·잔디밭이 이어져 프로필(하늘) → 스킬(야경) → 아파트로 장면이 연결됩니다. 왼쪽 위에는 `$ git log --graph`가 있습니다.

애니메이션은 [pacman-contribution-graph](https://github.com/abozanona/pacman-contribution-graph)가 GitHub GraphQL의 contributionCalendar로 생성합니다. 프로필 설정에서 비공개 기여 표시를 켜 두면 비공개 기여 횟수도 포함됩니다. 팩맨 자리는 캐릭터 그림 속 회색 고양이 픽셀 스프라이트로 바꾸고 이동 경로만 유지합니다(회전·입 모양 제외).

- 장면 디자인: cards/pacman/template.svg (명령 줄 글자를 바꾸면 `node cards/embed.mjs cards/pacman/template.svg`)
- 창문 색·고양이 스프라이트: cards/pacman/style.mjs의 `colors`, `PLAYER`
- 로컬에서 다시 입히기: `node cards/pacman/style.mjs` (이미 스타일이 입혀진 파일에도 다시 적용 가능)

Actions(**Update Pac-Man contributions**)가 매일 한국 시간 09:33에 갱신합니다.

## 폴더 구성

```text
README.md
CLAUDE.md                     카드별 수정 위치 안내
cards/
  profile/profile.svg         소개 카드 (직접 편집)
  skills/skills.svg           기술 카드 (직접 편집)
  embed.mjs                   SVG에 글꼴 삽입 (프로필·스킬 공용)
  pacman/
    template.svg              아파트 카드 장면 디자인
    style.mjs                 색상 매핑 + 템플릿 적용
    pacman.svg                생성물 (Actions가 실제 기록으로 교체, 직접 편집 금지)
  stats/
    template.svg              통계 카드 디자인
    update.mjs                GitHub API 수집 + 템플릿 적용
    update.test.mjs           테스트
    stats.svg                 생성물 (Actions가 매일 갱신)
.github/workflows/profile-stats.yml
.github/workflows/contribution-previews.yml
docs/SETUP.md
```

## 선택: 로컬 검증

Node.js 24가 있다면 패키지 폴더에서 다음을 실행할 수 있습니다. 추가 패키지는 필요하지 않습니다.

```text
node --test cards/stats/update.test.mjs
node cards/stats/update.mjs
```

두 번째 명령은 GitHub API에 접속하여 통계를 갱신합니다. --init 옵션은 초기 카드로 되돌리므로 적용 후에는 사용하지 마세요.

## 참고 문서

- [GitHub 프로필 README 조건](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme)
- [Shields 정적 배지와 옵션](https://shields.io/badges/static-badge)
- [Simple Icons 로고 식별자](https://github.com/simple-icons/simple-icons/blob/develop/slugs.md)
- [GitHub REST 저장소 API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
- [GitHub Actions 실행](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
