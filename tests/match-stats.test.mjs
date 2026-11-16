import assert from 'node:assert/strict';
import test from 'node:test';
import {
  initialMatchStats,
  getStatsLayout,
  normalizeStatInput,
  formatStatValue,
} from '../src/features/match-stats/model/matchStats.ts';

test('numeric entry drops leading zeros and preserves fractional values', () => {
  assert.equal(normalizeStatInput('025'), '25');
  assert.equal(normalizeStatInput('0005'), '5');
  assert.equal(normalizeStatInput('0'), '0');
  assert.equal(normalizeStatInput('0,5'), '0,5');
  assert.equal(normalizeStatInput('0.5'), '0.5');
  assert.equal(normalizeStatInput(''), '');
});

test('only reception and attack include a percent sign', () => {
  assert.equal(formatStatValue('reception', '52,5'), '52,5%');
  assert.equal(formatStatValue('attack', '0'), '0%');
  for (const id of ['points', 'blocks', 'aces']) assert.equal(formatStatValue(id, '5'), '5');
});
import { validateMatchStats } from '../src/features/match-stats/model/validateMatchStats.ts';

const valid = {
  ...initialMatchStats,
  homeLogo: '/home.png',
  awayLogo: '/away.png',
  photo: '/player.png',
  firstName: 'Анна',
  lastName: 'Иванова',
  playerPoints: '24',
};

test('a complete statistics card is valid', () => {
  assert.deepEqual(validateMatchStats(valid), {});
});

test('player fields are required only while the best player is shown', () => {
  const draft = { ...valid, photo: null, firstName: '', lastName: '', playerPoints: '' };
  const errors = validateMatchStats(draft);
  for (const field of ['photo', 'firstName', 'lastName', 'playerPoints']) assert.ok(errors[field]);
  assert.deepEqual(validateMatchStats({ ...draft, showPlayer: false }), {});
});

test('hiding the player expands evenly spaced statistics into the available area', () => {
  const withPlayer = getStatsLayout(true);
  const withoutPlayer = getStatsLayout(false);
  assert.equal(withPlayer.top, withoutPlayer.top);
  assert.ok(withoutPlayer.bottom > withPlayer.bottom);
  assert.ok(withoutPlayer.rowHeight > withPlayer.rowHeight);
  assert.equal(withoutPlayer.top + withoutPlayer.rowHeight * 5, withoutPlayer.bottom);
  assert.equal(valid.firstName, 'Анна');
});

test('both teams accept decimal statistics and reject invalid numbers', () => {
  for (const side of ['home', 'away']) {
    for (const value of ['0', '100', '52.5', '67,25']) {
      const stats = { ...valid.stats, reception: { ...valid.stats.reception, [side]: value } };
      assert.deepEqual(validateMatchStats({ ...valid, stats }), {});
    }
    for (const value of ['', '-1', '1000', '2..5', 'abc']) {
      const stats = { ...valid.stats, attack: { ...valid.stats.attack, [side]: value } };
      assert.ok(validateMatchStats({ ...valid, stats })[`attack-${side}`]);
    }
  }
});

test('final scores and player points enforce their limits', () => {
  for (const field of ['homeScore', 'awayScore']) {
    for (const value of ['0', '1', '2', '3'])
      assert.equal(validateMatchStats({ ...valid, [field]: value })[field], undefined);
    for (const value of ['', '4', '-1'])
      assert.ok(validateMatchStats({ ...valid, [field]: value })[field]);
  }
  for (const playerPoints of ['', '-1', '1000', '2.5'])
    assert.ok(validateMatchStats({ ...valid, playerPoints }).playerPoints);
});
