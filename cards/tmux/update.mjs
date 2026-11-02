// 언어 · 기여 기록 · 최근 활동을 카페 쇼윈도 속 tmux 터미널 카드(tmux.svg) 하나로 만듭니다. 디자인은 template.svg.
// 로컬에서 토큰 없이 실행하면 기여 기록(GraphQL)만 '--'로 둡니다.
import { readFileSync } from 'node:fs';
import { github, esc, fill, writeCard, isMain } from '../github.mjs';
import { collectLanguages, summarize } from './languages.mjs';
import { collectCalendar, computeStreak } from './streak.mjs';
import { collectEvents, toLines } from './activity.mjs';

const template = readFileSync(new URL('./template.svg', import.meta.url), 'utf8');
const clip = (text, max) => (text.length > max ? text.slice(0, max - 1) + '…' : text);
const pct = share => (share * 100).toFixed(1) + '%';

export function renderTmux({ languages = [], streak = null, activity = [] }) {
  // 언어 막대: x18 폭 274, y70 높이 12 / 목록: y104부터 26 간격 (좌표는 쇼윈도 기준)
  let x = 18;
  const langBar = languages.length
    ? languages.map((item, i) => {
      const width = i === languages.length - 1 ? 292 - x : Math.round(item.share * 274);
      const rect = `<rect x="${x}" y="70" width="${Math.max(width, 0)}" height="12" fill="${item.color}"/>`;
      x += width;
      return rect;
    }).join('')
    : '<rect x="18" y="70" width="274" height="12" fill="#3A2430"/>';
  const langList = languages.length
    ? languages.map((item, i) => {
      const y = 104 + i * 26;
      return `<rect x="18" y="${y - 9}" width="9" height="9" fill="${item.color}" shape-rendering="crispEdges"/>`
        + `<text x="34" y="${y}" fill="#FFF4E6">${esc(item.name)}</text>`
        + `<text x="292" y="${y}" text-anchor="end" fill="#C4A58C">${pct(item.share)}</text>`;
    }).join('')
    : '<text x="18" y="104" fill="#C4A58C">AWAITING FIRST SYNC</text>';

  // 활동: y174부터 18 간격
  const activityRows = activity.length
    ? activity.map((l, i) => {
      const y = 174 + i * 18;
      const detail = l.detail + (l.count > 1 ? ` ×${l.count}` : '');
      return `<text x="332" y="${y}" fill="#E25C45">${l.date}</text>`
        + `<text x="384" y="${y}" font-weight="700" fill="${l.color}">${l.label}</text>`
        + `<text x="448" y="${y}" fill="#FFF4E6">${esc(clip(l.repo, detail ? 26 : 36))}</text>`
        + (detail ? `<text x="742" y="${y}" text-anchor="end" fill="#D9C1A8">${esc(clip(detail, 9))}</text>` : '');
    }).join('')
    : '<text x="332" y="174" fill="#C4A58C">AWAITING FIRST SYNC</text>';

  const desc = [
    languages.length ? 'Languages: ' + languages.map(i => `${esc(i.name)} ${pct(i.share)}`).join(', ') + '.' : '',
    streak ? `Last year: ${streak.total} contributions, ${streak.active} active days, longest streak ${streak.longest} days, best day ${streak.best}.` : '',
    activity.length ? 'Recent: ' + activity.map(l => `${l.date} ${l.label} ${esc(l.repo)}`).join('; ') + '.' : '',
  ].filter(Boolean).join(' ') || 'Not initialized.';

  return fill(template, {
    desc, langBar, langList, activityRows,
    total: streak?.total ?? '--',
    active: streak?.active ?? '--',
    longest: streak ? `${streak.longest}d` : '--',
    best: streak?.best ?? '--',
  });
}

if (isMain(import.meta)) {
  const api = github();
  const languages = summarize(await collectLanguages(api));
  const streak = process.env.GITHUB_TOKEN ? computeStreak(await collectCalendar(api)) : null;
  const activity = toLines(await collectEvents(api));
  await writeCard(new URL('./tmux.svg', import.meta.url), renderTmux({ languages, streak, activity }));
  console.log(`tmux card: ${languages.length} languages, streak ${streak ? 'ok' : 'skipped (no token)'}, ${activity.length} activity lines`);
}
