import assert from 'node:assert/strict';
import { readdir, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startPreview } from './preview.mjs';

const pages = (await readdir(new URL('../src/', import.meta.url))).filter(f => f.endsWith('.html'));
assert(pages.length > 0, 'Expected page templates in src/');
const server = await startPreview(0);
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
let count = 0;
try {
  assert.equal((await fetch(`${base}/missing.html`)).status, 404);
  assert.equal((await fetch(`${base}/%2e%2e%2fpackage.json`)).status, 403);
  assert.equal((await fetch(`${base}/%zz`)).status, 400);
  browser = await chromium.launch();
  for (const width of [1440, 390]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
      // Keep CI deterministic: exercise local assets, not third-party fonts/maps.
      await context.route('**/*', route => {
        if (new URL(route.request().url()).origin === base) return route.continue();
        return route.abort();
      });
      for (const file of pages) {
        const page = await context.newPage();
        const errors = [];
        const vendors = new Set();
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
          if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        page.on('requestfailed', request => {
          if (request.url().startsWith(base)) errors.push(`Failed request: ${request.url()}`);
        });
        page.on('request', request => {
          const vendor = request.url().match(/vendor-(chartjs|fullcalendar|jsvectormap).*\.js/);
          if (vendor) vendors.add(vendor[1]);
        });
        try {
          assert.equal((await page.goto(`${base}/${file}`)).status(), 200);
          const hasShell = await page.locator('[data-shell-sidebar]').count();
          if (hasShell) await page.locator('.d-sidebar').waitFor({ state: 'attached' });
          assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
          const expected = [];
          if (await page.locator('canvas[data-chart-key]').count()) {
            expected.push('chartjs');
            await page.waitForFunction(() => [...document.querySelectorAll('canvas[data-chart-key]')].every(canvas => {
              const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
              return pixels.some((value, index) => index % 4 === 3 && value > 0);
            }));
          }
          if (await page.locator('[data-vmap]').count()) {
            expected.push('jsvectormap');
            await page.locator('[data-vmap] svg path').first().waitFor({ state: 'attached' });
          }
          if (await page.locator('[data-fc]').count()) {
            expected.push('fullcalendar');
            await page.locator('.fc-dow').first().waitFor({ state: 'attached' });
            for (const view of ['Week', 'Day', 'Agenda', 'Month']) {
              await page.locator('.cal-view-tab', { hasText: view }).click();
              assert.equal(await page.locator('.cal-view-tab.is-active').textContent(), view);
            }
          }
          if (hasShell) {
            if (width === 390) {
              await page.locator('[data-drawer-open]').click();
              await page.locator('.drawer-backdrop').click({ position: { x: 380, y: 100 } });
              assert.equal(await page.locator('body').evaluate(el => el.classList.contains('has-drawer-open')), false);
            }
            await page.locator('[data-palette-open]').click();
            await page.locator('.palette-input').fill('toggle theme');
            await page.locator('.palette-result').click();
            assert.equal(await page.locator('html').getAttribute('data-theme'), theme === 'light' ? 'dark' : 'light');
            await page.locator('#themeToggle').click();
            assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
          }
          assert.deepEqual([...vendors].sort(), expected.sort(), 'Only required widget libraries should load');
          assert.deepEqual(errors, [], 'No runtime errors or failed local assets');
          count++;
        } catch (error) {
          await mkdir(new URL('../test-results/', import.meta.url), { recursive: true });
          await page.screenshot({ path: `test-results/${file}-${width}-${theme}.png`, fullPage: true });
          throw new Error(`${file} (${width}px, ${theme}): ${error.message}`, { cause: error });
        } finally {
          await page.close();
        }
      }
      await context.close();
      console.log(`Passed ${width}px ${theme}: ${pages.length} pages`);
    }
  }
  console.log(`Browser checks passed: ${count} page/theme/viewport combinations.`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
