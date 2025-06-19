---
layout: default
title: Theme System
nav_order: 1
parent: Customization
---

# Theme System Overview
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

Adminator v2.6.0 introduces a comprehensive dark mode system with intelligent theme switching and component integration.

## 🌟 Features

### Core Capabilities
- **🌗 Smart Toggle**: Bootstrap-based switch with sun/moon icons
- **🔄 OS Detection**: Automatically detects and applies system preference
- **💾 Persistent Storage**: Remembers theme choice across browser sessions
- **⚡ Instant Switching**: Real-time theme updates without page reload
- **🎯 Component Integration**: All elements are theme-aware

### Visual Enhancements
- **🎨 Semantic Colors**: Consistent color variables across components
- **📊 Chart Integration**: Dynamic color schemes for Chart.js
- **🗓️ Calendar Support**: Dark-mode aware FullCalendar
- **🗺️ Map Theming**: Custom color palettes for vector and Google maps

## 🚀 Quick Start

### Basic Usage

The theme system is automatically initialized when the page loads:

```javascript
// The theme toggle is automatically injected into the header
// Users can click the Light/Dark switch to change themes
```

### Programmatic Control

```javascript
// Get current theme
const currentTheme = Theme.current(); // 'light' or 'dark'

// Switch themes
Theme.toggle();

// Set specific theme
Theme.apply('dark');
Theme.apply('light');

// Listen for theme changes
window.addEventListener('adminator:themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
  // Your custom logic here
});
```

## 🎨 CSS Variables

### Core Theme Variables

```css
:root {
  /* Backgrounds */
  --c-bkg-body: #f8f9fa;      /* Main page background */
  --c-bkg-card: #ffffff;      /* Card and panel backgrounds */
  --c-bkg-sidebar: #ffffff;   /* Sidebar background */

  /* Text Colors */
  --c-text-base: #212529;     /* Primary text color */
  --c-text-muted: #6c757d;    /* Secondary text color */

  /* UI Elements */
  --c-border: #e2e5e8;        /* Border colors */
  --c-primary: #4b7cf3;       /* Primary brand color */
  --c-success: #2ecc71;       /* Success state color */
  --c-danger: #e74c3c;        /* Error state color */
}

/* Dark theme overrides */
[data-theme="dark"] {
  --c-bkg-body: #181a1f;
  --c-bkg-card: #20232a;
  --c-bkg-sidebar: #20232a;
  --c-text-base: #e8eaed;
  --c-text-muted: #9ca3af;
  --c-border: #2b2f36;
  /* ... additional dark theme variables */
}
```

### Component-Specific Variables

```css
:root {
  /* Vector Maps */
  --vmap-bg-color: #ffffff;
  --vmap-region-color: #e4ecef;
  --vmap-hover-color: #ffffff;

  /* Charts */
  --sparkline-success: #4caf50;
  --sparkline-info: #03a9f3;
  --sparkline-danger: #f96262;

  /* Maps */
  --gmap-landscape-hue: #FFBB00;
  --gmap-water-hue: #0078FF;
}
```

## 🔧 Implementation Details

### Theme Toggle Component

The theme toggle is automatically injected into the navigation:

```html
<!-- Automatically generated theme toggle -->
<li class="theme-toggle d-flex ai-c">
  <div class="form-check form-switch d-flex ai-c">
    <label class="form-check-label me-2 text-nowrap c-grey-700" for="theme-toggle">
      <i class="ti-sun"></i> Light
    </label>
    <input class="form-check-input" type="checkbox" id="theme-toggle">
    <label class="form-check-label ms-2 text-nowrap c-grey-700" for="theme-toggle">
      Dark <i class="ti-moon"></i>
    </label>
  </div>
</li>
```

### Theme Detection Logic

```javascript
// Automatic OS preference detection
if (!localStorage.getItem('adminator-theme')) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  Theme.apply(prefersDark ? 'dark' : 'light');
} else {
  Theme.apply(Theme.current());
}
```

## 🎯 Component Integration

### Chart.js Integration

Charts automatically update colors when themes change:

```javascript
// Chart colors are automatically updated
const chartColors = Theme.getChartColors();
// Returns: { textColor, mutedColor, borderColor, gridColor, tooltipBg }

// Custom chart configuration
const chart = new Chart(ctx, {
  data: data,
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
        ticks: {
          color: chartColors.mutedColor
        },
        grid: {
          color: chartColors.gridColor
        }
      }
    }
  }
});
```

### FullCalendar Integration

Calendar styling updates automatically:

```css
/* Automatic dark mode calendar styling */
.fc {
  background: var(--c-bkg-card);
  color: var(--c-text-base);
}

.fc-event {
  border-color: var(--c-border) !important;
}

.fc-daygrid-day {
  border-color: var(--c-border) !important;
}
```

### Vector Maps Integration

Maps use theme-aware color palettes:

```javascript
// Get vector map colors for current theme
const mapColors = Theme.getVectorMapColors();
/* Returns:
{
  backgroundColor: '#ffffff' | '#20232a',
  regionColor: '#e4ecef' | '#2b2f36',
  hoverColor: '#ffffff' | '#181a1f',
  // ... other map-specific colors
}
*/
```

## 🎨 Custom Styling

### Using CSS Variables

Style your components with theme-aware variables:

```css
.my-custom-component {
  background: var(--c-bkg-card);
  color: var(--c-text-base);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 1rem;
}

.my-custom-button {
  background: var(--c-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.my-custom-button:hover {
  background: var(--c-primary);
  opacity: 0.9;
}
```

### Creating Theme-Aware Components

```javascript
class MyCustomComponent {
  constructor(element) {
    this.element = element;
    this.init();
    
    // Listen for theme changes
    window.addEventListener('adminator:themeChanged', (event) => {
      this.updateTheme(event.detail.theme);
    });
  }

  updateTheme(theme) {
    // Update component based on theme
    if (theme === 'dark') {
      this.element.classList.add('dark-mode');
    } else {
      this.element.classList.remove('dark-mode');
    }
  }
}
```

## 🔍 Advanced Usage

### Custom Theme Colors

Override default theme colors:

```css
:root {
  /* Custom brand colors */
  --c-primary: #your-brand-color;
  --c-success: #your-success-color;
}

[data-theme="dark"] {
  /* Custom dark theme colors */
  --c-primary: #your-dark-brand-color;
  --c-success: #your-dark-success-color;
}
```

### Theme-Specific Images

Use different images for light/dark themes:

```css
.logo {
  background-image: url('logo-light.png');
}

[data-theme="dark"] .logo {
  background-image: url('logo-dark.png');
}
```

### Dynamic Theme Updates

Create dynamic theme switching animations:

```css
/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Disable transitions during theme switch */
.theme-transitioning * {
  transition: none !important;
}
```

## 🐛 Troubleshooting

### Common Issues

#### Theme Not Persisting
```javascript
// Check localStorage availability
if (typeof(Storage) !== "undefined") {
  // localStorage is available
} else {
  // No web storage support
  console.warn('localStorage not available - theme won\'t persist');
}
```

#### Components Not Updating
```javascript
// Ensure components listen for theme changes
window.addEventListener('adminator:themeChanged', (event) => {
  // Force component update
  myComponent.refresh();
});
```

#### CSS Variables Not Working
```css
/* Fallback for older browsers */
.my-component {
  background: #ffffff; /* Fallback */
  background: var(--c-bkg-card); /* Modern */
}
```

## 📚 Related Documentation

- **[CSS Variables Reference](css-variables.md)** - Complete variable list
- **[Custom Theme Creation](custom-themes.md)** - Create your own themes
- **[Component Theming](component-theming.md)** - Theme individual components

---

**Ready to customize?** Start with the [CSS Variables Reference](css-variables.md) or explore [Custom Theme Creation](custom-themes.md)! 