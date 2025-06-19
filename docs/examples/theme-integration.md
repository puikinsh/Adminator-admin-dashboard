---
layout: default
title: Theme Integration
nav_order: 1
parent: Examples
---

# Theme Integration Examples
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

Practical examples for integrating custom components with Adminator's theme system.

## Basic Theme-Aware Component

### Simple CSS Integration

Create components that automatically adapt to theme changes:

```html
<!-- HTML -->
<div class="custom-widget">
  <h3 class="widget-title">My Custom Widget</h3>
  <div class="widget-content">
    <p>This widget adapts to the current theme.</p>
    <button class="widget-button">Action</button>
  </div>
</div>
```

```css
/* CSS using theme variables */
.custom-widget {
  background: var(--c-bkg-card);
  color: var(--c-text-base);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.widget-title {
  color: var(--c-text-base);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.widget-content {
  color: var(--c-text-muted);
  line-height: 1.6;
}

.widget-button {
  background: var(--c-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.widget-button:hover {
  opacity: 0.9;
}

/* Dark theme specific adjustments */
[data-theme="dark"] .custom-widget {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

## JavaScript Integration

### Theme-Aware Class Component

```javascript
class ThemeAwareWidget {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      autoUpdate: true,
      customColors: {},
      ...options
    };
    
    this.currentTheme = Theme.current();
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.updateTheme(this.currentTheme);
  }

  render() {
    this.element.innerHTML = `
      <div class="theme-widget">
        <div class="widget-header">
          <h4>Theme-Aware Widget</h4>
          <span class="theme-indicator">${this.currentTheme}</span>
        </div>
        <div class="widget-body">
          <div class="color-preview">
            <div class="color-sample" data-color="primary"></div>
            <div class="color-sample" data-color="success"></div>
            <div class="color-sample" data-color="danger"></div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    if (this.options.autoUpdate) {
      window.addEventListener('adminator:themeChanged', (event) => {
        this.currentTheme = event.detail.theme;
        this.updateTheme(this.currentTheme);
      });
    }
  }

  updateTheme(theme) {
    const widget = this.element.querySelector('.theme-widget');
    
    // Update theme indicator
    const indicator = widget.querySelector('.theme-indicator');
    indicator.textContent = theme;
    indicator.className = `theme-indicator theme-${theme}`;

    // Update color samples
    const samples = widget.querySelectorAll('.color-sample');
    samples.forEach(sample => {
      const colorType = sample.dataset.color;
      const cssVar = `--c-${colorType}`;
      const color = Theme.getCSSVar(cssVar);
      sample.style.backgroundColor = color;
    });

    // Apply custom colors if provided
    if (this.options.customColors[theme]) {
      Object.entries(this.options.customColors[theme]).forEach(([property, value]) => {
        widget.style.setProperty(property, value);
      });
    }

    // Trigger custom update callback
    if (this.options.onThemeChange) {
      this.options.onThemeChange(theme, this);
    }
  }

  // Public methods
  setTheme(theme) {
    Theme.apply(theme);
  }

  getCurrentColors() {
    return {
      primary: Theme.getCSSVar('--c-primary'),
      success: Theme.getCSSVar('--c-success'),
      danger: Theme.getCSSVar('--c-danger'),
      background: Theme.getCSSVar('--c-bkg-card'),
      text: Theme.getCSSVar('--c-text-base')
    };
  }

  destroy() {
    // Cleanup event listeners
    window.removeEventListener('adminator:themeChanged', this.updateTheme);
  }
}

// Usage
const widget = new ThemeAwareWidget(document.getElementById('my-widget'), {
  customColors: {
    dark: {
      '--custom-accent': '#ff6b6b'
    },
    light: {
      '--custom-accent': '#4dabf7'
    }
  },
  onThemeChange: (theme, instance) => {
    console.log(`Widget theme changed to: ${theme}`);
  }
});
```

## Chart Integration

### Theme-Aware Chart.js

```javascript
class ThemeChart {
  constructor(canvas, data, options = {}) {
    this.canvas = canvas;
    this.data = data;
    this.options = options;
    this.chart = null;
    
    this.init();
  }

  init() {
    this.createChart();
    this.bindThemeEvents();
  }

  createChart() {
    const colors = Theme.getChartColors();
    
    const config = {
      type: this.options.type || 'line',
      data: this.processData(this.data, colors),
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: colors.textColor,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            borderColor: colors.borderColor,
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: {
              color: colors.mutedColor
            },
            grid: {
              color: colors.gridColor
            }
          },
          y: {
            ticks: {
              color: colors.mutedColor
            },
            grid: {
              color: colors.gridColor
            }
          }
        },
        ...this.options.chartOptions
      }
    };

    this.chart = new Chart(this.canvas, config);
  }

  processData(data, colors) {
    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: dataset.borderColor || this.getDatasetColor(index, colors),
        backgroundColor: dataset.backgroundColor || this.getDatasetColor(index, colors, 0.2)
      }))
    };
  }

  getDatasetColor(index, colors, alpha = 1) {
    const colorKeys = ['primary', 'success', 'danger', 'info', 'warning'];
    const colorKey = colorKeys[index % colorKeys.length];
    const color = Theme.getCSSVar(`--c-${colorKey}`);
    
    if (alpha < 1) {
      // Convert hex to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    return color;
  }

  bindThemeEvents() {
    window.addEventListener('adminator:themeChanged', () => {
      this.updateChart();
    });
  }

  updateChart() {
    if (!this.chart) return;

    const colors = Theme.getChartColors();

    // Update chart options
    this.chart.options.plugins.legend.labels.color = colors.textColor;
    this.chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
    this.chart.options.plugins.tooltip.titleColor = colors.textColor;
    this.chart.options.plugins.tooltip.bodyColor = colors.textColor;
    this.chart.options.plugins.tooltip.borderColor = colors.borderColor;

    // Update scales
    this.chart.options.scales.x.ticks.color = colors.mutedColor;
    this.chart.options.scales.x.grid.color = colors.gridColor;
    this.chart.options.scales.y.ticks.color = colors.mutedColor;
    this.chart.options.scales.y.grid.color = colors.gridColor;

    // Update dataset colors
    this.chart.data.datasets.forEach((dataset, index) => {
      dataset.borderColor = this.getDatasetColor(index, colors);
      dataset.backgroundColor = this.getDatasetColor(index, colors, 0.2);
    });

    this.chart.update();
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

// Usage
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2, 3]
  }, {
    label: 'Revenue',
    data: [2, 3, 20, 5, 1, 4]
  }]
};

const themeChart = new ThemeChart(
  document.getElementById('myChart'),
  chartData,
  { 
    type: 'line',
    chartOptions: {
      tension: 0.4
    }
  }
);
```

## Custom Modal Integration

### Theme-Aware Modal

```javascript
class ThemeModal {
  constructor(options = {}) {
    this.options = {
      title: 'Modal Title',
      content: '',
      size: 'md', // sm, md, lg, xl
      backdrop: true,
      keyboard: true,
      ...options
    };
    
    this.modal = null;
    this.element = null;
    this.currentTheme = Theme.current();
    
    this.init();
  }

  init() {
    this.createElement();
    this.bindEvents();
    this.updateTheme(this.currentTheme);
  }

  createElement() {
    const modalId = `modal-${Date.now()}`;
    
    const modalHTML = `
      <div class="modal fade theme-modal" id="${modalId}" tabindex="-1">
        <div class="modal-dialog modal-${this.options.size}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${this.options.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${this.options.content}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary modal-action">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.element = document.getElementById(modalId);
    
    // Initialize Bootstrap modal
    this.modal = new bootstrap.Modal(this.element, {
      backdrop: this.options.backdrop,
      keyboard: this.options.keyboard
    });
  }

  bindEvents() {
    // Theme change event
    window.addEventListener('adminator:themeChanged', (event) => {
      this.currentTheme = event.detail.theme;
      this.updateTheme(this.currentTheme);
    });

    // Action button click
    const actionButton = this.element.querySelector('.modal-action');
    actionButton.addEventListener('click', () => {
      if (this.options.onAction) {
        this.options.onAction(this);
      }
    });

    // Cleanup on hide
    this.element.addEventListener('hidden.bs.modal', () => {
      if (this.options.autoDestroy !== false) {
        this.destroy();
      }
    });
  }

  updateTheme(theme) {
    const content = this.element.querySelector('.modal-content');
    
    // Apply theme-specific styles
    content.style.backgroundColor = Theme.getCSSVar('--c-bkg-card');
    content.style.color = Theme.getCSSVar('--c-text-base');
    content.style.border = `1px solid ${Theme.getCSSVar('--c-border')}`;

    // Update header
    const header = this.element.querySelector('.modal-header');
    header.style.borderBottom = `1px solid ${Theme.getCSSVar('--c-border')}`;

    // Update footer
    const footer = this.element.querySelector('.modal-footer');
    footer.style.borderTop = `1px solid ${Theme.getCSSVar('--c-border')}`;

    // Update close button for dark theme
    const closeButton = this.element.querySelector('.btn-close');
    if (theme === 'dark') {
      closeButton.classList.add('btn-close-white');
    } else {
      closeButton.classList.remove('btn-close-white');
    }
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  destroy() {
    if (this.modal) {
      this.modal.dispose();
    }
    if (this.element) {
      this.element.remove();
    }
  }
}

// Usage
const modal = new ThemeModal({
  title: 'Theme-Aware Modal',
  content: '<p>This modal adapts to the current theme automatically.</p>',
  size: 'lg',
  onAction: (modalInstance) => {
    console.log('Action button clicked!');
    modalInstance.hide();
  }
});

modal.show();
```

## React Hook Integration

### useTheme Hook

```javascript
import { useState, useEffect } from 'react';

// Custom hook for theme management
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Initialize with current theme
    return window.Theme ? window.Theme.current() : 'light';
  });

  const [isLoading, setIsLoading] = useState(!window.Theme);

  useEffect(() => {
    // Wait for Theme object to be available
    if (!window.Theme) {
      const checkTheme = () => {
        if (window.Theme) {
          setTheme(window.Theme.current());
          setIsLoading(false);
        } else {
          setTimeout(checkTheme, 100);
        }
      };
      checkTheme();
      return;
    }

    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener('adminator:themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('adminator:themeChanged', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    if (window.Theme) {
      window.Theme.toggle();
    }
  };

  const setSpecificTheme = (newTheme) => {
    if (window.Theme) {
      window.Theme.apply(newTheme);
    }
  };

  const getThemeColors = () => {
    if (!window.Theme) return {};
    
    return {
      primary: window.Theme.getCSSVar('--c-primary'),
      success: window.Theme.getCSSVar('--c-success'),
      danger: window.Theme.getCSSVar('--c-danger'),
      background: window.Theme.getCSSVar('--c-bkg-card'),
      text: window.Theme.getCSSVar('--c-text-base'),
      muted: window.Theme.getCSSVar('--c-text-muted'),
      border: window.Theme.getCSSVar('--c-border')
    };
  };

  return {
    theme,
    isLoading,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggle: toggleTheme,
    setTheme: setSpecificTheme,
    colors: getThemeColors()
  };
}

// React component using the hook
export function ThemeAwareCard({ children, title }) {
  const { theme, colors, isDark } = useTheme();

  const cardStyle = {
    backgroundColor: colors.background,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: isDark 
      ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = {
    color: colors.text,
    marginBottom: '1rem',
    fontSize: '1.25rem',
    fontWeight: '600'
  };

  return (
    <div style={cardStyle} className={`theme-card theme-${theme}`}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      <div style={{ color: colors.muted }}>
        {children}
      </div>
    </div>
  );
}

// Theme toggle button component
export function ThemeToggle() {
  const { theme, toggle, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <button 
      onClick={toggle}
      className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'}`}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

## Performance Optimization

### Throttled Theme Updates

For components with expensive rendering:

```javascript
class PerformantThemeComponent {
  constructor(element) {
    this.element = element;
    this.updateTheme = this.throttle(this._updateTheme.bind(this), 100);
    
    window.addEventListener('adminator:themeChanged', this.updateTheme);
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  _updateTheme(event) {
    // Expensive theme update operations
    this.recalculateLayout();
    this.updateComplexVisuals();
  }

  recalculateLayout() {
    // Complex layout calculations
  }

  updateComplexVisuals() {
    // Expensive visual updates
  }
}
```

---

**Next Steps:** 
- Check out [Component APIs](../api/component-apis.md) for more integration options
- Explore [Advanced Patterns](advanced-patterns.md) for complex scenarios
- Review [Performance Optimization](../deployment/performance.md) for production tips 