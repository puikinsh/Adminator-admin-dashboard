/**
 * Theme Management Utilities
 * Handles light/dark mode switching with Chart.js integration
 */

import type { Theme, ThemeConfig, ThemeColors, ThemeChangeEvent } from '../../../types';

declare global {
  interface Window {
    Chart?: any; // Chart.js global object
  }
}

interface VectorMapColors {
  backgroundColor: string;
  borderColor: string;
  regionColor: string;
  markerFill: string;
  markerStroke: string;
  hoverColor: string;
  selectedColor: string;
  scaleStart: string;
  scaleEnd: string;
  scaleLight: string;
  scaleDark: string;
}

interface SparklineColors {
  success: string;
  purple: string;
  info: string;
  danger: string;
  light: string;
}

interface ChartThemeColors {
  textColor: string;
  mutedColor: string;
  borderColor: string;
  gridColor: string;
  tooltipBg: string;
}

const THEME_KEY = 'adminator-theme';

/**
 * Theme Management Class
 */
class ThemeManager {
  private currentTheme: Theme = 'light';
  private config: ThemeConfig;

  constructor(config?: Partial<ThemeConfig>) {
    this.config = {
      theme: 'light',
      autoDetect: true,
      persistChoice: true,
      ...config,
    };
  }

  /**
   * Apply theme to the application
   */
  apply(theme: Theme): void {
    const previousTheme = this.currentTheme;
    this.currentTheme = theme;

    // Set theme attribute on document element
    document.documentElement.setAttribute('data-theme', theme);

    // Update Chart.js defaults if Chart is available
    this.updateChartDefaults(theme);

    // Persist theme choice if enabled
    if (this.config.persistChoice) {
      this.persistTheme(theme);
    }

    // Dispatch theme change event
    this.dispatchThemeChange(theme, previousTheme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggle(): void {
    const nextTheme: Theme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.apply(nextTheme);
  }

  /**
   * Get current theme
   */
  current(): Theme {
    return this.currentTheme;
  }

  /**
   * Initialize theme system
   */
  init(): void {
    let initialTheme: Theme = 'light';

    // Try to load persisted theme
    if (this.config.persistChoice) {
      const persistedTheme = this.getPersistedTheme();
      if (persistedTheme) {
        initialTheme = persistedTheme;
      } else if (this.config.autoDetect) {
        // Detect OS preference on first visit
        initialTheme = this.detectOSPreference();
      }
    }

    this.apply(initialTheme);
  }

  /**
   * Get CSS custom property value
   */
  getCSSVar(varName: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  /**
   * Get vector map theme colors
   */
  getVectorMapColors(): VectorMapColors {
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
  }

  /**
   * Get sparkline theme colors
   */
  getSparklineColors(): SparklineColors {
    return {
      success: this.getCSSVar('--sparkline-success'),
      purple: this.getCSSVar('--sparkline-purple'),
      info: this.getCSSVar('--sparkline-info'),
      danger: this.getCSSVar('--sparkline-danger'),
      light: this.getCSSVar('--sparkline-light'),
    };
  }

  /**
   * Get chart theme colors
   */
  getChartColors(): ChartThemeColors {
    const isDark = this.currentTheme === 'dark';
    return {
      textColor: isDark ? '#FFFFFF' : '#212529',
      mutedColor: isDark ? '#D1D5DB' : '#6C757D',
      borderColor: isDark ? '#374151' : '#E2E5E8',
      gridColor: isDark ? 'rgba(209, 213, 219, 0.15)' : 'rgba(0, 0, 0, 0.05)',
      tooltipBg: isDark ? '#1F2937' : 'rgba(255, 255, 255, 0.95)',
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ThemeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ThemeConfig {
    return { ...this.config };
  }

  /**
   * Private method: Update Chart.js defaults
   */
  private updateChartDefaults(theme: Theme): void {
    if (!window.Chart || !window.Chart.defaults) {
      return;
    }

    const isDark = theme === 'dark';
    const colors = this.getChartColors();
    
    try {
      // Set global defaults
      window.Chart.defaults.color = colors.textColor;
      window.Chart.defaults.borderColor = colors.borderColor;
      window.Chart.defaults.backgroundColor = colors.tooltipBg;
      
      // Set plugin defaults
      if (window.Chart.defaults.plugins?.legend?.labels) {
        window.Chart.defaults.plugins.legend.labels.color = colors.textColor;
      }
      
      if (window.Chart.defaults.plugins?.tooltip) {
        window.Chart.defaults.plugins.tooltip.backgroundColor = colors.tooltipBg;
        window.Chart.defaults.plugins.tooltip.titleColor = colors.textColor;
        window.Chart.defaults.plugins.tooltip.bodyColor = colors.textColor;
        window.Chart.defaults.plugins.tooltip.borderColor = colors.borderColor;
      }
      
      // Set scale defaults
      const scaleDefaults = window.Chart.defaults.scales;
      if (scaleDefaults) {
        Object.keys(scaleDefaults).forEach(scaleType => {
          const scale = scaleDefaults[scaleType];
          if (scale?.ticks) {
            scale.ticks.color = colors.mutedColor;
          }
          if (scale?.grid) {
            scale.grid.color = colors.gridColor;
          }
          if (scale?.pointLabels) {
            scale.pointLabels.color = colors.mutedColor;
          }
          if (scale?.angleLines) {
            scale.angleLines.color = colors.gridColor;
          }
        });
      }
    } catch (error) {
      console.warn('Error updating Chart.js defaults:', error);
    }
  }

  /**
   * Private method: Persist theme to localStorage
   */
  private persistTheme(theme: Theme): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn('Unable to persist theme:', error);
    }
  }

  /**
   * Private method: Get persisted theme from localStorage
   */
  private getPersistedTheme(): Theme | null {
    try {
      const theme = localStorage.getItem(THEME_KEY) as Theme;
      return ['light', 'dark'].includes(theme) ? theme : null;
    } catch (error) {
      console.warn('Unable to get persisted theme:', error);
      return null;
    }
  }

  /**
   * Private method: Detect OS color scheme preference
   */
  private detectOSPreference(): Theme {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Private method: Dispatch theme change event
   */
  private dispatchThemeChange(theme: Theme, previousTheme: Theme): void {
    const event: ThemeChangeEvent = new CustomEvent('adminator:themeChanged', {
      detail: { theme, previousTheme },
    }) as ThemeChangeEvent;
    
    window.dispatchEvent(event);
  }
}

// Create singleton instance
const themeManager = new ThemeManager();

// Export legacy object interface for compatibility
export const Theme = {
  apply: (theme: Theme) => themeManager.apply(theme),
  toggle: () => themeManager.toggle(),
  current: () => themeManager.current(),
  init: () => themeManager.init(),
  getCSSVar: (varName: string) => themeManager.getCSSVar(varName),
  getVectorMapColors: () => themeManager.getVectorMapColors(),
  getSparklineColors: () => themeManager.getSparklineColors(),
  getChartColors: () => themeManager.getChartColors(),
};

// Export both the manager instance and legacy interface
export { themeManager as ThemeManager };
export default Theme;

// Export types for external use
export type {
  Theme as ThemeType,
  ThemeConfig,
  VectorMapColors,
  SparklineColors,
  ChartThemeColors,
};