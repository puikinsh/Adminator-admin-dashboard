# Adminator API Reference

Complete API documentation for Adminator utilities and components.

## Table of Contents

- [DOM Utilities](#dom-utilities)
- [Theme Manager](#theme-manager)
- [Events Utilities](#events-utilities)
- [Performance Utilities](#performance-utilities)
- [Logger](#logger)
- [Date Utilities](#date-utilities)
- [Custom Events](#custom-events)

---

## DOM Utilities

jQuery-like DOM manipulation using vanilla JavaScript.

```javascript
import { DOM } from './utils/dom';
```

### Selection

#### `DOM.select(selector, context?)`

Select a single element.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| selector | string | - | CSS selector |
| context | Element | document | Context to search within |

**Returns:** `Element | null`

```javascript
const header = DOM.select('.header');
const navItem = DOM.select('.nav-item', sidebar);
```

#### `DOM.selectAll(selector, context?)`

Select all matching elements.

**Returns:** `Element[]`

```javascript
const buttons = DOM.selectAll('.btn');
buttons.forEach(btn => console.log(btn));
```

#### `DOM.exists(selector)`

Check if element exists.

**Returns:** `boolean`

```javascript
if (DOM.exists('.sidebar')) {
  initSidebar();
}
```

### Events

#### `DOM.on(element, event, handler, options?)`

Add event listener.

```javascript
DOM.on('.btn', 'click', handleClick);
DOM.on(button, 'click', handleClick, { once: true });
```

#### `DOM.off(element, event, handler)`

Remove event listener.

```javascript
DOM.off(button, 'click', handleClick);
```

### Classes

#### `DOM.addClass(element, className)`

```javascript
DOM.addClass('.menu', 'open');
```

#### `DOM.removeClass(element, className)`

```javascript
DOM.removeClass('.menu', 'open');
```

#### `DOM.toggleClass(element, className)`

```javascript
DOM.toggleClass('.dropdown', 'show');
```

#### `DOM.hasClass(element, className)`

**Returns:** `boolean`

```javascript
if (DOM.hasClass('.menu', 'open')) {
  closeMenu();
}
```

### Attributes

#### `DOM.attr(element, name, value?)`

Get or set attribute.

```javascript
// Get
const href = DOM.attr(link, 'href');

// Set
DOM.attr(link, 'href', '/new-page');
```

#### `DOM.data(element, name, value?)`

Get or set data attribute.

```javascript
// Get data-id
const id = DOM.data(row, 'id');

// Set data-id
DOM.data(row, 'id', '123');
```

### Animations

#### `DOM.slideUp(element, duration?)`

**Returns:** `Promise<void>`

```javascript
await DOM.slideUp('.panel', 300);
```

#### `DOM.slideDown(element, duration?)`

**Returns:** `Promise<void>`

```javascript
await DOM.slideDown('.panel', 300);
```

#### `DOM.fadeIn(element, duration?)`

**Returns:** `Promise<void>`

```javascript
await DOM.fadeIn('.modal', 200);
```

#### `DOM.fadeOut(element, duration?)`

**Returns:** `Promise<void>`

```javascript
await DOM.fadeOut('.modal', 200);
```

### Utilities

#### `DOM.dimensions(element)`

Get element dimensions.

**Returns:** `{ width, height, top, left, bottom, right } | null`

```javascript
const { width, height } = DOM.dimensions('.card');
```

#### `DOM.ready(callback)`

Execute when DOM is ready.

```javascript
DOM.ready(() => {
  initApp();
});
```

#### `DOM.create(tag, attrs?, children?)`

Create an element.

```javascript
const button = DOM.create('button', {
  class: 'btn btn-primary',
  type: 'submit',
}, ['Submit']);
```

---

## Theme Manager

Light/dark mode switching with persistence.

```javascript
import Theme from './utils/theme';
```

### Methods

#### `Theme.init()`

Initialize theme system. Detects OS preference on first visit.

**Returns:** `'light' | 'dark'`

#### `Theme.apply(theme)`

Apply a theme ('light' or 'dark').

**Returns:** `boolean`

```javascript
Theme.apply('dark');
```

#### `Theme.toggle()`

Toggle between light and dark.

**Returns:** `'light' | 'dark'` - The new theme

```javascript
const newTheme = Theme.toggle();
```

#### `Theme.current()`

Get current theme.

**Returns:** `'light' | 'dark'`

#### `Theme.isDark()` / `Theme.isLight()`

Check current theme state.

**Returns:** `boolean`

#### `Theme.getCSSVar(varName)`

Get a CSS variable value.

```javascript
const bgColor = Theme.getCSSVar('--c-bkg-body');
```

#### `Theme.getChartColors()`

Get theme-aware Chart.js colors.

**Returns:** `{ textColor, mutedColor, borderColor, gridColor, tooltipBg }`

---

## Events Utilities

Efficient event handling with delegation and cleanup.

```javascript
import Events from './utils/events';
```

### Methods

#### `Events.on(element, event, handler, options?)`

Add event listener with cleanup support.

**Returns:** `Function` - Cleanup function

```javascript
const cleanup = Events.on(button, 'click', handleClick);
// Later: cleanup();
```

#### `Events.delegate(parent, event, selector, handler, options?)`

Event delegation - single listener for many elements.

**Returns:** `Function` - Cleanup function

```javascript
Events.delegate(document, 'click', '.btn', (e, btn) => {
  console.log('Clicked:', btn);
});
```

#### `Events.once(element, event, handler)`

One-time event listener.

#### `Events.debounce(handler, delay?)`

Create debounced handler (default: 250ms).

```javascript
const debouncedSearch = Events.debounce(search, 300);
```

#### `Events.throttle(handler, limit?)`

Create throttled handler (default: 250ms).

```javascript
const throttledScroll = Events.throttle(onScroll, 100);
```

#### `Events.emit(target, eventName, detail?, options?)`

Dispatch a custom event.

```javascript
Events.emit(window, 'myapp:action', { type: 'save' });
```

---

## Performance Utilities

ResizeObserver, IntersectionObserver, and optimization utilities.

```javascript
import Performance from './utils/performance';
```

### Methods

#### `Performance.onResize(element, callback)`

Observe element resize.

**Returns:** `Function` - Cleanup function

```javascript
const unobserve = Performance.onResize(chart, ({ width, height }) => {
  chart.resize(width, height);
});
```

#### `Performance.onVisible(element, callback, options?)`

Observe when element enters viewport.

```javascript
Performance.onVisible(element, ({ isIntersecting }) => {
  if (isIntersecting) loadContent();
});
```

#### `Performance.lazyLoad(element, loadFn, options?)`

Lazy load when element becomes visible.

```javascript
Performance.lazyLoad(chartContainer, () => initChart());
```

#### `Performance.batch(readFn, writeFn)`

Batch DOM reads and writes.

#### `Performance.nextFrame(callback)`

Execute on next animation frame.

#### `Performance.whenIdle(callback, options?)`

Execute when browser is idle.

#### `Performance.preload(url, as?)`

Preload a resource.

```javascript
await Performance.preload('/images/hero.jpg', 'image');
```

#### `Performance.cleanup()`

Cleanup all observers.

---

## Logger

Development-only logging utility.

```javascript
import Logger from './utils/logger';
```

All methods are no-ops in production.

### Methods

```javascript
Logger.info('Message', { context });
Logger.warn('Warning', { context });
Logger.error('Error', error);
Logger.debug('Debug info', { data });

Logger.group('Group Name');
Logger.groupEnd();

Logger.time('operation');
Logger.timeEnd('operation');

Logger.table(arrayOfObjects);
```

---

## Date Utilities

Date handling using Day.js.

```javascript
import DateUtils from './utils/date';
```

### Methods

```javascript
DateUtils.now()                    // Current date
DateUtils.format.short(date)       // "Jan 15, 2024"
DateUtils.format.long(date)        // "January 15, 2024"
DateUtils.format.time(date)        // "2:30 PM"
DateUtils.format.relative(date)    // "2 hours ago"

DateUtils.form.toInputValue(date)  // HTML date input format
DateUtils.form.fromInputValue(str) // Parse HTML date input

DateUtils.compare.isBefore(d1, d2)
DateUtils.compare.isAfter(d1, d2)
DateUtils.compare.isSame(d1, d2)
```

---

## Custom Events

### `adminator:ready`

Fired when app is fully initialized.

```javascript
window.addEventListener('adminator:ready', (e) => {
  const { app } = e.detail;
});
```

### `adminator:themeChanged`

Fired when theme changes.

```javascript
window.addEventListener('adminator:themeChanged', (e) => {
  const { theme } = e.detail; // 'light' or 'dark'
});
```

---

## TypeScript Support

TypeScript declarations are available in `types/adminator.d.ts`.

```javascript
import Theme from './utils/theme';
Theme.apply('dark'); // Autocomplete works
```

---

## Import Patterns

```javascript
// Individual (recommended)
import { DOM } from './utils/dom';
import Theme from './utils/theme';

// Barrel import
import { DOM, Theme, Events, Performance, Logger } from './utils';
```
