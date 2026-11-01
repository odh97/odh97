# 프로필 README 카드 구조

카드 하나를 수정할 때는 **그 카드 폴더만** 보면 됩니다. 다른 카드 폴더는 읽지 마세요.

| 카드 | 디자인 수정 | 로직 | 결과물 (README가 표시) |
| --- | --- | --- | --- |
| 프로필 | `cards/profile/profile.svg` (위쪽만) | `cards/embed.mjs` (글꼴 삽입) | 같은 파일 |
| 스킬 | `cards/skills/skills.svg` (위쪽만) | `cards/embed.mjs` (글꼴 삽입) | 같은 파일 |
| 잔디(아파트) | `cards/pacman/template.svg` (위쪽만) | `cards/pacman/style.mjs` (창문 색·고양이 `PLAYER`) | `cards/pacman/pacman.svg` |
| 카페(언어·기여 기록·최근 활동) | `cards/tmux/template.svg` (장면·쇼윈도) | `cards/tmux/update.mjs` + `languages.mjs`·`streak.mjs`·`activity.mjs` | `cards/tmux/tmux.svg` |

- **`cards/pacman/pacman.svg`는 약 250KB짜리 생성물입니다. 절대 읽거나 편집하지 마세요.** 프레임은 `template.svg`, 색상 매핑은 `style.mjs`의 `colors`에서 수정하고 `node cards/pacman/style.mjs`로 다시 생성합니다.
- `profile.svg`·`skills.svg` 끝의 "아래는 생성되는" 주석 뒤는 base64 글꼴입니다. 파일은 그 주석 앞까지만 읽으세요 (Grep으로 줄 번호 확인 후 limit). 새 글자를 쓰면 `node cards/embed.mjs <svg 경로>`를 실행합니다. 글꼴은 큰 제목만 Silkscreen(픽셀), 나머지는 JetBrains Mono / IBM Plex Sans KR입니다. 배지 좌표 규칙은 skills.svg 주석에 있습니다.
- 템플릿의 `{{key}}` 자리표시자는 각 `.mjs`가 채웁니다. 키를 추가하면 스크립트의 `vars`에도 추가해야 합니다.
- 카페 카드는 `cards/github.mjs`(API·템플릿 공용 헬퍼)를 씁니다. `tmux.svg` 끝에는 base64 글꼴이 붙으니 읽지 말고 `template.svg`를 보세요. 쇼윈도 안 좌표 규칙은 템플릿 주석에 있습니다. 로직을 바꾸면 `node --test cards/tmux/update.test.mjs`. 기여 기록은 GraphQL이라 토큰이 필요해 로컬에선 `--`로 남습니다.
- 워크플로: `contribution-previews.yml`(아파트 잔디), `extra-cards.yml`(카페 카드).
- 카드를 고쳤는데 GitHub에서 안 바뀌어 보이면 브라우저 캐시입니다. README의 이미지 주소 뒤 `?v=` 숫자를 올리세요(예: `profile.svg?v=3`). SVG 애니메이션은 CSS `@keyframes`로 넣으세요(프로필 커서 참고).
