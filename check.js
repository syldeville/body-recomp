// Run: node check.js — sanity-checks the PR/progression logic inside index.html.
const assert = require('assert');
const html = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const src = html.slice(html.indexOf('// LOGIC START'), html.indexOf('// LOGIC END'));
const { PROGRAM, ex, lastSets, bestSet, advice, nextDay, newPRs, validLog } =
  new Function(src + '; return { PROGRAM, ex, lastSets, bestSet, advice, nextDay, newPRs, validLog };')();

const log = [
  { date: '2026-10-01', day: 'A', sets: { squat: [[40, 10], [40, 9]] } },
  { date: '2026-10-03', day: 'B', sets: { rdl: [[30, 10]] } },
  { date: '2026-10-05', day: 'C', sets: { squat: [[42.5, 6], [40, 12]] } },
];
assert.deepStrictEqual(lastSets(log, 'squat'), [[42.5, 6], [40, 12]]);
assert.strictEqual(lastSets(log, 'plank'), null);
assert.deepStrictEqual(bestSet(log, 'squat'), [42.5, 6]);
assert.deepStrictEqual(bestSet([{ sets: { x: [[40, 8], [40, 10]] } }], 'x'), [40, 10]);
assert.strictEqual(nextDay([]), 'A');
assert.strictEqual(nextDay(log), 'A');
const squat = ex(PROGRAM.A.ex[0]);
assert.match(advice(squat, [[40, 10], [40, 10], [40, 10]]), /Go up/);
assert.match(advice(squat, [[40, 10], [40, 9], [40, 10]]), /Same weight/);
assert.match(advice(squat, null), /First time/);
assert.deepStrictEqual(newPRs(log, { sets: { squat: [[42.5, 7]], rdl: [[25, 12]], plank: [[0, 40]] } }), [['squat', [42.5, 7]]]);
assert.ok(validLog(log));
assert.ok(!validLog([{ date: 'x', day: 'Z', sets: {} }]));
assert.ok(!validLog({}));
console.log('ok');
