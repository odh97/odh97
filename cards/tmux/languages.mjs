// 공개 원본 저장소(fork 제외)의 언어별 코드 양(bytes) 합산 → 상위 5 + Other
import { github, USER } from '../github.mjs';

export const LANG_COLORS = ['#B6A6FF', '#5CD6F2', '#F6DF5A', '#E9A04F', '#F08A9A'];
export const OTHER_COLOR = '#4E4A9E';

export async function collectLanguages(api = github()) {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await api.rest(`/users/${USER}/repos?type=owner&per_page=100&page=${page}`);
    repos.push(...batch.filter(r => !r.private && !r.fork));
    if (batch.length < 100) break;
  }
  const totals = {};
  for (const repo of repos) {
    for (const [name, bytes] of Object.entries(await api.rest(`/repos/${repo.full_name}/languages`))) totals[name] = (totals[name] ?? 0) + bytes;
  }
  return totals;
}

export function summarize(totals) {
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = sorted.reduce((n, [, b]) => n + b, 0);
  if (!sum) return [];
  const top = sorted.slice(0, 5).map(([name, bytes], i) => ({ name, share: bytes / sum, color: LANG_COLORS[i] }));
  const rest = sorted.slice(5).reduce((n, [, b]) => n + b, 0);
  if (rest) top.push({ name: 'Other', share: rest / sum, color: OTHER_COLOR });
  return top;
}
