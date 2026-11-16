import assert from 'node:assert/strict';
import test from 'node:test';
import { getCoverCrop } from '../src/shared/lib/canvas.ts';

test('a portrait photo fills a wide frame without stretching', () => {
  const crop = getCoverCrop(1000, 2000, 1000, 500);
  assert.deepEqual(crop, { x: 0, y: 750, width: 1000, height: 500 });
  assert.equal(getCoverCrop(1000, 2000, 1000, 500, 50, 0).y, 0);
  assert.equal(getCoverCrop(1000, 2000, 1000, 500, 50, 100).y, 1500);
});

test('a landscape photo can be aligned at either edge of a square frame', () => {
  assert.deepEqual(getCoverCrop(4000, 2000, 1000, 1000, 0), {
    x: 0,
    y: 0,
    width: 2000,
    height: 2000,
  });
  assert.equal(getCoverCrop(4000, 2000, 1000, 1000, 100).x, 2000);
});

test('a photo matching the frame ratio keeps the full source area', () => {
  assert.deepEqual(getCoverCrop(2972, 2040, 1486, 1020), { x: 0, y: 0, width: 2972, height: 2040 });
});
