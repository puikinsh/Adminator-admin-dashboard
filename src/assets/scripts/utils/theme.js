/* global Chart */
const THEME_KEY = 'adminator-theme';

const Theme = {
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
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
      Chart.defaults.scales.category.ticks.color = mutedColor;
      Chart.defaults.scales.category.grid.color = gridColor;
      Chart.defaults.scales.linear.ticks.color = mutedColor;
      Chart.defaults.scales.linear.grid.color = gridColor;
      Chart.defaults.scales.logarithmic.ticks.color = mutedColor;
      Chart.defaults.scales.logarithmic.grid.color = gridColor;
      Chart.defaults.scales.time.ticks.color = mutedColor;
      Chart.defaults.scales.time.grid.color = gridColor;
      Chart.defaults.scales.radialLinear.ticks.color = mutedColor;
      Chart.defaults.scales.radialLinear.grid.color = gridColor;
      Chart.defaults.scales.radialLinear.pointLabels.color = mutedColor;
      Chart.defaults.scales.radialLinear.angleLines.color = gridColor;
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore errors
    }
    window.dispatchEvent(new CustomEvent('adminator:themeChanged', { detail: { theme } }));
  },
  toggle() {
    const next = this.current() === 'dark' ? 'light' : 'dark';
    this.apply(next);
  },
  current() {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  },
  init() {
    // Detect OS preference first time
    if (!localStorage.getItem(THEME_KEY)) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(prefersDark ? 'dark' : 'light');
    } else {
      this.apply(this.current());
    }
  },
  getCSSVar(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  },
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
  getSparklineColors() {
    return {
      success: this.getCSSVar('--sparkline-success'),
      purple: this.getCSSVar('--sparkline-purple'),
      info: this.getCSSVar('--sparkline-info'),
      danger: this.getCSSVar('--sparkline-danger'),
      light: this.getCSSVar('--sparkline-light'),
    };
  },
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
};

export default Theme; 