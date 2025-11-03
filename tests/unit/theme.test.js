/**
 * Theme Utility Tests
 * Tests for dark/light theme switching and color management
 */

import Theme from '../../src/assets/scripts/utils/theme.js';

describe('Theme Utility', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset document theme
    document.documentElement.removeAttribute('data-theme');
    // Clear any theme-related CSS variables
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Theme Application', () => {
    it('should apply light theme', () => {
      Theme.apply('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply dark theme', () => {
      Theme.apply('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should save theme to localStorage', () => {
      Theme.apply('dark');
      expect(localStorage.getItem('adminator-theme')).toBe('dark');
    });

    it('should dispatch theme changed event', () => {
      const handler = jest.fn();
      window.addEventListener('adminator:themeChanged', handler);
      
      Theme.apply('dark');
      
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.theme).toBe('dark');
      
      window.removeEventListener('adminator:themeChanged', handler);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });
      
      expect(() => Theme.apply('dark')).not.toThrow();
      
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle from light to dark', () => {
      Theme.apply('light');
      Theme.toggle();
      expect(Theme.current()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      Theme.apply('dark');
      Theme.toggle();
      expect(Theme.current()).toBe('light');
    });

    it('should toggle multiple times', () => {
      Theme.apply('light');
      Theme.toggle(); // dark
      expect(Theme.current()).toBe('dark');
      Theme.toggle(); // light
      expect(Theme.current()).toBe('light');
      Theme.toggle(); // dark
      expect(Theme.current()).toBe('dark');
    });
  });

  describe('Current Theme', () => {
    it('should return light as default', () => {
      expect(Theme.current()).toBe('light');
    });

    it('should return saved theme', () => {
      localStorage.setItem('adminator-theme', 'dark');
      expect(Theme.current()).toBe('dark');
    });

    it('should handle localStorage errors', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('SecurityError');
      });
      
      expect(Theme.current()).toBe('light');
      
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('Theme Initialization', () => {
    it('should initialize with saved theme', () => {
      localStorage.setItem('adminator-theme', 'dark');
      Theme.init();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should detect OS dark mode preference', () => {
      // Mock matchMedia to prefer dark
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      
      Theme.init();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should detect OS light mode preference', () => {
      // Mock matchMedia to prefer light
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      
      Theme.init();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should not override existing theme', () => {
      localStorage.setItem('adminator-theme', 'light');
      
      // Mock matchMedia to prefer dark
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      
      Theme.init();
      // Should use saved 'light', not OS preference 'dark'
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('CSS Variable Access', () => {
    it('should get CSS variable value', () => {
      document.documentElement.style.setProperty('--test-color', '#FF0000');
      const value = Theme.getCSSVar('--test-color');
      expect(value).toBe('#FF0000');
    });

    it('should trim whitespace from CSS variable', () => {
      document.documentElement.style.setProperty('--test-color', '  #FF0000  ');
      const value = Theme.getCSSVar('--test-color');
      expect(value).toBe('#FF0000');
    });

    it('should return empty string for non-existent variable', () => {
      const value = Theme.getCSSVar('--non-existent');
      expect(value).toBe('');
    });
  });

  describe('Color Getters', () => {
    beforeEach(() => {
      // Set up CSS variables
      document.documentElement.style.setProperty('--vmap-bg-color', '#FFFFFF');
      document.documentElement.style.setProperty('--vmap-border-color', '#CCCCCC');
      document.documentElement.style.setProperty('--sparkline-success', '#28A745');
      document.documentElement.style.setProperty('--sparkline-purple', '#6F42C1');
    });

    describe('getVectorMapColors', () => {
      it('should return vector map colors object', () => {
        const colors = Theme.getVectorMapColors();
        expect(colors).toHaveProperty('backgroundColor');
        expect(colors).toHaveProperty('borderColor');
        expect(colors).toHaveProperty('regionColor');
      });

      it('should return correct color values', () => {
        const colors = Theme.getVectorMapColors();
        expect(colors.backgroundColor).toBe('#FFFFFF');
        expect(colors.borderColor).toBe('#CCCCCC');
      });
    });

    describe('getSparklineColors', () => {
      it('should return sparkline colors object', () => {
        const colors = Theme.getSparklineColors();
        expect(colors).toHaveProperty('success');
        expect(colors).toHaveProperty('purple');
        expect(colors).toHaveProperty('info');
        expect(colors).toHaveProperty('danger');
        expect(colors).toHaveProperty('light');
      });

      it('should return correct color values', () => {
        const colors = Theme.getSparklineColors();
        expect(colors.success).toBe('#28A745');
        expect(colors.purple).toBe('#6F42C1');
      });
    });

    describe('getChartColors', () => {
      it('should return light theme chart colors', () => {
        Theme.apply('light');
        const colors = Theme.getChartColors();
        expect(colors.textColor).toBe('#212529');
        expect(colors.mutedColor).toBe('#6C757D');
      });

      it('should return dark theme chart colors', () => {
        Theme.apply('dark');
        const colors = Theme.getChartColors();
        expect(colors.textColor).toBe('#FFFFFF');
        expect(colors.mutedColor).toBe('#D1D5DB');
      });

      it('should have all required color properties', () => {
        const colors = Theme.getChartColors();
        expect(colors).toHaveProperty('textColor');
        expect(colors).toHaveProperty('mutedColor');
        expect(colors).toHaveProperty('borderColor');
        expect(colors).toHaveProperty('gridColor');
        expect(colors).toHaveProperty('tooltipBg');
      });
    });
  });

  describe('Theme Persistence', () => {
    it('should persist theme across page reloads', () => {
      Theme.apply('dark');
      expect(localStorage.getItem('adminator-theme')).toBe('dark');
      
      // Simulate page reload
      const savedTheme = localStorage.getItem('adminator-theme');
      expect(savedTheme).toBe('dark');
    });

    it('should maintain theme after toggle', () => {
      Theme.apply('light');
      Theme.toggle();
      expect(localStorage.getItem('adminator-theme')).toBe('dark');
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid theme values', () => {
      Theme.apply('invalid-theme');
      expect(document.documentElement.getAttribute('data-theme')).toBe('invalid-theme');
    });

    it('should handle null theme', () => {
      expect(() => Theme.apply(null)).not.toThrow();
    });

    it('should handle undefined theme', () => {
      expect(() => Theme.apply(undefined)).not.toThrow();
    });

    it('should handle missing matchMedia', () => {
      const originalMatchMedia = window.matchMedia;
      delete window.matchMedia;
      
      expect(() => Theme.init()).not.toThrow();
      
      window.matchMedia = originalMatchMedia;
    });
  });
});
