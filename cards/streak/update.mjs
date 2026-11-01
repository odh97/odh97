// GraphQL contributionCalendar(프로필 잔디와 같은 데이터)로 연속 기여 기록을 계산해 streak.svg를 만듭니다. 디자인은 template.svg.
// 토큰이 필요합니다(Actions의 GITHUB_TOKEN). 로컬에서 토큰 없이 확인하려면 --init.
import { readFileSync } from 'node:fs';
import { github, fill, writeCard, isMain, nowUtc, USER } from '../github.mjs';

const template = readFileSync(new URL('./template.svg', import.meta.url), 'utf8');

export async function collectCalendar(api = github()) {
  const data = await api.graphql(`query ($login: String!) {
    user(login: $login) { contributionsCollection { contributionCalendar {
      totalContributions weeks { contributionDays { date contributionCount } }
    } } }
  }`, { login: USER });
  const calendar = data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error('Contribution calendar missing');
  return { total: calendar.totalContributions, days: calendar.weeks.flatMap(w => w.contributionDays) };
}

// 오늘 아직 기여가 없으면 어제부터 셉니다.
export function computeStreak({ total, days }) {
  const counts = [...days].sort((a, b) => a.date.localeCompare(b.date)).map(d => d.contributionCount);
  let end = counts.length - 1;
  if (end >= 0 && counts[end] === 0) end--;
  let current = 0;
  for (let i = end; i >= 0 && counts[i] > 0; i--) current++;
  let longest = 0, run = 0;
  for (const c of counts) { run = c > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  return { total, current, longest, best: Math.max(0, ...counts) };
}

const days = n => `${n} day${n === 1 ? '' : 's'}`;

export function renderStreak(stats, time) {
  return fill(template, {
    desc: stats ? `Contributions in the last year: ${stats.total}. Current streak: ${days(stats.current)}. Longest streak: ${days(stats.longest)}. Best day: ${stats.best}.` : 'Not initialized.',
    total: stats?.total ?? '--',
    current: stats ? days(stats.current) : '--',
    longest: stats ? days(stats.longest) : '--',
    best: stats?.best ?? '--',
    footer: time ? `UPDATED ${time} / UTC` : 'AWAITING FIRST SYNC / RUN GITHUB ACTIONS',
  });
}

if (isMain(import.meta)) {
  const init = process.argv.includes('--init');
  const stats = init ? null : computeStreak(await collectCalendar());
  await writeCard(new URL('./streak.svg', import.meta.url), renderStreak(stats, init ? null : nowUtc()));
  console.log('Streak card:', stats ? JSON.stringify(stats) : 'initial');
}
