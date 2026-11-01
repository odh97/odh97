// GraphQL contributionCalendar(프로필 잔디와 같은 데이터) → 1년 기여 수 · 활동한 날 · 최장 연속 · 하루 최다
// 현재 연속 기여는 쉬면 0이 되어 부담이라 쓰지 않습니다. GraphQL이라 토큰이 필요합니다.
import { github, USER } from '../github.mjs';

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

export function computeStreak({ total, days }) {
  const counts = [...days].sort((a, b) => a.date.localeCompare(b.date)).map(d => d.contributionCount);
  const active = counts.filter(c => c > 0).length;
  let longest = 0, run = 0;
  for (const c of counts) { run = c > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  return { total, active, longest, best: Math.max(0, ...counts) };
}
