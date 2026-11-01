import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './languages.mjs';
import { computeStreak } from './streak.mjs';
import { toLines } from './activity.mjs';
import { renderTmux } from './update.mjs';

test('languages: top 5 + Other, shares sum to 1', () => {
  const items = summarize({ A: 50, B: 20, C: 10, D: 8, E: 6, F: 4, G: 2 });
  assert.deepEqual(items.map(i => i.name), ['A', 'B', 'C', 'D', 'E', 'Other']);
  assert.ok(Math.abs(items.reduce((n, i) => n + i.share, 0) - 1) < 1e-9);
});

test('streak: active days, longest run, best day', () => {
  const day = (date, contributionCount) => ({ date, contributionCount });
  const stats = computeStreak({ total: 9, days: [day('2026-10-26', 1), day('2026-10-27', 0), day('2026-10-28', 2), day('2026-10-29', 3), day('2026-10-30', 1), day('2026-10-31', 0)] });
  assert.deepEqual(stats, { total: 9, active: 4, longest: 3, best: 3 });
});

test('activity: groups repeats, keeps known kinds only', () => {
  const push = (t, repo) => ({ type: 'PushEvent', created_at: t, repo: { name: repo }, payload: { ref: 'refs/heads/main' } });
  const lines = toLines([push('2026-11-01T01:00:00Z', 'a/b'), push('2026-11-01T00:30:00Z', 'a/b'), { type: 'WatchEvent', created_at: '2026-10-31T00:00:00Z', repo: { name: 'x/<y>' }, payload: {} }, { type: 'UnknownEvent', created_at: '2026-10-30T00:00:00Z', repo: { name: 'z' } }]);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].count, 2);
});

test('render: fills every pane, escapes names, shows placeholders when empty', () => {
  const svg = renderTmux({
    languages: summarize({ JavaScript: 3, CSS: 1 }),
    streak: { total: 2571, active: 242, longest: 19, best: 42 },
    activity: toLines([{ type: 'WatchEvent', created_at: '2026-10-31T00:00:00Z', repo: { name: 'x/<y>' }, payload: {} }]),
  });
  assert.match(svg, /JavaScript/);
  assert.match(svg, />2571</);
  assert.match(svg, />19d</);
  assert.match(svg, /x\/&lt;y&gt;/);
  assert.equal((renderTmux({}).match(/AWAITING FIRST SYNC/g) || []).length, 2);
  assert.equal((renderTmux({}).match(/>--</g) || []).length, 4);
});
