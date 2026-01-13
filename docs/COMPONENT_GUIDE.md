# Component Development Guide

This guide explains how to create new components for the Adminator admin dashboard, following the established patterns and best practices.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Creating a New Component](#creating-a-new-component)
- [Component Lifecycle](#component-lifecycle)
- [Theme Integration](#theme-integration)
- [Event Handling](#event-handling)
- [Mobile Considerations](#mobile-considerations)
- [Testing Components](#testing-components)

---

## Architecture Overview

Adminator uses a class-based component architecture with the following structure:

```
src/assets/scripts/
├── app.js                 # Main application controller
├── components/            # Reusable UI components
│   ├── Sidebar.js
│   └── Chart.js
├── utils/                 # Utility modules
│   ├── dom.js            # DOM manipulation
│   ├── theme.js          # Theme management
│   ├── events.js         # Event handling
│   ├── performance.js    # Performance utilities
│   ├── logger.js         # Development logging
│   └── date.js           # Date utilities
└── [feature modules]      # Feature-specific code
```

### Key Principles

1. **No jQuery** - Use vanilla JS and the `DOM` utility
2. **Event Delegation** - Use `Events.delegate()` for performance
3. **Theme Awareness** - Support light/dark modes via CSS variables
4. **Cleanup** - Always provide a `destroy()` method
5. **Mobile First** - Consider touch interactions

---

## Creating a New Component

### Step 1: Create the Component File

Create a new file in `src/assets/scripts/components/`:

```javascript
/**
 * MyComponent - Description of what it does
 *
 * @module components/MyComponent
 */

import { DOM } from '../utils/dom';
import Events from '../utils/events';
import Logger from '../utils/logger';

class MyComponent {
  /**
   * Create a MyComponent instance
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.selector='.my-component'] - Root element selector
   */
  constructor(options = {}) {
    this.options = {
      selector: '.my-component',
      ...options,
    };

    this.element = DOM.select(this.options.selector);
    this.cleanupFunctions = [];

    if (this.element) {
      this.init();
    }
  }

  /**
   * Initialize the component
   */
  init() {
    Logger.debug('MyComponent initializing');

    this.bindEvents();
    this.render();

    Logger.info('MyComponent initialized');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Use event delegation for child elements
    const cleanup = Events.delegate(
      this.element,
      'click',
      '.action-button',
      (e, button) => this.handleAction(e, button)
    );
    this.cleanupFunctions.push(cleanup);

    // Listen for theme changes
    const themeCleanup = Events.on(window, 'adminator:themeChanged', () => {
      this.onThemeChange();
    });
    this.cleanupFunctions.push(themeCleanup);
  }

  /**
   * Handle action button clicks
   * @param {Event} e - Click event
   * @param {Element} button - Clicked button
   */
  handleAction(e, button) {
    e.preventDefault();
    // Handle the action
  }

  /**
   * Called when theme changes
   */
  onThemeChange() {
    // Update component for new theme
  }

  /**
   * Render/update the component
   */
  render() {
    // Update DOM as needed
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    // Run all cleanup functions
    this.cleanupFunctions.forEach(fn => fn());
    this.cleanupFunctions = [];

    Logger.debug('MyComponent destroyed');
  }
}

export default MyComponent;
```

### Step 2: Register with the App

Add your component to `app.js`:

```javascript
import MyComponent from './components/MyComponent';

class AdminatorApp {
  init() {
    // ... existing init code ...
    this.initMyComponent();
  }

  initMyComponent() {
    if (DOM.exists('.my-component')) {
      const myComponent = new MyComponent();
      this.components.set('myComponent', myComponent);
    }
  }
}
```

### Step 3: Add Styles

Create styles in `src/assets/styles/spec/components/`:

```scss
// _my-component.scss

.my-component {
  // Use CSS variables for theme support
  background: var(--c-bkg-card);
  color: var(--c-text-base);
  border: 1px solid var(--c-border);

  // Mobile-first responsive styles
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
}
```

Import in `index.scss`:

```scss
@import 'components/my-component';
```

---

## Component Lifecycle

```
┌─────────────────┐
│   constructor   │  - Store options
│                 │  - Find root element
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      init()     │  - Bind events
│                 │  - Initial render
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Active State   │  - Handle events
│                 │  - Respond to theme changes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    destroy()    │  - Remove event listeners
│                 │  - Clean up resources
└─────────────────┘
```

---

## Theme Integration

### Using CSS Variables

Always use CSS variables for colors:

```scss
.my-component {
  // Good - supports theme switching
  background: var(--c-bkg-card);
  color: var(--c-text-base);
  border-color: var(--c-border);

  // Bad - hardcoded colors
  // background: #ffffff;
  // color: #212529;
}
```

### Available CSS Variables

| Variable | Description |
|----------|-------------|
| `--c-bkg-body` | Body background |
| `--c-bkg-card` | Card/panel background |
| `--c-text-base` | Primary text color |
| `--c-text-muted` | Secondary text color |
| `--c-border` | Border color |
| `--c-primary` | Primary accent color |
| `--c-success` | Success state color |
| `--c-danger` | Error/danger color |
| `--c-warning` | Warning color |
| `--c-info` | Info color |

### Responding to Theme Changes

```javascript
import Theme from '../utils/theme';
import Events from '../utils/events';

class MyComponent {
  bindEvents() {
    Events.on(window, 'adminator:themeChanged', (e) => {
      const { theme } = e.detail; // 'light' or 'dark'
      this.updateForTheme(theme);
    });
  }

  updateForTheme(theme) {
    // Get theme-specific colors
    const colors = Theme.getChartColors();

    // Update canvas, SVG, or other non-CSS elements
    this.canvas.style.backgroundColor = colors.tooltipBg;
  }
}
```

---

## Event Handling

### Event Delegation (Preferred)

Use event delegation for better performance:

```javascript
import Events from '../utils/events';

// Instead of adding to each button:
// buttons.forEach(btn => btn.addEventListener('click', ...))

// Use delegation (single listener):
Events.delegate(container, 'click', '.btn', (e, btn) => {
  console.log('Button clicked:', btn.dataset.action);
});
```

### Cleanup Pattern

Always store cleanup functions and call them in `destroy()`:

```javascript
class MyComponent {
  constructor() {
    this.cleanupFunctions = [];
  }

  bindEvents() {
    // Events.on returns a cleanup function
    const cleanup1 = Events.on(this.element, 'click', this.handleClick);
    this.cleanupFunctions.push(cleanup1);

    const cleanup2 = Events.delegate(this.element, 'click', '.item', this.handleItem);
    this.cleanupFunctions.push(cleanup2);
  }

  destroy() {
    this.cleanupFunctions.forEach(fn => fn());
    this.cleanupFunctions = [];
  }
}
```

### Custom Events

Emit events for cross-component communication:

```javascript
import Events from '../utils/events';

// Emit an event
Events.emit(window, 'myComponent:action', {
  type: 'update',
  data: { id: 123 },
});

// Listen for events
Events.on(window, 'myComponent:action', (e) => {
  console.log(e.detail.type, e.detail.data);
});
```

---

## Mobile Considerations

### Check for Mobile

```javascript
isMobile() {
  return window.innerWidth <= 768;
}
```

### Touch-Friendly Interactions

- Minimum tap target: 44x44px
- Add hover states only on non-touch devices
- Consider swipe gestures for mobile

```scss
.my-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;

  // Hover only on devices that support it
  @media (hover: hover) {
    &:hover {
      background: var(--c-primary-hover);
    }
  }

  // Active state for touch
  &:active {
    background: var(--c-primary-active);
  }
}
```

### Responsive Events

Use `ResizeObserver` for responsive behavior:

```javascript
import Performance from '../utils/performance';

class MyComponent {
  init() {
    // React to element resize (more efficient than window.resize)
    this.resizeCleanup = Performance.onResize(this.element, ({ width }) => {
      this.updateLayout(width);
    });
  }

  destroy() {
    this.resizeCleanup?.();
  }
}
```

---

## Testing Components

### Create a Test File

Create `tests/components/MyComponent.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MyComponent from '../../src/assets/scripts/components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="my-component">
        <button class="action-button">Click</button>
      </div>
    `;
  });

  it('initializes when element exists', () => {
    const component = new MyComponent();
    expect(component.element).not.toBeNull();
  });

  it('handles action button clicks', () => {
    const component = new MyComponent();
    const handler = vi.spyOn(component, 'handleAction');

    document.querySelector('.action-button').click();

    expect(handler).toHaveBeenCalled();
  });

  it('cleans up on destroy', () => {
    const component = new MyComponent();
    component.destroy();

    expect(component.cleanupFunctions).toHaveLength(0);
  });
});
```

### Run Tests

```bash
npm test                    # Watch mode
npm run test:run           # Single run
npm run test:coverage      # With coverage
```

---

## Example: Complete Component

Here's a complete example of a notification component:

```javascript
/**
 * NotificationComponent - Toast notifications
 */

import { DOM } from '../utils/dom';
import Events from '../utils/events';
import Logger from '../utils/logger';

class NotificationComponent {
  constructor(options = {}) {
    this.options = {
      container: '.notification-container',
      duration: 5000,
      position: 'top-right',
      ...options,
    };

    this.container = DOM.select(this.options.container);
    this.notifications = new Map();
    this.cleanupFunctions = [];

    this.init();
  }

  init() {
    // Create container if missing
    if (!this.container) {
      this.container = DOM.create('div', {
        class: `notification-container notification-${this.options.position}`,
      });
      document.body.appendChild(this.container);
    }

    this.bindEvents();
    Logger.info('NotificationComponent initialized');
  }

  bindEvents() {
    // Delegate click events for close buttons
    const cleanup = Events.delegate(
      this.container,
      'click',
      '.notification-close',
      (e, btn) => {
        const notification = btn.closest('.notification');
        if (notification) {
          this.dismiss(notification.dataset.id);
        }
      }
    );
    this.cleanupFunctions.push(cleanup);
  }

  show(message, type = 'info') {
    const id = `notification-${Date.now()}`;

    const notification = DOM.create('div', {
      class: `notification notification-${type}`,
      'data-id': id,
    }, [
      DOM.create('span', { class: 'notification-message' }, [message]),
      DOM.create('button', {
        class: 'notification-close',
        'aria-label': 'Close notification',
      }, ['×']),
    ]);

    this.container.appendChild(notification);
    this.notifications.set(id, notification);

    // Auto-dismiss
    if (this.options.duration > 0) {
      setTimeout(() => this.dismiss(id), this.options.duration);
    }

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('notification-visible');
    });

    return id;
  }

  dismiss(id) {
    const notification = this.notifications.get(id);
    if (!notification) return;

    notification.classList.remove('notification-visible');
    notification.classList.add('notification-hiding');

    setTimeout(() => {
      notification.remove();
      this.notifications.delete(id);
    }, 300);
  }

  success(message) {
    return this.show(message, 'success');
  }

  error(message) {
    return this.show(message, 'error');
  }

  warning(message) {
    return this.show(message, 'warning');
  }

  destroy() {
    this.cleanupFunctions.forEach(fn => fn());
    this.notifications.clear();
    this.container?.remove();
    Logger.debug('NotificationComponent destroyed');
  }
}

export default NotificationComponent;
```

---

## Summary

When creating components:

1. **Follow the pattern** - Use the class structure with constructor, init, bindEvents, render, destroy
2. **Use utilities** - DOM, Events, Logger, Performance, Theme
3. **Support themes** - Use CSS variables, listen for theme changes
4. **Clean up** - Store and call cleanup functions in destroy()
5. **Test** - Write unit tests for your component
6. **Document** - Add JSDoc comments to all public methods

For questions or issues, see the main [README.md](../README.md) or open an issue on GitHub.
