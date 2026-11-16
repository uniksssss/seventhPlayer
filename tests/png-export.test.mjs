import assert from 'node:assert/strict';
import test from 'node:test';
import { downloadCanvasPng, PNG_EXPORT_EVENT } from '../src/shared/lib/images.ts';

function browser(t, touch) {
  const events = [];
  const links = [];
  const revoked = [];
  const anchor = {
    click() {
      assert.equal(this.attached, true);
      links.push({ href: this.href, download: this.download, target: this.target, rel: this.rel });
    },
    remove() {
      this.attached = false;
    },
  };
  const replacements = {
    navigator: { maxTouchPoints: touch ? 5 : 0 },
    window: {
      matchMedia: () => ({ matches: false }),
      dispatchEvent: (event) => events.push(event),
      setTimeout: (callback) => callback(),
    },
    document: {
      createElement: () => anchor,
      body: {
        append: (element) => {
          element.attached = true;
        },
      },
    },
  };
  for (const [key, value] of Object.entries(replacements)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    });
  }
  t.mock.method(URL, 'createObjectURL', () => 'blob:test-png');
  t.mock.method(URL, 'revokeObjectURL', (url) => revoked.push(url));
  return { events, links, revoked };
}

function canvas(result = new Blob(['PNG'], { type: 'image/png' })) {
  return { width: 2160, height: 2160, toBlob: (callback) => callback(result) };
}

test('iOS export prepares a named file without navigating away from the editor', async (t) => {
  const { events, links } = browser(t, true);
  const image = canvas();
  await downloadCanvasPng(image, 'матч.png');
  assert.equal(links.length, 0);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, PNG_EXPORT_EVENT);
  assert.equal(events[0].detail.name, 'матч.png');
  assert.equal(events[0].detail.type, 'image/png');
  assert.equal(await events[0].detail.text(), 'PNG');
  assert.equal(image.width, 0);
  assert.equal(image.height, 0);
});

test('desktop download has a filename and opens any browser fallback in a separate tab', async (t) => {
  const { events, links, revoked } = browser(t, false);
  await downloadCanvasPng(canvas(), 'poster.png');
  assert.equal(events.length, 0);
  assert.deepEqual(links, [
    { href: 'blob:test-png', download: 'poster.png', target: '_blank', rel: 'noopener' },
  ]);
  assert.deepEqual(revoked, ['blob:test-png']);
});

test('PNG conversion failure frees its canvas and does not start a download', async (t) => {
  const { events, links } = browser(t, true);
  const image = canvas(null);
  await assert.rejects(downloadCanvasPng(image, 'poster.png'), /Не удалось сохранить PNG/);
  assert.equal(image.width, 0);
  assert.equal(image.height, 0);
  assert.equal(events.length, 0);
  assert.equal(links.length, 0);
});
