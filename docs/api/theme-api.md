---
layout: default
title: Theme API
nav_order: 1
parent: API Reference
---

# Theme API Reference
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

Complete API documentation for the Adminator Theme utility system.

## Overview

The Theme API provides programmatic control over Adminator's dark mode and theming system. It includes methods for theme management, color retrieval, and event handling.

## Theme Object

The global `Theme` object is available throughout the application:

```javascript
// Available globally
window.Theme
// or simply
Theme
```

## Core Methods

### `Theme.apply(theme)`

Applies a specific theme to the application.

**Parameters:**
- `theme` (string): The theme to apply (`'light'` or `'dark'`)

**Returns:** `void`

**Example:**
```javascript
// Apply dark theme
Theme.apply('dark');

// Apply light theme
Theme.apply('light');
```

**Side Effects:**
- Sets `data-theme` attribute on `document.documentElement`
- Updates Chart.js global defaults (if Chart.js is loaded)
- Saves theme preference to localStorage
- Dispatches `adminator:themeChanged` event

---

### `Theme.toggle()`

Toggles between light and dark themes.

**Parameters:** None

**Returns:** `void`

**Example:**
```javascript
// Switch from current theme to opposite
Theme.toggle();

// If current theme is 'light', switches to 'dark'
// If current theme is 'dark', switches to 'light'
```

---

### `Theme.current()`

Gets the currently active theme.

**Parameters:** None

**Returns:** `string` - The current theme (`'light'` or `'dark'`)

**Example:**
```javascript
const currentTheme = Theme.current();
console.log(currentTheme); // 'light' or 'dark'

// Use in conditional logic
if (Theme.current() === 'dark') {
  // Dark theme specific logic
}
```

---

### `Theme.init()`

Initializes the theme system. Called automatically on page load.

**Parameters:** None

**Returns:** `void`

**Example:**
```javascript
// Manual initialization (usually not needed)
Theme.init();
```

**Behavior:**
- Checks for stored theme preference in localStorage
- If no stored preference, detects OS color scheme preference
- Applies the determined theme
- Sets up Chart.js defaults if available

---

### `Theme.getCSSVar(varName)`

Retrieves the computed value of a CSS custom property.

**Parameters:**
- `varName` (string): The CSS variable name (including `--` prefix)

**Returns:** `string` - The computed CSS variable value

**Example:**
```javascript
// Get primary color
const primaryColor = Theme.getCSSVar('--c-primary');
console.log(primaryColor); // '#4b7cf3'

// Get background color
const bgColor = Theme.getCSSVar('--c-bkg-body');
console.log(bgColor); // '#f8f9fa' or '#181a1f'
```

## Specialized Color Methods

### `Theme.getChartColors()`

Gets color values optimized for Chart.js components.

**Parameters:** None

**Returns:** `object` - Chart color configuration

**Return Object:**
```javascript
{
  textColor: string,    // Primary text color
  mutedColor: string,   // Secondary text color
  borderColor: string,  // Border colors
  gridColor: string,    // Grid line colors
  tooltipBg: string     // Tooltip background
}
```

**Example:**
```javascript
const chartColors = Theme.getChartColors();

const chart = new Chart(ctx, {
  options: {
    plugins: {
      legend: {
        labels: {
          color: chartColors.textColor
        }
      }
    },
    scales: {
      y: {
        ticks: { color: chartColors.mutedColor },
        grid: { color: chartColors.gridColor }
      }
    }
  }
});
```

---

### `Theme.getVectorMapColors()`

Gets color palette for vector map components.

**Parameters:** None

**Returns:** `object` - Vector map color configuration

**Return Object:**
```javascript
{
  backgroundColor: string,   // Map background
  borderColor: string,      // Map borders
  regionColor: string,      // Default region color
  markerFill: string,       // Marker fill color
  markerStroke: string,     // Marker stroke color
  hoverColor: string,       // Hover state color
  selectedColor: string,    // Selected state color
  scaleStart: string,       // Color scale start
  scaleEnd: string,         // Color scale end
  scaleLight: string,       // Light scale color
  scaleDark: string         // Dark scale color
}
```

**Example:**
```javascript
const mapColors = Theme.getVectorMapColors();

$('#world-map').vectorMap({
  backgroundColor: mapColors.backgroundColor,
  regionStyle: {
    initial: {
      fill: mapColors.regionColor,
      stroke: mapColors.borderColor
    },
    hover: {
      fill: mapColors.hoverColor
    }
  }
});
```

---

### `Theme.getSparklineColors()`

Gets color palette for Sparkline chart components.

**Parameters:** None

**Returns:** `object` - Sparkline color configuration

**Return Object:**
```javascript
{
  success: string,  // Success state color
  purple: string,   // Purple variant
  info: string,     // Info state color
  danger: string,   // Danger state color
  light: string     // Light variant
}
```

**Example:**
```javascript
const sparklineColors = Theme.getSparklineColors();

$('.sparkline-success').sparkline(data, {
  lineColor: sparklineColors.success,
  fillColor: false
});
```

## Event System

### Theme Change Event

The theme system dispatches custom events when themes change.

**Event Name:** `adminator:themeChanged`

**Event Detail:**
```javascript
{
  theme: string  // The new theme ('light' or 'dark')
}
```

**Example:**
```javascript
// Listen for theme changes
window.addEventListener('adminator:themeChanged', (event) => {
  const newTheme = event.detail.theme;
  console.log('Theme changed to:', newTheme);
  
  // Update custom components
  updateCustomComponent(newTheme);
});

// Alternative using jQuery
$(window).on('adminator:themeChanged', function(event) {
  const newTheme = event.originalEvent.detail.theme;
  // Handle theme change
});
```

## Storage Management

### Local Storage Key

The theme preference is stored using the key: `'adminator-theme'`

**Example:**
```javascript
// Manually check stored theme
const storedTheme = localStorage.getItem('adminator-theme');
console.log(storedTheme); // 'light', 'dark', or null

// Manually set theme preference
localStorage.setItem('adminator-theme', 'dark');
```

### Fallback Handling

The Theme API gracefully handles storage unavailability:

```javascript
// Internal implementation example
try {
  localStorage.setItem('adminator-theme', theme);
} catch (_) {
  // Storage not available - theme won't persist
  // But theme will still work for current session
}
```

## Integration Examples

### React Integration

```javascript
import { useEffect, useState } from 'react';

function useTheme() {
  const [theme, setTheme] = useState(Theme.current());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener('adminator:themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('adminator:themeChanged', handleThemeChange);
    };
  }, []);

  return {
    theme,
    toggle: Theme.toggle,
    setTheme: Theme.apply
  };
}
```

### Vue.js Integration

```javascript
export default {
  data() {
    return {
      currentTheme: Theme.current()
    }
  },
  
  mounted() {
    window.addEventListener('adminator:themeChanged', this.handleThemeChange);
  },
  
  beforeDestroy() {
    window.removeEventListener('adminator:themeChanged', this.handleThemeChange);
  },
  
  methods: {
    handleThemeChange(event) {
      this.currentTheme = event.detail.theme;
    },
    
    toggleTheme() {
      Theme.toggle();
    }
  }
}
```

### Custom Component Integration

```javascript
class CustomWidget {
  constructor(element) {
    this.element = element;
    this.currentTheme = Theme.current();
    
    this.init();
    this.bindEvents();
  }

  init() {
    this.updateTheme(this.currentTheme);
  }

  bindEvents() {
    window.addEventListener('adminator:themeChanged', (event) => {
      this.currentTheme = event.detail.theme;
      this.updateTheme(this.currentTheme);
    });
  }

  updateTheme(theme) {
    // Update widget based on theme
    if (theme === 'dark') {
      this.element.classList.add('widget-dark');
      this.element.style.backgroundColor = Theme.getCSSVar('--c-bkg-card');
    } else {
      this.element.classList.remove('widget-dark');
      this.element.style.backgroundColor = Theme.getCSSVar('--c-bkg-card');
    }
  }
}
```

## Error Handling

### Browser Compatibility

```javascript
// Check for CSS custom property support
function supportsCSSVariables() {
  return window.CSS && CSS.supports('color', 'var(--fake-var)');
}

if (!supportsCSSVariables()) {
  console.warn('CSS variables not supported - theme switching limited');
}
```

### LocalStorage Availability

```javascript
// Check for localStorage support
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

if (!supportsLocalStorage()) {
  console.warn('localStorage not available - theme preference won\'t persist');
}
```

## Performance Considerations

### Debounced Theme Changes

For applications with many theme-aware components:

```javascript
let themeChangeTimeout;

window.addEventListener('adminator:themeChanged', (event) => {
  clearTimeout(themeChangeTimeout);
  themeChangeTimeout = setTimeout(() => {
    // Expensive theme update operations
    updateManyComponents(event.detail.theme);
  }, 100);
});
```

### Efficient CSS Variable Reading

Cache CSS variable values when possible:

```javascript
class ThemeCache {
  constructor() {
    this.cache = new Map();
    this.cacheTheme = null;
  }

  getCSSVar(varName) {
    const currentTheme = Theme.current();
    
    if (this.cacheTheme !== currentTheme) {
      this.cache.clear();
      this.cacheTheme = currentTheme;
    }

    if (!this.cache.has(varName)) {
      const value = Theme.getCSSVar(varName);
      this.cache.set(varName, value);
    }

    return this.cache.get(varName);
  }
}
```

---

**Next:** Explore [Component APIs](component-apis.md) or check out [Theme Integration Examples](../examples/theme-integration.md). 