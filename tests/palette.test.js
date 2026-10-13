import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initPalette, open, close, isOpen } from '../src/assets/scripts/2026/palette.js';
import { initShellBehaviors } from '../src/assets/scripts/2026/init.js';

describe('palette.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button class="cmd" data-palette-open>Search</button>
      <input id="someField" type="text">
    `;
    initPalette();
  });

  afterEach(() => {
    close();
    // Clean leftover palette DOM
    document.querySelectorAll('.palette-backdrop').forEach((n) => n.remove());
    document.body.classList.remove('has-palette-open');
  });

  describe('open()', () => {
    it('mounts the palette DOM lazily on first open', () => {
      expect(document.querySelector('.palette-backdrop')).toBeFalsy();
      open();
      expect(document.querySelector('.palette-backdrop')).toBeTruthy();
      expect(document.querySelector('.palette-input')).toBeTruthy();
    });

    it('adds has-palette-open to body', () => {
      open();
      expect(document.body.classList.contains('has-palette-open')).toBe(true);
    });

    it('seeds the results list with NAV items', () => {
      open();
      const results = document.querySelectorAll('.palette-result');
      // Should have at least the major pages (dashboard, email, calendar, charts, etc.)
      expect(results.length).toBeGreaterThan(5);
    });
  });

  describe('close()', () => {
    it('removes has-palette-open from body', () => {
      open();
      close();
      expect(document.body.classList.contains('has-palette-open')).toBe(false);
    });
  });

  describe('isOpen()', () => {
    it('returns true after open()', () => {
      open();
      expect(isOpen()).toBe(true);
    });
    it('returns false after close()', () => {
      open();
      close();
      expect(isOpen()).toBe(false);
    });
  });

  describe('triggers', () => {
    it('opens on click of [data-palette-open]', () => {
      document.querySelector('[data-palette-open]').click();
      expect(isOpen()).toBe(true);
    });

    it('opens on Cmd+K', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      expect(isOpen()).toBe(true);
    });

    it('opens on Ctrl+K', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      expect(isOpen()).toBe(true);
    });

    it('Cmd+K toggles closed when already open', () => {
      open();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      expect(isOpen()).toBe(false);
    });

    it('opens on "/" when no input is focused', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
      expect(isOpen()).toBe(true);
    });

    it('does NOT open on "/" when an input is focused', () => {
      document.getElementById('someField').focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
      expect(isOpen()).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    it('Esc closes', () => {
      open();
      const input = document.querySelector('.palette-input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(isOpen()).toBe(false);
    });

    it('Arrow Down moves cursor down (changes is-selected)', () => {
      open();
      const input = document.querySelector('.palette-input');
      const before = document.querySelector('.palette-result.is-selected');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      const after = document.querySelector('.palette-result.is-selected');
      expect(after).toBeTruthy();
      expect(after).not.toBe(before);
    });

    it('Arrow Up cannot move past index 0', () => {
      open();
      const input = document.querySelector('.palette-input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      const sel = document.querySelector('.palette-result.is-selected');
      // First result is still selected
      expect(sel.getAttribute('data-index')).toBe('0');
    });
  });

  describe('filtering', () => {
    it('narrows results when the user types', () => {
      open();
      const input = document.querySelector('.palette-input');
      const before = document.querySelectorAll('.palette-result').length;
      input.value = 'email';
      input.dispatchEvent(new Event('input'));
      const after = document.querySelectorAll('.palette-result').length;
      expect(after).toBeLessThan(before);
      // Email page should be in the results
      const text = document.querySelector('.palette-results').textContent.toLowerCase();
      expect(text).toContain('email');
    });

    it('shows "No results" when nothing matches', () => {
      open();
      const input = document.querySelector('.palette-input');
      input.value = 'zzzzznotinthemenu';
      input.dispatchEvent(new Event('input'));
      expect(document.querySelector('.palette-empty')).toBeTruthy();
    });

    it('case-insensitive matching', () => {
      open();
      const input = document.querySelector('.palette-input');
      input.value = 'EMAIL';
      input.dispatchEvent(new Event('input'));
      expect(document.querySelectorAll('.palette-result').length).toBeGreaterThan(0);
    });
  });

  describe('actions', () => {
    it('toggles exactly once when the shell theme button is present', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.insertAdjacentHTML('beforeend', '<button id="themeToggle"></button>');
      initShellBehaviors();
      open();
      const input = document.querySelector('.palette-input');
      input.value = 'toggle theme';
      input.dispatchEvent(new Event('input'));
      document.querySelector('.palette-result').click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('dash26-theme')).toBe('dark');
      expect(document.getElementById('themeToggle').innerHTML).toContain('circle cx="12"');
    });

    it('clicking a result with an external link opens window', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
      open();
      // Find the GitHub action result by typing "github"
      const input = document.querySelector('.palette-input');
      input.value = 'github';
      input.dispatchEvent(new Event('input'));
      const githubRow = document.querySelector('.palette-result');
      githubRow.click();
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('github.com'), '_blank', 'noopener');
      spy.mockRestore();
    });

    it('clicking the toggle-theme action flips data-theme', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      open();
      const input = document.querySelector('.palette-input');
      input.value = 'toggle theme';
      input.dispatchEvent(new Event('input'));
      const themeRow = document.querySelector('.palette-result');
      themeRow.click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
