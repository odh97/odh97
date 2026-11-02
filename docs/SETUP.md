# O_Dae ✦ 프로필 적용 가이드

## 1. GitHub에 올리기

1. GitHub 계정 **odh97**에서 **odh97**라는 이름의 공개 저장소를 만듭니다. 기존 odh97/odh97가 있다면 백업한 뒤 필요한 파일을 교체합니다.
2. 이 패키지 **안쪽 파일과 폴더**를 저장소 최상위에 올립니다. odh97-profile 폴더 자체를 한 단계 더 넣지 마세요.
3. README.md와 cards/·assets/는 필수입니다. 자동 갱신에는 **숨김 폴더 .github/**도 필요합니다. 웹 업로드 시 .github가 누락되지 않았는지 저장소 파일 목록에서 확인하세요.
4. 프로필 https://github.com/odh97 에서 결과를 확인합니다. 기본 브랜치가 main/master가 아니면 워크플로의 push.branches를 수정합니다.

## 2. 프로필 카드

프로필 카드는 터미널 화면 스타일입니다. 캐릭터는 GitHub 프로필 사진에서 보여 주므로 카드에는 넣지 않습니다. 문구는 cards/profile/profile.svg의 text 요소에서 수정하고, 새 글자를 쓰면 `node cards/embed.mjs cards/profile/profile.svg`를 실행하세요.

## 3. 카페 카드 (언어 · 기여 기록 · 최근 활동)

README 마지막 카드는 밤의 카페 거리입니다. 쇼윈도 안의 tmux 터미널이 세 칸으로 나뉘어 다음을 보여 줍니다.

| 칸 | 내용 | 데이터 |
| --- | --- | --- |
| `cat languages.txt` | 많이 쓴 언어 상위 5개 + Other | 공개 원본 저장소(fork 제외)의 언어별 bytes 합계 |
| `cat streak.txt` | 1년 기여 수 · 활동한 날 · 최장 연속 · 하루 최다 | GraphQL contributionCalendar (비공개 기여 표시를 켜면 포함) |
| `tail -n 5 activity.log` | 최근 공개 활동 5줄 | 공개 이벤트 API (반영이 몇 시간 늦을 수 있음) |

쉬는 날이 있어도 0으로 떨어지는 "현재 연속 기여"는 일부러 넣지 않았습니다. Actions(**Update cafe card**)가 매일 한국 시간 09:43에 갱신합니다. 장면과 쇼윈도 디자인은 cards/tmux/template.svg, 데이터는 cards/tmux/*.mjs에 있습니다.

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

## 5. 기여 그래프 (가을 주택가 카드)

README 세 번째 카드는 1년치 기여 기록을 나란히 선 주택 여섯 채의 창문으로 보여 줍니다. 기여가 없는 날은 꺼진 창문, 많을수록 밝은 불빛입니다. 위로는 보름달과 지붕(다락 창·굴뚝), 양옆은 단풍나무, 아래로는 울타리·보도·낙엽이 이어지고 카드 전체에 단풍잎이 떨어집니다. 왼쪽 위에는 `$ git log --graph`가 있습니다. 이전 여름밤(아파트) 버전은 태그 `theme/2026-summer-night`에 있습니다.

애니메이션은 [pacman-contribution-graph](https://github.com/abozanona/pacman-contribution-graph)가 GitHub GraphQL의 contributionCalendar로 생성합니다. 프로필 설정에서 비공개 기여 표시를 켜 두면 비공개 기여 횟수도 포함됩니다. 팩맨 자리는 캐릭터 그림 속 회색 고양이 픽셀 스프라이트로 바꾸고 이동 경로만 유지합니다(회전·입 모양 제외).

- 장면 디자인: cards/pacman/template.svg (주택 경계는 잔디 열 기준 0·9·17·27·35·44·53) (명령 줄 글자를 바꾸면 `node cards/embed.mjs cards/pacman/template.svg`)
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
  embed.mjs                   SVG에 글꼴 삽입 (공용)
  github.mjs                  GitHub API · 템플릿 공용 헬퍼
  pacman/
    template.svg              아파트 카드 장면 디자인
    style.mjs                 창문 색 매핑 + 고양이 스프라이트 + 템플릿 적용
    pacman.svg                생성물 (Actions가 실제 기록으로 교체, 직접 편집 금지)
  tmux/
    template.svg              카페 장면 + 쇼윈도 터미널 디자인
    update.mjs                세 칸 데이터를 채워 tmux.svg 생성
    languages.mjs             언어 비율 수집·계산
    streak.mjs                기여 기록 수집·계산
    activity.mjs              최근 활동 수집·정리
    update.test.mjs           테스트
    tmux.svg                  생성물 (Actions가 매일 갱신)
.github/workflows/contribution-previews.yml
.github/workflows/extra-cards.yml
docs/SETUP.md
```

## 선택: 로컬 검증

Node.js 24가 있다면 저장소 폴더에서 다음을 실행할 수 있습니다. 추가 패키지는 필요하지 않습니다.

```text
node --test cards/tmux/update.test.mjs
node cards/tmux/update.mjs
node cards/embed.mjs cards/tmux/tmux.svg
```

두 번째 명령은 GitHub API에 접속해 카페 카드를 다시 만듭니다. 토큰이 없으면 기여 기록 칸은 `--`로 남고, 비로그인 요청 한도(시간당 60회)를 넘으면 실패할 수 있습니다.

## 참고 문서

- [GitHub 프로필 README 조건](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme)
- [Shields 정적 배지와 옵션](https://shields.io/badges/static-badge)
- [Simple Icons 로고 식별자](https://github.com/simple-icons/simple-icons/blob/develop/slugs.md)
- [GitHub REST 저장소 API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
- [GitHub Actions 실행](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
