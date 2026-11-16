import assert from 'node:assert/strict';
import test from 'node:test';
import { initialMatchScore, resizeSets } from '../src/features/match-score/model/matchScore.ts';
import { validateMatchScore } from '../src/features/match-score/model/validateMatchScore.ts';

const valid = {
  ...initialMatchScore,
  photo: '/photo.png',
  homeLogo: '/home.png',
  awayLogo: '/away.png',
};

test('a complete result is valid and missing images prevent export', () => {
  assert.deepEqual(validateMatchScore(valid), {});
  assert.deepEqual(Object.keys(validateMatchScore(initialMatchScore)), [
    'photo',
    'homeLogo',
    'awayLogo',
  ]);
});

test('both final scores accept only integers from zero to three', () => {
  for (const field of ['homeScore', 'awayScore']) {
    for (const value of ['0', '1', '2', '3'])
      assert.equal(validateMatchScore({ ...valid, [field]: value })[field], undefined);
    for (const value of ['', '-1', '4', '10', '1.5', 'abc'])
      assert.ok(validateMatchScore({ ...valid, [field]: value })[field]);
  }
});

test('three to five sets are supported and resizing preserves existing scores', () => {
  for (let count = 3; count <= 5; count++) {
    const sets = resizeSets(valid.sets, count);
    assert.equal(sets.length, count);
    assert.deepEqual(sets[0], valid.sets[0]);
    assert.equal(validateMatchScore({ ...valid, sets }).sets, undefined);
  }
  assert.equal(initialMatchScore.sets.length, 3);
  assert.equal(resizeSets(valid.sets, 10).length, 5);
  assert.ok(validateMatchScore({ ...valid, sets: valid.sets.slice(0, 2) }).sets);
  assert.equal(resizeSets(valid.sets, 0).length, 3);
  assert.ok(validateMatchScore({ ...valid, sets: [] }).sets);
  assert.ok(validateMatchScore({ ...valid, sets: Array(6).fill(valid.sets[0]) }).sets);
  assert.deepEqual(resizeSets(valid.sets, 5)[4], { home: '', away: '' });
});

test('individual set errors identify the affected team and set', () => {
  for (const value of ['', '-1', '100', '1.5', 'abc']) {
    assert.ok(validateMatchScore({ ...valid, sets: [{ home: value, away: '25' }] })['set-0-home']);
    assert.ok(validateMatchScore({ ...valid, sets: [{ home: '25', away: value }] })['set-0-away']);
  }
  assert.deepEqual(
    validateMatchScore({ ...valid, sets: [{ home: '0', away: '99' }, ...valid.sets.slice(1)] }),
    {},
  );
});
