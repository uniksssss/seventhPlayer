import assert from 'node:assert/strict';
import test from 'node:test';
import { initialBirthday } from '../src/features/birthday/model/birthday.ts';
import { validateBirthday } from '../src/features/birthday/model/validateBirthday.ts';

const valid = {
  ...initialBirthday,
  photo: '/photo.png',
  firstName: 'Анна',
  lastName: 'Иванова',
  playerNumber: '7',
};

test('birthday requires a first and last name', () => {
  assert.deepEqual(Object.keys(validateBirthday(initialBirthday)), [
    'photo',
    'firstName',
    'lastName',
  ]);
  assert.deepEqual(validateBirthday(valid), {});
  assert.ok(validateBirthday({ ...valid, firstName: '  ' }).firstName);
  assert.ok(validateBirthday({ ...valid, lastName: '  ' }).lastName);
});

test('birthday supports compound and long names within field limits', () => {
  assert.deepEqual(
    validateBirthday({ ...valid, firstName: 'Анна-Мария', lastName: 'Ван дер Меер' }),
    {},
  );
  assert.equal(validateBirthday({ ...valid, lastName: 'Я'.repeat(40) }).lastName, undefined);
  assert.ok(validateBirthday({ ...valid, firstName: 'Я'.repeat(41) }).firstName);
  assert.ok(validateBirthday({ ...valid, lastName: 'Я'.repeat(41) }).lastName);
});

test('birthday jersey numbers accept zero and one or two digits', () => {
  for (const playerNumber of ['0', '1', '9', '10', '99']) {
    assert.equal(validateBirthday({ ...valid, playerNumber }).playerNumber, undefined);
  }
  for (const playerNumber of ['', '100', '-1', '1.5', 'abc']) {
    assert.ok(validateBirthday({ ...valid, playerNumber }).playerNumber);
  }
});

test('birthday requires a photograph before export', () => {
  assert.ok(validateBirthday({ ...valid, photo: null }).photo);
  assert.equal(validateBirthday(valid).photo, undefined);
});
