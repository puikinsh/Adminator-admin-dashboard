/**
 * Theme Manager Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Theme from '../../src/assets/scripts/utils/theme.js';

describe('Theme Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('current()', () => {
    it('returns "light" by default when no theme is stored', () => {
      expect(Theme.current()).toBe('light');
    });

    it('returns stored theme from localStorage', () => {
      localStorage.setItem('adminator-theme', 'dark');
      expect(Theme.current()).toBe('dark');
    });

    it('returns "light" for invalid stored values', () => {
      localStorage.setItem('adminator-theme', 'invalid');
      expect(Theme.current()).toBe('light');
    });
  });

  describe('apply()', () => {
    it('sets data-theme attribute on document', () => {
      Theme.apply('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('stores theme in localStorage', () => {
      Theme.apply('dark');
      expect(localStorage.getItem('adminator-theme')).toBe('dark');
    });

    it('dispatches adminator:themeChanged event', () => {
      const handler = vi.fn();
      window.addEventListener('adminator:themeChanged', handler);

      Theme.apply('dark');

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.theme).toBe('dark');

      window.removeEventListener('adminator:themeChanged', handler);
    });

    it('falls back to "light" for invalid theme values', () => {
      Theme.apply('invalid');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('returns true on success', () => {
      expect(Theme.apply('dark')).toBe(true);
    });
  });

  describe('toggle()', () => {
    it('toggles from light to dark', () => {
      Theme.apply('light');
      const result = Theme.toggle();
      expect(result).toBe('dark');
      expect(Theme.current()).toBe('dark');
    });

    it('toggles from dark to light', () => {
      Theme.apply('dark');
      const result = Theme.toggle();
      expect(result).toBe('light');
      expect(Theme.current()).toBe('light');
    });
  });

  describe('init()', () => {
    it('uses stored preference if available', () => {
      localStorage.setItem('adminator-theme', 'dark');
      Theme.init();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('returns the applied theme', () => {
      localStorage.setItem('adminator-theme', 'dark');
      expect(Theme.init()).toBe('dark');
    });
  });

  describe('isDark() / isLight()', () => {
    it('isDark returns true when theme is dark', () => {
      Theme.apply('dark');
      expect(Theme.isDark()).toBe(true);
      expect(Theme.isLight()).toBe(false);
    });

    it('isLight returns true when theme is light', () => {
      Theme.apply('light');
      expect(Theme.isLight()).toBe(true);
      expect(Theme.isDark()).toBe(false);
    });
  });

  describe('getChartColors()', () => {
    it('returns dark colors when theme is dark', () => {
      Theme.apply('dark');
      const colors = Theme.getChartColors();
      expect(colors.textColor).toBe('#FFFFFF');
    });

    it('returns light colors when theme is light', () => {
      Theme.apply('light');
      const colors = Theme.getChartColors();
      expect(colors.textColor).toBe('#212529');
    });
  });
});
