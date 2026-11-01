import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, renderLanguages } from './languages/update.mjs';
import { computeStreak, renderStreak } from './streak/update.mjs';
import { toLines, renderActivity } from './activity/update.mjs';

test('languages: top 5 + Other, shares sum to 1', () => {
  const items = summarize({ A: 50, B: 20, C: 10, D: 8, E: 6, F: 4, G: 2 });
  assert.deepEqual(items.map(i => i.name), ['A', 'B', 'C', 'D', 'E', 'Other']);
  assert.ok(Math.abs(items.reduce((n, i) => n + i.share, 0) - 1) < 1e-9);
  assert.match(renderLanguages(items), /Other/);
  assert.match(renderLanguages([]), /AWAITING FIRST SYNC/);
});

test('streak: active days, longest run, best day', () => {
  const day = (date, contributionCount) => ({ date, contributionCount });
  const stats = computeStreak({ total: 9, days: [day('2026-10-26', 1), day('2026-10-27', 0), day('2026-10-28', 2), day('2026-10-29', 3), day('2026-10-30', 1), day('2026-10-31', 0)] });
  assert.deepEqual(stats, { total: 9, active: 4, longest: 3, best: 3 });
  assert.match(renderStreak(stats, '2026-11-01 00:00'), /4 days/);
  assert.match(renderStreak(null, null), /AWAITING FIRST SYNC/);
});

test('activity: groups repeats, escapes names, keeps 5 lines', () => {
  const push = (t, repo) => ({ type: 'PushEvent', created_at: t, repo: { name: repo }, payload: { ref: 'refs/heads/main' } });
  const events = [push('2026-11-01T01:00:00Z', 'a/b'), push('2026-11-01T00:30:00Z', 'a/b'), { type: 'WatchEvent', created_at: '2026-10-31T00:00:00Z', repo: { name: 'x/<y>' }, payload: {} }, { type: 'UnknownEvent', created_at: '2026-10-30T00:00:00Z', repo: { name: 'z' } }];
  const lines = toLines(events);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].count, 2);
  assert.match(renderActivity(lines), /main ×2/);
  assert.match(renderActivity(lines), /x\/&lt;y&gt;/);
});
