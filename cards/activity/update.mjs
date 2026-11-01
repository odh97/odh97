// 공개 이벤트(/users/odh97/events/public) 최근 5줄을 activity.svg로 만듭니다. 디자인은 template.svg.
// 같은 날·같은 저장소·같은 종류는 한 줄로 묶고 ×N으로 표시합니다. 비공개 저장소 활동은 나오지 않습니다.
import { readFileSync } from 'node:fs';
import { github, esc, fill, writeCard, isMain, USER } from '../github.mjs';

const template = readFileSync(new URL('./template.svg', import.meta.url), 'utf8');
const KINDS = {
  PushEvent: ['PUSH', '#B6A6FF', p => (p.ref ?? '').replace('refs/heads/', '')],
  PullRequestEvent: ['PR', '#F6DF5A', p => `${p.action} #${p.number ?? p.pull_request?.number ?? ''}`],
  CreateEvent: ['CREATE', '#66B94A', p => [p.ref_type, p.ref].filter(Boolean).join(' ')],
  IssuesEvent: ['ISSUE', '#F08A9A', p => `${p.action} #${p.issue?.number ?? ''}`],
  IssueCommentEvent: ['COMMENT', '#F08A9A', p => `#${p.issue?.number ?? ''}`],
  PullRequestReviewEvent: ['REVIEW', '#F6DF5A', p => `#${p.pull_request?.number ?? ''}`],
  ReleaseEvent: ['RELEASE', '#5CD6F2', p => p.release?.tag_name ?? ''],
  WatchEvent: ['STAR', '#E9A04F', () => ''],
  ForkEvent: ['FORK', '#5CD6F2', () => ''],
};

export async function collectEvents(api = github()) {
  return api.rest(`/users/${USER}/events/public?per_page=50`);
}

const kst = iso => new Date(new Date(iso).getTime() + 9 * 3600e3).toISOString().slice(5, 10);
const clip = (text, max) => (text.length > max ? text.slice(0, max - 1) + '…' : text);

export function toLines(events, limit = 5) {
  const lines = [];
  for (const e of events) {
    const kind = KINDS[e.type];
    if (!kind) continue;
    const line = { date: kst(e.created_at), label: kind[0], color: kind[1], repo: e.repo?.name ?? '', detail: kind[2](e.payload ?? {}), count: 1 };
    const prev = lines.at(-1);
    if (prev && prev.date === line.date && prev.label === line.label && prev.repo === line.repo && prev.detail === line.detail) prev.count++;
    else if (lines.length < limit) lines.push(line);
    else break;
  }
  return lines;
}

export function renderActivity(lines) {
  const rows = lines.length
    ? lines.map((l, i) => {
      const y = 78 + i * 26;
      const detail = l.detail + (l.count > 1 ? ` ×${l.count}` : '');
      return `<text x="44" y="${y}" fill="#5CD6F2">${l.date}</text>`
        + `<text x="112" y="${y}" font-weight="700" fill="${l.color}">${l.label}</text>`
        + `<text x="200" y="${y}" fill="#F4F1FF">${esc(clip(l.repo, 44))}</text>`
        + `<text x="560" y="${y}" fill="#8E93C9">${esc(clip(detail, 45))}</text>`;
    }).join('')
    : '<text x="44" y="78" fill="#8E93C9">AWAITING FIRST SYNC</text>';
  return fill(template, {
    desc: lines.length ? lines.map(l => `${l.date} ${l.label} ${esc(l.repo)}`).join('; ') : 'Not initialized.',
    rows,
  });
}

if (isMain(import.meta)) {
  const lines = process.argv.includes('--init') ? [] : toLines(await collectEvents());
  await writeCard(new URL('./activity.svg', import.meta.url), renderActivity(lines));
  console.log('Activity card:', lines.length, 'lines');
}
