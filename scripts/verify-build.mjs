import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const pages = (await readdir(new URL('../src/', import.meta.url))).filter(file => file.endsWith('.html'));
const initial = new Set();
assert(pages.length > 0, 'Expected page templates in src/');
for (const page of pages) {
  const dom = new JSDOM(await readFile(resolve(root, page), 'utf8'));
  try {
    const assets = [...dom.window.document.querySelectorAll('script[src], link[rel="stylesheet"][href], img[src]')];
    for (const element of assets) {
      const reference = element.getAttribute('src') || element.getAttribute('href');
      if (/^(?:https?:|data:|\/\/)/.test(reference)) continue;
      const file = resolve(root, reference.split(/[?#]/)[0]);
      assert(file.startsWith(root + sep), `${page}: asset escapes dist/: ${reference}`);
      assert((await stat(file)).isFile(), `${page}: missing asset ${reference}`);
      if (element.tagName !== 'IMG') initial.add(file);
    }
  } finally {
    dom.window.close();
  }
}
let raw = 0;
let gzip = 0;
for (const file of initial) {
  const data = await readFile(file);
  raw += data.length;
  gzip += gzipSync(data).length;
}
if (process.argv.includes('--budget')) {
  assert(raw <= 140 * 1024, `Initial assets exceed 140 KiB: ${raw} bytes`);
  assert(gzip <= 35 * 1024, `Initial gzip assets exceed 35 KiB: ${gzip} bytes`);
}
console.log(`Verified ${pages.length} pages and local asset references; initial JS/CSS: ${(raw / 1024).toFixed(1)} KiB (${(gzip / 1024).toFixed(1)} KiB gzip).`);
