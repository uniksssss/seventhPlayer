import assert from 'node:assert/strict';
import test from 'node:test';
import { initialMatchDay } from '../src/features/match-day/model/matchDay.ts';
import { validateMatchDay } from '../src/features/match-day/model/validateMatchDay.ts';
import { getFieldErrorProps } from '../src/shared/lib/form.ts';
import { readImage } from '../src/shared/lib/images.ts';

const valid = {
  ...initialMatchDay,
  photo: '/photo.png',
  homeLogo: '/home.png',
  awayLogo: '/away.png',
};

test('a complete match is valid; the initial draft requires three images', () => {
  assert.deepEqual(validateMatchDay(valid), {});
  assert.deepEqual(Object.keys(validateMatchDay(initialMatchDay)), [
    'photo',
    'homeLogo',
    'awayLogo',
  ]);
});

test('rounds accept one or two digits from 1 to 99', () => {
  for (const round of ['1', '9', '10', '99'])
    assert.equal(validateMatchDay({ ...valid, round }).round, undefined);
  for (const round of ['', '0', '00', '100', '-1', 'abc'])
    assert.ok(validateMatchDay({ ...valid, round }).round);
});

test('dates reject nonexistent days and support leap years', () => {
  assert.equal(validateMatchDay({ ...valid, date: '2024-02-29' }).date, undefined);
  for (const date of ['', '2026-02-29', '2026-04-31', '2026-13-01', '0000-01-01'])
    assert.ok(validateMatchDay({ ...valid, date }).date);
});

test('time boundaries and blank venue are validated', () => {
  for (const time of ['00:00', '23:59'])
    assert.equal(validateMatchDay({ ...valid, time }).time, undefined);
  for (const time of ['', '24:00', '12:60', '9:30'])
    assert.ok(validateMatchDay({ ...valid, time }).time);
  assert.ok(validateMatchDay({ ...valid, venue: '   ' }).venue);
  assert.ok(validateMatchDay({ ...valid, venue: 'a'.repeat(81) }).venue);
});

test('field accessibility follows the presence of an error', () => {
  assert.deepEqual(getFieldErrorProps('photo'), {
    'aria-invalid': false,
    'aria-describedby': undefined,
  });
  assert.deepEqual(getFieldErrorProps('photo', 'Добавьте фото'), {
    'aria-invalid': true,
    'aria-describedby': 'photo-error',
  });
});

test('image IO rejects unsupported formats and oversized files before reading', async () => {
  await assert.rejects(readImage({ type: 'image/svg+xml', size: 100 }), /PNG, JPG или WebP/);
  await assert.rejects(readImage({ type: 'image/png', size: 21 * 1024 * 1024 }), /20 МБ/);
});
