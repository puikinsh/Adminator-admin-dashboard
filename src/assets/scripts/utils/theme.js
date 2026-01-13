/**
 * Adminator Theme Manager
 * Handles light/dark mode switching with localStorage persistence
 *
 * @module utils/theme
 * @example
 * // Get current theme
 * const current = Theme.current(); // 'light' or 'dark'
 *
 * // Toggle theme
 * Theme.toggle();
 *
 * // Apply specific theme
 * Theme.apply('dark');
 *
 * // Listen for theme changes
 * window.addEventListener('adminator:themeChanged', (e) => {
 *   console.log('New theme:', e.detail.theme);
 * });
 */

/* global Chart */

/** @constant {string} Storage key for theme preference */
const THEME_KEY = 'adminator-theme';

/** @constant {string[]} Valid theme values */
const VALID_THEMES = ['light', 'dark'];

/**
 * Safe localStorage wrapper
 * Handles cases where localStorage is unavailable (private browsing, etc.)
 * @private
 */
const Storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   */
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Theme Manager
 * @namespace
 */
const Theme = {
  /**
   * Apply a theme to the document
   * Updates Chart.js defaults if available
   *
   * @param {('light'|'dark')} theme - Theme to apply
   * @fires adminator:themeChanged
   * @returns {boolean} Success status
   *
   * @example
   * Theme.apply('dark');
   */
  apply(theme) {
    // Validate theme
    if (!VALID_THEMES.includes(theme)) {
      console.warn(`[Adminator] Invalid theme "${theme}". Using "light".`);
      theme = 'light';
    }

    // Apply to document
    document.documentElement.setAttribute('data-theme', theme);

    // Update Chart.js defaults if available
    if (window.Chart && Chart.defaults) {
      const isDark = theme === 'dark';
      const textColor = isDark ? '#FFFFFF' : '#212529';
      const mutedColor = isDark ? '#D1D5DB' : '#6C757D';
      const borderColor = isDark ? '#374151' : '#E2E5E8';
      const gridColor = isDark ? 'rgba(209, 213, 219, 0.15)' : 'rgba(0, 0, 0, 0.05)';
      const tooltipBg = isDark ? '#1F2937' : 'rgba(255, 255, 255, 0.95)';

      // Set global defaults
      Chart.defaults.color = textColor;
      Chart.defaults.borderColor = borderColor;
      Chart.defaults.backgroundColor = tooltipBg;

      // Set plugin defaults
      Chart.defaults.plugins.legend.labels.color = textColor;
      Chart.defaults.plugins.tooltip.backgroundColor = tooltipBg;
      Chart.defaults.plugins.tooltip.titleColor = textColor;
      Chart.defaults.plugins.tooltip.bodyColor = textColor;
      Chart.defaults.plugins.tooltip.borderColor = borderColor;

      // Set scale defaults
      const scales = ['category', 'linear', 'logarithmic', 'time', 'radialLinear'];
      scales.forEach(scale => {
        if (Chart.defaults.scales[scale]) {
          Chart.defaults.scales[scale].ticks.color = mutedColor;
          Chart.defaults.scales[scale].grid.color = gridColor;
        }
      });

      // RadialLinear specific
      if (Chart.defaults.scales.radialLinear) {
        Chart.defaults.scales.radialLinear.pointLabels.color = mutedColor;
        Chart.defaults.scales.radialLinear.angleLines.color = gridColor;
      }
    }

    // Persist to storage
    Storage.set(THEME_KEY, theme);

    // Update toggle accessibility state if exists
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
    }

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('adminator:themeChanged', {
      detail: { theme },
    }));

    return true;
  },

  /**
   * Toggle between light and dark themes
   *
   * @returns {('light'|'dark')} The new theme
   *
   * @example
   * const newTheme = Theme.toggle();
   * console.log('Switched to:', newTheme);
   */
  toggle() {
    const next = this.current() === 'dark' ? 'light' : 'dark';
    this.apply(next);
    return next;
  },

  /**
   * Get the current theme
   *
   * @returns {('light'|'dark')} Current theme
   *
   * @example
   * if (Theme.current() === 'dark') {
   *   // Dark mode specific logic
   * }
   */
  current() {
    const stored = Storage.get(THEME_KEY);
    return VALID_THEMES.includes(stored) ? stored : 'light';
  },

  /**
   * Initialize the theme system
   * Detects OS preference on first visit, otherwise uses stored preference
   *
   * @returns {('light'|'dark')} The applied theme
   *
   * @example
   * // Call once on app initialization
   * Theme.init();
   */
  init() {
    const stored = Storage.get(THEME_KEY);

    if (!stored) {
      // First visit - detect OS preference
      const prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      this.apply(theme);
      return theme;
    }

    // Use stored preference
    this.apply(this.current());
    return this.current();
  },

  /**
   * Get a CSS variable value from the document
   *
   * @param {string} varName - CSS variable name (with or without --)
   * @returns {string} The CSS variable value
   *
   * @example
   * const bgColor = Theme.getCSSVar('--c-bkg-body');
   */
  getCSSVar(varName) {
    const name = varName.startsWith('--') ? varName : `--${varName}`;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },

  /**
   * Get theme-aware colors for vector maps
   *
   * @returns {Object} Vector map color configuration
   * @property {string} backgroundColor - Map background color
   * @property {string} borderColor - Border color
   * @property {string} regionColor - Default region fill color
   * @property {string} markerFill - Marker fill color
   * @property {string} markerStroke - Marker stroke color
   * @property {string} hoverColor - Region hover color
   * @property {string} selectedColor - Selected region color
   * @property {string} scaleStart - Scale gradient start
   * @property {string} scaleEnd - Scale gradient end
   */
  getVectorMapColors() {
    return {
      backgroundColor: this.getCSSVar('--vmap-bg-color'),
      borderColor: this.getCSSVar('--vmap-border-color'),
      regionColor: this.getCSSVar('--vmap-region-color'),
      markerFill: this.getCSSVar('--vmap-marker-fill'),
      markerStroke: this.getCSSVar('--vmap-marker-stroke'),
      hoverColor: this.getCSSVar('--vmap-hover-color'),
      selectedColor: this.getCSSVar('--vmap-selected-color'),
      scaleStart: this.getCSSVar('--vmap-scale-start'),
      scaleEnd: this.getCSSVar('--vmap-scale-end'),
      scaleLight: this.getCSSVar('--vmap-scale-light'),
      scaleDark: this.getCSSVar('--vmap-scale-dark'),
    };
  },

  /**
   * Get theme-aware colors for sparkline charts
   *
   * @returns {Object} Sparkline color configuration
   */
  getSparklineColors() {
    return {
      success: this.getCSSVar('--sparkline-success'),
      purple: this.getCSSVar('--sparkline-purple'),
      info: this.getCSSVar('--sparkline-info'),
      danger: this.getCSSVar('--sparkline-danger'),
      light: this.getCSSVar('--sparkline-light'),
    };
  },

  /**
   * Get theme-aware colors for Chart.js charts
   *
   * @returns {Object} Chart color configuration
   * @property {string} textColor - Main text color
   * @property {string} mutedColor - Muted/secondary text color
   * @property {string} borderColor - Border color
   * @property {string} gridColor - Grid line color
   * @property {string} tooltipBg - Tooltip background color
   */
  getChartColors() {
    const isDark = this.current() === 'dark';
    return {
      textColor: isDark ? '#FFFFFF' : '#212529',
      mutedColor: isDark ? '#D1D5DB' : '#6C757D',
      borderColor: isDark ? '#374151' : '#E2E5E8',
      gridColor: isDark ? 'rgba(209, 213, 219, 0.15)' : 'rgba(0, 0, 0, 0.05)',
      tooltipBg: isDark ? '#1F2937' : 'rgba(255, 255, 255, 0.95)',
    };
  },

  /**
   * Check if dark mode is currently active
   *
   * @returns {boolean} True if dark mode is active
   *
   * @example
   * if (Theme.isDark()) {
   *   // Apply dark-specific styles
   * }
   */
  isDark() {
    return this.current() === 'dark';
  },

  /**
   * Check if light mode is currently active
   *
   * @returns {boolean} True if light mode is active
   */
  isLight() {
    return this.current() === 'light';
  },
};

export default Theme;
