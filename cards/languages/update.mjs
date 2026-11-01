// 공개 원본 저장소(fork 제외)의 언어별 코드 양(bytes)을 합산해 languages.svg를 만듭니다. 디자인은 template.svg.
import { readFileSync } from 'node:fs';
import { github, esc, fill, writeCard, isMain, USER } from '../github.mjs';

const template = readFileSync(new URL('./template.svg', import.meta.url), 'utf8');
const COLORS = ['#B6A6FF', '#5CD6F2', '#F6DF5A', '#E9A04F', '#F08A9A'];
const OTHER = '#4E4A9E';

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

// 상위 5개 + 나머지(Other)를 퍼센트로
export function summarize(totals) {
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = sorted.reduce((n, [, b]) => n + b, 0);
  if (!sum) return [];
  const top = sorted.slice(0, 5).map(([name, bytes], i) => ({ name, share: bytes / sum, color: COLORS[i] }));
  const rest = sorted.slice(5).reduce((n, [, b]) => n + b, 0);
  if (rest) top.push({ name: 'Other', share: rest / sum, color: OTHER });
  return top;
}

export function renderLanguages(items) {
  let x = 44;
  const bar = items.length
    ? items.map((item, i) => {
      const width = i === items.length - 1 ? 916 - x : Math.round(item.share * 872);
      const rect = `<rect x="${x}" y="62" width="${Math.max(width, 0)}" height="16" fill="${item.color}"/>`;
      x += width;
      return rect;
    }).join('')
    : '<rect x="44" y="62" width="872" height="16" fill="#222A5E"/>';
  const list = items.length
    ? items.map((item, i) => {
      const cx = 44 + (i % 3) * 296, cy = 112 + Math.floor(i / 3) * 30;
      return `<rect x="${cx}" y="${cy - 10}" width="10" height="10" fill="${item.color}" shape-rendering="crispEdges"/>`
        + `<text x="${cx + 18}" y="${cy}" fill="#F4F1FF">${esc(item.name)}</text>`
        + `<text x="${cx + 260}" y="${cy}" text-anchor="end" fill="#8E93C9">${(item.share * 100).toFixed(1)}%</text>`;
    }).join('')
    : '<text x="44" y="112" fill="#8E93C9">AWAITING FIRST SYNC</text>';
  return fill(template, {
    desc: items.length ? items.map(i => `${esc(i.name)} ${(i.share * 100).toFixed(1)}%`).join(', ') : 'Not initialized.',
    bar, items: list,
  });
}

if (isMain(import.meta)) {
  const items = process.argv.includes('--init') ? [] : summarize(await collectLanguages());
  await writeCard(new URL('./languages.svg', import.meta.url), renderLanguages(items));
  console.log('Languages card:', items.map(i => i.name).join(', ') || 'initial');
}
