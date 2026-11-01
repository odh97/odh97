// 공개 이벤트 최근 5줄. 같은 날·같은 저장소·같은 종류는 한 줄로 묶어 count로 셉니다. 비공개 저장소 활동은 나오지 않습니다.
import { github, USER } from '../github.mjs';

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
