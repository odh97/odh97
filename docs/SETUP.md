# O_Dae ✦ 프로필 적용 가이드

## 1. GitHub에 올리기

1. GitHub 계정 **odh97**에서 **odh97**라는 이름의 공개 저장소를 만듭니다. 기존 odh97/odh97가 있다면 백업한 뒤 필요한 파일을 교체합니다.
2. 이 패키지 **안쪽 파일과 폴더**를 저장소 최상위에 올립니다. odh97-profile 폴더 자체를 한 단계 더 넣지 마세요.
3. README.md와 assets/는 필수입니다. 통계 자동 갱신에는 scripts/와 **숨김 폴더 .github/**도 필요합니다. 웹 업로드 시 .github가 누락되지 않았는지 저장소 파일 목록에서 확인하세요.
4. 프로필 https://github.com/odh97 에서 결과를 확인합니다. 기본 브랜치가 main/master가 아니면 워크플로의 push.branches를 수정합니다.

## 2. 내 캐릭터 연결하기

캐릭터는 이 패키지에 포함하지 않았습니다. 별도 Work에서 만든 본인의 파일을 **assets/avatar.png**로 저장하세요. README.md 상단의 다음 태그를 주석 밖으로 이동합니다.

```html
<img src="./assets/avatar.png" align="right" width="144" alt="오대현의 픽셀 캐릭터" />
```

이미지 추가 전에는 주석을 유지하세요. 안내 파일 assets/avatar.png.README.md는 지워도 됩니다. 이미지 경로는 README 위치 기준이며 대소문자까지 같아야 합니다. 캐릭터와 SVG를 별개 파일로 두었으므로 교체가 쉽고, SVG 내부의 외부 이미지 로딩에 의존하지 않습니다.

## 3. 통계 첫 실행

저장소 **Actions → Update profile stats → Run workflow**를 한 번 실행하세요. 이후 매일 **한국 시간 09:23**에 갱신을 시도합니다. 예약 실행은 지연될 수 있습니다. 별도 개인 토큰 입력 없이 저장소의 GITHUB_TOKEN을 사용합니다.

초기 카드의 **--**는 실제 수치를 아직 받지 않았다는 뜻입니다. 제작 환경에서 GitHub API에 연결할 수 없어 숫자를 임의로 채우지 않았습니다. 첫 성공 이후 실제 공개 통계와 UTC 갱신 시각이 표시됩니다. API 요청이 실패하면 기존 카드는 유지되고 Actions에 실패가 표시됩니다.

| 항목 | 집계 기준 |
| --- | --- |
| PUBLIC REPOS | odh97 소유의 공개 저장소 수, fork 포함 |
| STARS | fork가 아닌 공개 저장소의 받은 star 합계 |
| FOLLOWERS | odh97 공개 팔로워 수 |
| FORKS | fork가 아닌 공개 저장소의 forks_count 합계 |

커밋 수·비공개 기여·회사 또는 조직 소유 저장소는 집계하지 않습니다. STARS와 FORKS는 저장소 API 필드의 합계이며 기여도 점수가 아닙니다.

통계가 갱신되지 않으면 Actions 활성화 여부, 실패 로그, 저장소 정책의 Actions 쓰기 권한과 기본 브랜치 보호 규칙을 확인하세요. 이 워크플로는 assets/stats.svg를 기본 브랜치에 커밋합니다. 조직 정책이 쓰기를 금지하거나 브랜치 보호가 직접 푸시를 막으면 관리 정책에 맞는 변경이 필요합니다. 장기간 활동이 없는 공개 저장소의 예약 실행은 비활성화될 수 있으므로 Actions에서 재활성화하세요.

## 4. 디자인과 배지

첨부 시안에 맞춘 남색 카드와 보라색 테두리 디자인입니다. 소개·기술을 한 장의 overview.svg에 담아 GitHub에서도 배경과 배치를 유지합니다. SVG는 960px 기준이며 화면에 맞춰 축소됩니다. 외부 폰트·CSS·스크립트를 불러오지 않습니다. 글자는 Arial과 맑은 고딕 등 시스템 글꼴을 사용하므로 기기별 자형에 작은 차이가 있을 수 있습니다.

소개는 assets/profile.svg의 text 요소, 기술 칩은 assets/skills.svg의 text 요소에서 수정합니다. 수정 후 Node.js로 `node scripts/build-overview.mjs`를 실행하면 README에서 표시하는 overview.svg에 반영됩니다. 카드 안의 기술 칩은 시안에 맞춘 SVG 그래픽이며, 실제 Shields 배지 10종은 README의 **기술 배지 보기**를 펼쳐 확인할 수 있습니다.

| 색 | 용도 |
| --- | --- |
| #111526 / #202841 | 바깥 배경·남색 카드 |
| #333C59 / #202840 | 기술 칩·Shields 배지 |
| #9786EC | 보라색 테두리 |
| #EDE9FE | 밝은 글자 |
| #BDEDDD | 민트 포인트 |

기술 10종은 실제 img.shields.io URL을 사용합니다. Zustand는 다른 기술의 로고로 오인되지 않도록 **텍스트 배지**로 만들었습니다. 배지는 외부 서비스이므로 네트워크·서비스 장애 때 표시가 지연될 수 있습니다. SVG 헤더와 통계 카드는 저장소 파일을 사용하므로 Shields와 독립적입니다. README에는 이미지 대체 텍스트를 포함했습니다.

## 폴더 구성

```text
README.md
assets/
  overview.svg                README에 표시하는 소개·기술 통합 카드
  profile.svg                 소개 카드
  skills.svg                  기술 인벤토리 카드
  activity.svg                통계 섹션 헤더
  stats.svg                   자동 갱신 통계 카드
  footer.svg                  하단 장식
  avatar.png.README.md         캐릭터 경로 안내 (PNG 아님)
  avatar.png                  본인이 추가할 파일, 현재 미포함
.github/workflows/profile-stats.yml
scripts/build-overview.mjs
scripts/update-stats.mjs
scripts/test-stats.mjs
docs/SETUP.md
```

## 선택: 로컬 검증

Node.js 24가 있다면 패키지 폴더에서 다음을 실행할 수 있습니다. 추가 패키지는 필요하지 않습니다.

```text
node --test scripts/test-stats.mjs
node scripts/update-stats.mjs
```

두 번째 명령은 GitHub API에 접속하여 통계를 갱신합니다. --init 옵션은 초기 카드로 되돌리므로 적용 후에는 사용하지 마세요.

## 참고 문서

- [GitHub 프로필 README 조건](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme)
- [Shields 정적 배지와 옵션](https://shields.io/badges/static-badge)
- [Simple Icons 로고 식별자](https://github.com/simple-icons/simple-icons/blob/develop/slugs.md)
- [GitHub REST 저장소 API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
- [GitHub Actions 실행](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
