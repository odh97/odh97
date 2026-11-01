// 데이터 수집 + template.svg 채우기. 디자인은 template.svg에서 수정하세요.
import { readFileSync } from 'node:fs';
import { writeFile, rename } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const template = readFileSync(new URL('./template.svg', import.meta.url), 'utf8');

export async function collectStats(request = fetch, token = process.env.GITHUB_TOKEN) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'odh97-profile' };
  if (token) headers.Authorization = 'Bearer ' + token;
  async function get(endpoint) {
    const res = await request('https://api.github.com' + endpoint, { headers, signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error('GitHub API returned HTTP ' + res.status);
    return res.json();
  }
  const user = await get('/users/odh97');
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await get('/users/odh97/repos?type=owner&per_page=100&page=' + page);
    if (!Array.isArray(batch)) throw new Error('Unexpected repository response');
    repos.push(...batch.filter(r => !r.private));
    if (batch.length < 100) break;
  }
  const originals = repos.filter(r => !r.fork);
  return { repos: repos.length, stars: originals.reduce((n, r) => n + r.stargazers_count, 0), followers: user.followers, forks: originals.reduce((n, r) => n + r.forks_count, 0) };
}

export function renderStats(data, time) {
  const labels = { repos: 'PUBLIC REPOS', stars: 'STARS', followers: 'FOLLOWERS', forks: 'FORKS' };
  const vars = {
    desc: data ? Object.entries(labels).map(([k, label]) => label + ': ' + data[k]).join(', ') : 'Not initialized. Run the Update profile stats workflow.',
    footer: time ? 'UPDATED ' + time + ' / UTC' : 'AWAITING FIRST SYNC / RUN GITHUB ACTIONS',
  };
  for (const k of Object.keys(labels)) vars[k] = data?.[k] ?? '--';
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k]));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const initial = process.argv.includes('--init');
  const data = initial ? null : await collectStats();
  const time = initial ? null : new Date().toISOString().slice(0, 16).replace('T', ' ');
  const output = new URL('./stats.svg', import.meta.url);
  const temporary = new URL('./stats.svg.tmp', import.meta.url);
  await writeFile(temporary, renderStats(data, time), 'utf8');
  await rename(temporary, output);
  console.log(initial ? 'Initial card created; no fabricated values.' : 'Public statistics updated.');
}
