# Changelog

## [4.1.5] - 2026-05-22

### Sidebar scroll + submenu clipping fix at rail widths

Follow-up to v4.1.4. At rail mode (721–1100px viewports), short-but-tall sidebars (e.g. 750×590) had two issues:

- The sidebar didn't scroll, so users on short viewports couldn't reach the lower nav items
- Submenu flyouts (Pages, Tables, Maps) were clipped when opened near the bottom of the viewport because the flyout was `position: absolute` inside an `overflow-y: visible` sidebar

Fix: switched the sidebar to `overflow-y: auto` at the 1100px breakpoint, and re-anchored the rail-mode submenu flyouts to `position: fixed` so they can escape the sidebar's scroll container and be shifted up by JS when opened near the viewport bottom.

### Docs site live

The new documentation site at [adminator.colorlib.com/docs/](https://adminator.colorlib.com/docs/) is now linked from the README's header row. Eight pages covering architecture, theming, charts, calendar/maps, page authoring, deployment, and migrating from v3.

### NPM publish

This is the first npm publish on the v4 line. Previous npm versions (2.7.x – 2.9.0) point to legacy code; do not install with `@^2` or `@^3` if you want the 2026 redesign. Always use `npm install adminator-admin-dashboard` (no version pin) or `npm install adminator-admin-dashboard@latest`.

## [4.1.4] - 2026-05-21

### Mobile sidebar drawer — submenu and scroll fixes

Two issues at ≤720px viewports, both caused by the 1100px rail-mode rules leaking through to mobile without proper overrides.

#### Submenu rendered as a right-hand flyout instead of expanding inline

When a child page was active (e.g. Pages → Blank), opening the mobile drawer showed the submenu as a floating card positioned to the right of the parent — the same `position: absolute; left: calc(100% + 10px)` styling intended for the 72px rail mode. The ≤720px block did `display: revert` on `.nav-submenu` but didn't reset the absolute positioning, background, or shadow, so the rail flyout styling carried over.

Fix: at ≤720px, reset `.nav-item-group` and `.nav-submenu` back to inline-accordion (static positioning, transparent background, no border/shadow, normal `margin-left: 20px`, max-height transition) — matching desktop behavior at ≥1101px.

Closes [#348](https://github.com/puikinsh/Adminator-admin-dashboard/issues/348).

#### Sidebar drawer couldn't scroll when content exceeded viewport

The rail-mode block sets `.d-sidebar { overflow-y: visible }` so flyout submenus can escape the sidebar bounds. The ≤720px block didn't restore `overflow-y: auto`, so on phones the drawer was a fixed-height non-scrolling container — bottom nav items (workspace footer, last sidebar entries) were unreachable when the screen was shorter than the menu.

Fix: at ≤720px, restore `overflow-y: auto` plus `overscroll-behavior: contain` so the drawer scrolls independently without bleeding scroll events into the locked page behind it.

Closes [#349](https://github.com/puikinsh/Adminator-admin-dashboard/issues/349).

## [4.1.3] - 2026-05-20

### Sidebar submenu fix at rail widths (721–1100px)

Parent nav items with children (Pages, Tables, Maps) didn't expand when the sidebar collapsed to its 72px icon rail. The responsive rule was hiding `.nav-submenu` entirely with `display: none`, so clicking the parent toggled `is-open` on an unreachable element. The chevron was hidden too, removing any affordance for the behavior.

The submenu now renders as a click-triggered flyout anchored to the right of the rail icon (200px wide, card background, dismisses on outside click, only one open at a time). Desktop inline expansion (>1100px) and the mobile drawer (≤720px) are unchanged.

Closes [#346](https://github.com/puikinsh/Adminator-admin-dashboard/issues/346).

### Dependency updates

- `eslint` family held at 9.x — `@babel/eslint-parser` doesn't yet support ESLint 10
- Bumped: `@babel/preset-env`, `@vitest/coverage-v8`, `globals`, `jsdom`, `playwright`, `postcss`, `postcss-preset-env`, `sass-loader` (16→17), `stylelint`, `vitest`, `webpack` 5.106→5.107
- Resolved 5 security advisories via `npm audit fix`:
  - `fast-uri` <3.1.1 — path traversal + host confusion (GHSA-q3j6-qgpj-74h6, GHSA-v39h-62p7-jpjc)
  - `ws` 8.0.0–8.20.0 — uninitialized memory disclosure (GHSA-58qx-3vcg-4xpx)
- 0 vulnerabilities reported by `npm audit`

## [4.1.2] - 2026-04-29

### Mobile layout fixes

The ≤720px viewport was effectively unusable: the entire app squeezed into a 0px-wide strip, the topbar overflowed, dropdowns ran off-screen, and the chat/auth pages still rendered their desktop split layouts. v4.1.2 makes the template actually work on a phone.

#### The shell collapse bug (root cause)

`_responsive.scss` switched the shell to `grid-template-columns: 0 1fr` at ≤720px so `.main` would fill the viewport while the sidebar became a position-fixed drawer. But making the sidebar `position: fixed` removes it from grid auto-placement, and the auto-placer dropped `.main` into the (now empty) column-1 — which is 0px wide. Result: a 0px main column, the topbar reduced to 24px, and the entire content strip rendered at zero width while the rest of the viewport sat blank.

Fix: collapse the shell to `display: block` at ≤720px so `.main` flows naturally below the off-grid drawer.

#### The source-order bug (chat / auth)

`_chat.scss` and `_auth.scss` defined responsive overrides like `.chat-rail { display: none }` inside an `@media (max-width: 720px)` block — *before* the rule that gives `.chat-rail` its default `display: flex`. CSS resolves equal-specificity conflicts by source order, so the later default rule won at every viewport, including mobile. The chat page rendered both the conversations rail and the chat pane stacked vertically; the auth pages kept the marketing aside even on phones.

Fix: moved chat (`max-width: 720px` + `1100px` overrides) and auth (`max-width: 900px` + `720px` overrides) media blocks into `_responsive.scss`, which is `@use`d last in `index.scss` so its rules win.

#### Topbar overcrowding

At 390px the topbar tried to fit hamburger + crumbs + 220px-wide search + 3 icon buttons + theme toggle + avatar. Now at ≤720px:

- Crumbs hide everything except the current page (with ellipsis if long)
- Search collapses from a 220px text button to a 36×36 icon button
- Action gap tightens from 6px to 2px
- Topbar padding drops from 32px to 12px

#### Dropdowns overflowing the viewport

Notification, message, and profile dropdowns had `min-width: 340px` — wider than a 320–375px viewport, so they clipped off-screen. Now constrained to `width: calc(100vw - 16px)` with sane max-widths.

#### Other missing rules

- `.sv-regions` (4-col → 1-col), `.wx-hero` and `.sales-summary` stacking, KPI grid full-width, hero actions wrap
- `.chart-canvas-wrap` min-height drops from 240px to 200px so charts breathe
- New `.table-scroll` wrapper utility — wrapping any `<table>` lets it scroll horizontally instead of overflowing the card
- Compose form's three inline `grid-template-columns: 64px 1fr` rows tagged with a `.compose-row` class so they collapse to a single column on mobile
- New ≤480px breakpoint for very narrow phones: monthly-footer 1-col, weather forecast 2-col, form actions full-width, social row stacked

#### Brand version

`Shell.js` brand tag and footer were still showing `v3.1` / `v3.1.0` from a pre-redesign snapshot — now match `package.json` (`v4.1.2`).

### Files touched

- `src/assets/styles/2026/_responsive.scss` — main rewrite (chat/auth/email/dashboard/topbar/dropdowns/tables consolidated here)
- `src/assets/styles/2026/_chat.scss`, `_auth.scss` — removed broken in-partial @media blocks
- `src/assets/styles/2026/_components.scss` — new `.table-scroll` utility
- `src/basic-table.html` — wrapped both tables in `.table-scroll`
- `src/compose.html` — added `.compose-row` class to three grid rows
- `src/assets/scripts/2026/Shell.js` — brand tag + footer version strings

### Verified

Lint clean (eslint 0/0, stylelint 0/0). Production build clean. Visual mobile verification (390×844 via CDP) on dashboard, email, calendar, charts, datatable, basic-table, compose, chat, forms, and signin — all render correctly.

---

## [4.1.1] - 2026-04-29

### Live preview migrated to R2

Adminator's live preview was on the legacy `colorlib.com/polygon/adminator/` path (manually maintained, was running an outdated v4.0.0 build). Migrated to the modern Cloudflare R2 hosting where the other 45 Colorlib templates live:

- **New preview URL:** <https://preview.colorlib.com/theme/adminator/>
- **New download URL:** <https://downloads.colorlib.com/theme/adminator.zip>

Now serves the v4.1.0 build (with the ⌘K palette and mobile drawer working). Future releases auto-update via the same `rclone sync` deploy.

### URL refactor

Updated 7 WP posts that linked to the old polygon URL:

- **Colorlib:** #34814 (35 Best Free Admin Dashboards), #374836 (20 Best Dark Admin Dashboards)
- **AdminLTE.io:** #322 (32 Best Free & Premium), #712 (18 Best HTML), #989 (26 Best Bootstrap Login Forms — sign-in URL), #4605 (20 Best E-Commerce), #1146 (25 Best Bootstrap 5)

Plus 25 local references across `scripts/`, `README.md`, `docs/`, and `docs/_config.yml`.

### No source changes

JS/CSS/HTML in `src/` are unchanged from v4.1.0. This is a deploy + URL maintenance release.

---

## [4.1.0] - 2026-04-28

### Three quality fixes for the v4 release

#### Command palette (⌘K / Ctrl+K)

The "⌘K" search button in the topbar now actually opens a real command palette. Previously it was decorative.

- Click the topbar search button, or press **⌘K / Ctrl+K** anywhere on the page, or press **/** when no input is focused
- Searches every page in the NAV manifest plus a few global actions (toggle theme, view docs, view repo)
- Keyboard navigation: ↑/↓ to move, Enter to select, Esc to close
- Case-insensitive substring + ranked matching (exact > prefix > substring)
- Closes on backdrop click, Esc, or selecting a result

New module: `src/assets/scripts/2026/palette.js`. New SCSS partial: `_palette.scss`. The `NAV` manifest in `Shell.js` is now exported so the palette can read it.

#### Mobile drawer

The sidebar previously collapsed to `display: none` under 720px viewport with no way to open it — mobile users couldn't navigate at all. Now:

- A hamburger button appears in the topbar at ≤720px (rendered by `Shell.js`)
- Clicking it slides the sidebar in from the left as an off-canvas drawer
- A semi-transparent backdrop appears behind the drawer
- Closes on backdrop click, Esc, or selecting a real navigation link
- Body scroll is locked while the drawer is open

Implementation: `_responsive.scss` rewrites the ≤720px sidebar from `display: none` to `position: fixed; transform: translateX(-100%)` with a `.has-drawer-open` body class as the trigger. `init.js` adds an `initMobileDrawer()` function that handles the toggle + auto-close behavior.

#### Test suite (75 tests)

v3 had 65 tests for utility modules that no longer exist. This release adds a fresh suite covering the v4 modules:

| Test file | Coverage |
|-----------|----------|
| `tests/shell.test.js` | NAV manifest validation, mountShell rendering, active state, breadcrumbs, hamburger + palette triggers, standalone-page no-op |
| `tests/init.test.js` | Theme toggle (icon swap, persistence, dark/light flip), hero date, nav groups, dropdowns (open/close/escape/exclusivity), todos, accordions, tab groups, mobile drawer (open/close/Esc/backdrop/auto-close-on-link) |
| `tests/palette.test.js` | open/close/isOpen, mounting (lazy + remount-after-detach), all triggers (button click, ⌘K, Ctrl+K, /), keyboard navigation (↑/↓ bounds), filtering (substring, case-insensitive, no-results), action execution (open external link, toggle theme) |
| `tests/charts-seeds.test.js` | SEEDS export, every seed function returns a valid Chart.js config and references the tokens it received (so theme changes flow through) |

Run with `npm run test:run` (one-shot) or `npm run test` (watch mode). Coverage report via `npm run test:coverage`.

### Bug fixes shaken out by tests

- **Palette listeners registered on every `initPalette()` call.** Multiple identical handlers fired per event, which cancelled out toggles (e.g. ⌘K to open then ⌘K to close). Added `_initialized` guard so listeners attach exactly once per page.
- **Palette cached stale DOM refs after `<body>` reset.** When `<body>` was wiped (e.g. between tests, or by user code), the cached `modal/input/resultsEl` references pointed to detached nodes. `ensureMounted()` now checks `document.contains(modal)` and re-mounts if needed.

### Other

- `vitest.config.js` updated to scope coverage to `src/assets/scripts/2026/**` and exclude the entry file
- `tests/setup.js` provides an in-memory localStorage mock (jsdom 29 ships without one) and a `matchMedia` stub

### Build size

Practically unchanged — the palette adds ~1.2 KB minified JS and ~1.1 KB minified CSS. Drawer adds <1 KB to JS, ~600 bytes to CSS. Test files don't ship.

---

## [4.0.1] - 2026-04-28

### Documentation rewrite

Full rewrite of the documentation site at <https://puikinsh.github.io/Adminator-admin-dashboard/> for the v4 architecture. Removes all v3-era references (Bootstrap, AdminatorApp, Sidebar component, Theme JS module, DOM/Events/Storage utility classes).

**New pages:**

- **Architecture** — page anatomy, Shell.js renderer, boot sequence
- **Components reference** — every UI primitive with markup (buttons, alerts, badges, forms, tabs, accordions, modals, dropdowns, tables)
- **Library integrations** — how Chart.js / FullCalendar / jsvectormap stay theme-aware
- **Pages reference** — what each of the 18 pages contains
- **Migration from v3** — full v3 → v4 mapping (CSS vars, classes, JS APIs)
- **Adding a new page** — three-step recipe

**Rewritten pages:**

- Home, Getting started flow (installation, project structure, development, production build)
- Token system (the new `_tokens.scss` reference replacing v3's CSS variable docs)
- JavaScript API reference (Shell.js, init.js, charts.js, calendar.js, maps.js)
- Practical recipes (replaces "Theme integration examples")
- Component dev guide (was COMPONENT_GUIDE.md)

Also publishes the content/listing scripts under `scripts/`:

- `screenshots-for-posts.mjs` — Playwright captures at exact target dimensions
- `publish-post-screenshots.mjs` — swaps existing post images and bumps publish dates
- `insert-adminator-listings.mjs` — inserts new entries into listicle posts
- `move-adminator-position.mjs` — reorders a listicle entry's position

And the `screenshots/posts/` library used by the publish pipeline.

No source changes — all 18 pages, the JS modules, and the SCSS partials are unchanged from v4.0.0. This is a documentation-only release.

---

## [4.0.0] - 2026-04-27

### The 2026 Redesign

A ground-up rewrite of the design system. New visual language, new shell architecture, dramatically smaller bundle. Every page redesigned. **Bootstrap dropped.** The legacy v3 architecture is preserved on the [`legacy-v3`](https://github.com/puikinsh/Adminator-admin-dashboard/tree/legacy-v3) branch for anyone who prefers the old look.

### Highlights

- **New design system, single source of truth.** All visual decisions live in `_tokens.scss` — colors, typography, spacing, shadows, all as CSS variables with light/dark variants. Change one variable, every component updates.
- **Token-driven dark mode.** No more dual stylesheets. Toggle `data-theme="dark"` on `<html>` and every component (including Chart.js, FullCalendar, jsvectormap) re-renders in the active theme.
- **Bootstrap removed.** All UI primitives are custom — buttons, dropdowns, tabs, modals, alerts, badges, progress bars, accordions. None of them depend on Bootstrap CSS or JS. The bundle is ~85% smaller as a result.
- **Single shell, rendered from a manifest.** `Shell.js` reads a `NAV` array and renders the sidebar, topbar, and footer for every page. Adding a nav item is one line; updating the workspace name updates 18 pages at once.
- **All 18 pages redesigned**: Dashboard, Email, Calendar, Chat, Compose, Charts, Forms, UI Elements, Buttons, Basic Table, Data Table, Google Maps, Vector Maps, Blank, Sign In, Sign Up, 404, 500.

### Bundle size

| Metric                     | v3.0.0           | v4.0.0           | Δ        |
| -------------------------- | ---------------- | ---------------- | -------- |
| Production JS (total)      | ~4.5 MB          | ~700 KB          | **−85%** |
| Production CSS             | ~280 KB          | 90 KB            | **−68%** |
| Webpack entries            | 1 (legacy)       | 1 (clean)        | —        |
| Webpack plugins/configs    | 7 files          | 7 files (cleaner)| —        |
| Top-level npm dependencies | 16               | 8                | **−50%** |

### Architecture changes

- **One JS entry**: `src/assets/scripts/2026/index.js`. Imports the SCSS bundle, mounts the shell, runs init.
- **One SCSS root**: `src/assets/styles/2026/index.scss`. 18 partials covering tokens, base, animations, shell, dropdowns, components, forms, UI, auth, error, chat, data, charts, dashboard, email, calendar, FullCalendar overrides, and responsive.
- **Page anatomy**: every shell page declares `<body data-active="..." data-crumbs="...">` and three placeholder divs. The shell renders around them. See [CLAUDE.md](CLAUDE.md) for the full pattern.
- **Real, themed library integrations**: Chart.js (6 chart types), FullCalendar (full month/week/day/agenda views with 24 seed events), jsvectormap (world map with markers). All read CSS variables and re-render on theme toggle via a `MutationObserver` on `data-theme`.

### Removed

- `bootstrap` (5.3.8) — not used anywhere in the new design
- `@popperjs/core` (2.11.8) — only needed by Bootstrap
- `dayjs` (1.11.20) — replaced by native `Intl.DateTimeFormat`
- `perfect-scrollbar` (1.5.6) — native scrollbars styled via CSS
- `masonry-layout` (4.2.2) — unused
- `load-google-maps-api` (2.0.2) — replaced with iframe embed
- `skycons` (1.0.0) — replaced with inline SVG weather icons
- `brand-colors` (2.1.1) — replaced by token system
- Legacy `src/assets/scripts/{app.js, components/, utils/, charts/, fullcalendar/, datatable/, ...}` — entire legacy JS tree
- Legacy `src/assets/styles/{spec/, vendor/, utils/, index.scss}` — entire legacy SCSS tree
- `tests/utils/` (3 test files) — they tested utils that no longer exist; new tests pending

### Migration guide

If you're upgrading an existing v3 project:

1. **Treat this as a rewrite, not a patch.** Class names, file paths, and JS APIs all changed.
2. **Custom theme work?** Move your color overrides from Bootstrap variables to `_tokens.scss`.
3. **Custom pages?** Adopt the new page anatomy (`data-active`, `data-crumbs`, three placeholder divs).
4. **Custom JS components?** The legacy `AdminatorApp` / `Sidebar` / `ChartComponent` classes are gone — port to the data-attribute driven pattern (see `init.js` for examples).
5. **Want to stay on v3?** Use the [`legacy-v3`](https://github.com/puikinsh/Adminator-admin-dashboard/tree/legacy-v3) branch — it's preserved indefinitely.

### Tooling

- ESLint 9 (flat config) — 0 errors, 0 warnings
- Stylelint 17 — 0 errors, 0 warnings
- Sass migrated from `@import` (deprecated) to `@use`
- Webpack 5 build still in place; **Vite migration planned for v4.1.0**

---

## [3.0.0] - 2026-01-13

### Major Architecture & Developer Experience Release

This release represents a comprehensive overhaul of the template's architecture, adding professional-grade utilities, testing infrastructure, security hardening, and optimized build configuration. This is the most developer-friendly release yet.

### Key Improvements

#### New Utility Modules
- **Events** (`src/assets/scripts/utils/events.js`) - Event delegation, debounce, throttle utilities
- **Performance** (`src/assets/scripts/utils/performance.js`) - ResizeObserver, IntersectionObserver, lazy loading
- **Storage** (`src/assets/scripts/utils/storage.js`) - Safe localStorage wrapper with in-memory fallback
- **Sanitize** (`src/assets/scripts/utils/sanitize.js`) - HTML/input sanitization for XSS prevention
- **Logger** (`src/assets/scripts/utils/logger.js`) - Development-only logging utility

#### Testing Infrastructure
- **Vitest** - Modern testing framework with fast execution
- **Coverage Reports** - V8-based code coverage via `npm run test:coverage`
- **JSDOM** - Browser environment simulation for DOM testing
- **Test Files** - Initial test suites for theme, DOM, and logger utilities

#### Build & Bundle Optimization
- **Code Splitting** - Separate chunks for Chart.js, FullCalendar, Bootstrap
- **Bundle Analyzer** - New `npm run build:analyze` command for visual bundle inspection
- **TerserPlugin** - Console/debugger removal in production builds
- **Runtime Chunk** - Extracted webpack runtime for better caching
- **Lodash Removed** - Replaced with custom Events utility (~70KB saved)

#### Documentation
- **API Reference** (`docs/API.md`) - Complete API documentation for all utilities
- **Component Guide** (`docs/COMPONENT_GUIDE.md`) - Development patterns and examples
- **Updated CLAUDE.md** - Enhanced project documentation

#### Code Quality
- **Removed Dead Code** - Deleted `app 2.js` and unused `sidebar/index.js`
- **HTML Accessibility** - Added `lang="en"` to all 18 HTML files
- **TypeScript Declarations** - Added `types/adminator.d.ts` for IDE support
- **JSConfig** - Enhanced IDE autocomplete via `jsconfig.json`
- **VSCode Settings** - Project-specific editor configuration

### Technical Details

**Removed Dependencies:**
- `lodash` (4.17.21) - Replaced with custom Events.debounce/throttle

**New Dev Dependencies:**
- `vitest` (4.0.17) - Testing framework
- `@vitest/coverage-v8` (4.0.17) - Coverage reporting
- `jsdom` (27.4.0) - DOM testing environment
- `webpack-bundle-analyzer` (5.1.1) - Bundle visualization

**Updated Dependencies:**
- All dependencies updated to latest versions
- Webpack 5.104.1 with code splitting configuration
- Full security audit with zero vulnerabilities

**Build Output (Code Splitting):**
| Chunk | Size |
|-------|------|
| runtime.js | 49.6 KB |
| vendor-fullcalendar.js | 654 KB |
| vendor-chartjs.js | 529 KB |
| vendors.js | 384 KB |
| main.js | 2.81 MB |

### New Scripts

```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Run tests with coverage
npm run build:analyze     # Build with bundle analyzer
```

### Files Added

**Utilities:**
- `src/assets/scripts/utils/events.js`
- `src/assets/scripts/utils/performance.js`
- `src/assets/scripts/utils/storage.js`
- `src/assets/scripts/utils/sanitize.js`
- `src/assets/scripts/utils/logger.js`

**Testing:**
- `vitest.config.js`
- `tests/setup.js`
- `tests/utils/theme.test.js`
- `tests/utils/dom.test.js`
- `tests/utils/logger.test.js`

**Documentation:**
- `docs/API.md`
- `docs/COMPONENT_GUIDE.md`

**IDE Support:**
- `types/adminator.d.ts`
- `jsconfig.json`
- `.vscode/settings.json`
- `.vscode/extensions.json`

### Files Removed
- `src/assets/scripts/app 2.js` (dead code)
- `src/assets/scripts/sidebar/index.js` (unused)

### Build Status
- Zero build errors
- Zero build warnings
- Zero security vulnerabilities
- JavaScript linting: 0 errors, 0 warnings
- SCSS linting: 0 errors, 0 warnings
- All tests passing

### Compatibility
- Node.js 14+ (tested with latest versions)
- All modern browsers supported
- Mobile-responsive functionality maintained
- Dark mode functionality preserved
- Full backward compatibility with v2.x

---

## [2.9.0] - 2025-12-02

### Comprehensive Dependency Updates & Linting Modernization

This release brings all dependencies to their absolute latest versions with enhanced SCSS linting support and zero security vulnerabilities.

### Key Improvements

#### All Dependencies Updated to Latest
- **Webpack 5.103.0** - Latest Webpack with performance improvements
- **ESLint 9.39.1** - Latest ESLint with modern flat configuration
- **Sass 1.94.2** - Latest Sass compiler with improved features
- **TypeScript 5.9.3** - Latest TypeScript compiler
- **Stylelint 16.26.1** - Latest SCSS/CSS linting
- **Chart.js 4.5.1** - Latest charting library with bug fixes
- **Day.js 1.11.19** - Latest date manipulation library

#### Enhanced SCSS Linting
- **Added stylelint-config-standard-scss** - Proper SCSS-specific linting support
- **Updated .stylelintrc.json** - Configured for SCSS syntax compatibility
- **Zero Linting Errors** - Both JavaScript and SCSS pass all checks

#### Security & Quality
- **Zero Security Vulnerabilities** - All dependencies audited and secure
- **Fixed node-forge vulnerabilities** - Updated to v1.3.2 (ASN.1 fixes)
- **Fixed js-yaml vulnerabilities** - Updated to v4.1.1/v3.14.2 (prototype pollution fixes)
- **Clean Build Output** - No errors or warnings in production build

### Technical Details

**Major Dependencies Updated:**
- @babel/core: 7.28.3 → 7.28.5
- @babel/eslint-parser: 7.28.0 → 7.28.5
- @babel/preset-env: 7.28.3 → 7.28.5
- @babel/runtime: 7.28.3 → 7.28.4
- @eslint/js: 9.34.0 → 9.39.1
- @typescript-eslint/eslint-plugin: 8.42.0 → 8.48.1
- @typescript-eslint/parser: 8.42.0 → 8.48.1
- chart.js: 4.5.0 → 4.5.1
- cross-env: 10.0.0 → 10.1.0
- dayjs: 1.11.18 → 1.11.19
- eslint: 9.34.0 → 9.39.1
- globals: 16.3.0 → 16.5.0
- html-webpack-plugin: 5.6.4 → 5.6.5
- jsvectormap: 1.6.0 → 1.7.0
- postcss-preset-env: 10.3.1 → 10.4.0
- sass: 1.92.0 → 1.94.2
- sass-loader: 16.0.5 → 16.0.6
- stylelint: 16.23.1 → 16.26.1
- stylelint-config-standard: 38.0.0 → 39.0.1
- typescript: 5.9.2 → 5.9.3
- webpack: 5.101.3 → 5.103.0

**New Dependencies:**
- stylelint-config-standard-scss: 16.0.0 - SCSS-specific linting rules

**Build Tools Updated:**
- copy-webpack-plugin: 13.0.0 → 13.0.1
- mini-css-extract-plugin: 2.9.3 → 2.9.4
- postcss-loader: 8.1.1 → 8.2.0

### Build Status
- Zero build errors
- Zero build warnings
- Zero security vulnerabilities
- JavaScript linting: 0 errors, 0 warnings
- SCSS linting: 0 errors, 0 warnings
- Production build: Compiled successfully

### Compatibility
- Node.js 14+ (tested with latest versions)
- All modern browsers supported
- Mobile-responsive functionality maintained
- Dark mode functionality preserved

---

## [2.8.1] - 2025-09-03

### Latest Dependency Updates & Security Enhancements

This release brings all dependencies up to their latest stable versions, focusing on Bootstrap 5.3.8 upgrade, enhanced security, and improved development tooling for optimal performance and maintainability.

### Key Improvements

#### Framework & Core Updates
- **Bootstrap 5.3.8** - Updated from 5.3.7 with latest bug fixes and improvements
- **Webpack 5.101.3** - Latest Webpack with enhanced performance optimizations
- **ESLint 9.34.0** - Updated to latest ESLint with modern flat configuration support
- **Sass 1.92.0** - Latest Sass compiler with improved performance and features
- **Day.js 1.11.18** - Updated lightweight date manipulation library

#### Development & Build Tools
- **TypeScript ESLint Support** - Added TypeScript 5.9.2 and @typescript-eslint packages for enhanced code quality
- **Modern ESLint Configuration** - Created comprehensive tsconfig.json for TypeScript ESLint integration
- **Zero JavaScript Linting Errors** - Fixed all ESLint issues in webpack configuration files
- **Enhanced Development Experience** - Improved hot module replacement and build performance

#### Security & Quality
- **Zero Security Vulnerabilities** - All dependencies updated with comprehensive security audit
- **jsvectormap 1.7.0** - Updated vector map library with latest features and improvements
- **Build System Optimization** - Improved webpack configuration with proper trailing commas and code style
- **Development Server Enhancements** - Stable development server with hot reload functionality

### Technical Details

**Major Dependencies Updated:**
- bootstrap: 5.3.7 → 5.3.8
- webpack: 5.101.0 → 5.101.3
- eslint: 9.33.0 → 9.34.0
- sass: 1.90.0 → 1.92.0
- dayjs: 1.11.13 → 1.11.18
- jsvectormap: 1.6.0 → 1.7.0
- @eslint/js: 9.33.0 → 9.34.0

**Build Tools Updated:**
- @babel/core: 7.28.0 → 7.28.3
- @babel/runtime: 7.28.2 → 7.28.3
- copy-webpack-plugin: 13.0.0 → 13.0.1
- html-webpack-plugin: 5.6.3 → 5.6.4
- mini-css-extract-plugin: 2.9.3 → 2.9.4
- postcss-loader: 8.1.1 → 8.2.0
- postcss-preset-env: 10.2.4 → 10.3.1

**New Additions:**
- @typescript-eslint/parser: 8.42.0 - TypeScript ESLint parser support
- @typescript-eslint/eslint-plugin: 8.42.0 - TypeScript ESLint rules
- typescript: 5.9.2 - TypeScript compiler for enhanced development

### Build Status
- Zero build errors
- Zero build warnings
- Zero security vulnerabilities
- JavaScript linting: 0 errors, 0 warnings
- Development server: Running successfully
- Hot module replacement: Functional

### Compatibility
- Node.js 14+ (tested with latest versions)
- All modern browsers supported
- Mobile-responsive functionality maintained
- Dark mode functionality preserved

## [2.8.0] - 2025-08-11

### Dependency Modernization & Security Updates

This release focuses on modernizing the build system, updating dependencies to their latest stable versions, and removing deprecated packages to ensure better security and performance.

### Key Improvements

#### Build System Enhancements
- **Replaced deprecated file-loader with Webpack 5 native asset modules** - Modernized asset handling using Webpack 5's built-in capabilities
- **Moved @babel/runtime to production dependencies** - Properly configured runtime dependencies for production builds
- **Fixed all import/export warnings** - Resolved module resolution issues for cleaner builds

#### Major Dependency Updates
- **Upgraded cross-env from v7 to v10** - Latest version with ESM support and TypeScript improvements
- **Updated all Babel packages to v7.28.0** - Latest stable Babel 7 release
- **Updated TypeScript to v5.9.2** - Latest TypeScript with improved type checking
- **Updated Webpack to v5.101.0** - Latest Webpack 5 with performance improvements
- **Updated ESLint to v9.33.0** - Latest ESLint with new rules and fixes

#### Security & Maintenance
- Updated all FullCalendar components to v6.1.19
- Updated all development dependencies to latest stable versions
- Removed non-existent test.html reference from build configuration
- Fixed stylelint configuration compatibility issues

### Technical Details

**Removed Deprecated Packages:**
- `file-loader` - Replaced with Webpack 5 asset/resource modules

**Updated Dependencies:**
- @babel/core: 7.27.4 → 7.28.0
- @babel/runtime: 7.27.6 → 7.28.2 (moved to production dependencies)
- @eslint/js: 9.29.0 → 9.33.0
- @typescript-eslint/eslint-plugin: 8.36.0 → 8.39.0
- @typescript-eslint/parser: 8.36.0 → 8.39.0
- @fullcalendar/*: 6.1.17 → 6.1.19 (all packages)
- cross-env: 7.0.3 → 10.0.0
- eslint: 9.29.0 → 9.33.0
- typescript: 5.8.3 → 5.9.2
- webpack: 5.99.9 → 5.101.0
- And various other minor updates

### Build Status
- Zero build errors
- Zero build warnings
- All linting rules pass successfully
- Production build size remains optimized

## [2.7.1] - 2025-07-10

### Bug Fixes & Improvements
- Minor version bump with maintenance updates
- Enhanced code quality and stability improvements
- Updated documentation and changelog formatting

## [2.7.0] - 2025-07-09

### jQuery-Free Release + NPM Package Publication

This release represents a **major performance milestone** - complete removal of jQuery dependency and all jQuery-based plugins, resulting in a modern, lightweight, and significantly faster admin template.

### NPM Package Available

**Adminator is now available as an npm package!**

```bash
# Install via npm
npm install adminator-admin-dashboard

# Or install via yarn  
yarn add adminator-admin-dashboard
```

**Package Information:**
- **Package Name**: `adminator-admin-dashboard`
- **Registry**: https://www.npmjs.com/package/adminator-admin-dashboard
- **Size**: 5.7 MB (includes complete source + built assets)
- **Contents**: Source code, production builds, documentation, and all dependencies

**What's included:**
- Complete source code (`src/` directory)
- Pre-built production assets (`dist/` directory)  
- All dependencies and development tools
- Comprehensive documentation (CLAUDE.md, CHANGELOG.md)
- Ready-to-use HTML templates

**Usage:**
```bash
# After installation, navigate to package directory
cd node_modules/adminator-admin-dashboard

# Install dev dependencies for customization
npm install

# Start development server
npm start
```

This release represents a **major performance milestone** - complete removal of jQuery dependency and all jQuery-based plugins, resulting in a modern, lightweight, and significantly faster admin template.

### Performance Improvements

**Bundle Size Reduction:**
- **~600KB Reduction**: Complete elimination of jQuery and jQuery-dependent plugins
- **Faster Load Times**: Native DOM manipulation for optimal performance
- **Modern Architecture**: ES6+ class-based components with zero legacy overhead

**Removed jQuery Dependencies:**
- `jquery` (3.7.1) - Replaced with vanilla JS DOM manipulation
- `jquery-sparkline` (2.4.0) - Replaced with Chart.js mini charts
- `bootstrap-datepicker` (1.10.0) - Replaced with HTML5 date inputs + vanilla JS
- `datatables` (1.10.18) - Replaced with vanilla JS table component
- `easy-pie-chart` (2.1.7) - Replaced with vanilla JS SVG pie charts
- `jvectormap` (2.0.4) - Replaced with vanilla JS SVG world map

### Modern JavaScript Implementations

**100% Vanilla JavaScript Architecture:**
- **Component System**: Modern class-based components (Sidebar, Charts, etc.)
- **DOM Utilities**: jQuery-like functionality using native JavaScript (`src/assets/scripts/utils/dom.js`)
- **Event Management**: Native event handling with modern delegation patterns
- **Mobile Optimization**: Touch-friendly interactions without jQuery overhead

**Feature-Complete Replacements:**

**Charts & Visualizations:**
- **Chart.js Sparklines**: Mini charts with full theme support and better performance
- **SVG Pie Charts**: Custom circular progress indicators with animations
- **Enhanced Line Charts**: Interactive charts with tooltip support and responsive design

**Interactive Components:**
- **Vanilla DataTables**: Full-featured table with sorting, pagination, and search
- **HTML5 Date Pickers**: Enhanced native date inputs with Day.js integration
- **Vector Maps**: JavaScript-based world map with markers and theme support
- **Sidebar Navigation**: Smooth animations and touch-friendly mobile interactions

**UI Enhancements:**
- **Mobile Search**: Full-width search overlay with enhanced touch experience
- **Dropdown Management**: Improved mobile dropdown behavior with overlay handling
- **Responsive Design**: Better mobile viewport handling and gesture support

### Technical Achievements

**Architecture Modernization:**
- **ES6+ Classes**: Modern component architecture replacing jQuery plugins
- **Module System**: ES6 import/export for better code organization
- **Type Safety**: Enhanced error handling and parameter validation
- **Performance**: Eliminated jQuery overhead and improved runtime efficiency

**Theme Integration:**
- **Dark Mode Support**: All new components fully support light/dark theme switching
- **CSS Variables**: Component styling integrated with existing theme system
- **Consistent Design**: Maintained visual consistency while improving performance

**Developer Experience:**
- **Clean Console**: Removed all development console notices and debugging output
- **ESLint Compliance**: All code follows modern ESLint 9.x flat config standards
- **Maintainable Code**: Well-documented, modular architecture for future enhancements

### Zero Breaking Changes

**Seamless Migration:**
- **Visual Consistency**: All components maintain identical visual appearance
- **API Compatibility**: Existing functionality preserved with better performance
- **Theme Support**: Full compatibility with existing dark/light mode system
- **Mobile Experience**: Enhanced mobile interactions with no breaking changes

### Component Improvements

**Enhanced Functionality:**
- **Charts**: Better responsiveness and theme integration
- **Tables**: Improved sorting and pagination performance
- **Date Pickers**: Enhanced mobile experience with native HTML5 inputs
- **Maps**: Better rendering performance and theme consistency
- **Navigation**: Smoother animations and better touch handling

### Code Quality

**Production Ready:**
- **Clean Output**: No console debugging statements in production code
- **Linting**: All JavaScript files pass ESLint 9.x with modern standards
- **Performance**: Optimized for speed with minimal DOM manipulation
- **Accessibility**: Maintained accessibility features without jQuery dependencies

### Files Modified

**Core Application:**
- `src/assets/scripts/app.js` - Complete jQuery removal and modern component integration
- `src/assets/scripts/components/Sidebar.js` - Vanilla JS sidebar with animations
- `src/assets/scripts/components/Chart.js` - Chart.js implementation replacing jQuery Sparkline
- `src/assets/scripts/utils/dom.js` - jQuery-like utilities using vanilla JavaScript

**New Implementations:**
- Enhanced mobile search functionality
- Vanilla JavaScript data table component  
- HTML5 date picker enhancements
- SVG-based vector maps
- Modern dropdown and popover handling

### Migration Notes

**Automatic Migration:**
- No code changes required for existing projects
- All functionality automatically upgraded to vanilla JavaScript
- Theme system remains fully compatible
- Mobile experience enhanced without breaking changes

**Performance Benefits:**
- Immediate ~600KB bundle size reduction
- Faster initial page load
- Improved runtime performance
- Better mobile experience

## [2.6.1] - 2025-07-26

### Dependency Updates
- Updated `bootstrap` 5.3.6 → 5.3.7
- Updated `postcss` 8.5.5 → 8.5.6
- Updated `stylelint` 16.20.0 → 16.21.0

## [2.6.0] - 2025-06-21

### Dark Mode Release

This release introduces a comprehensive dark mode system with seamless theme switching and component integration.

### New Features

**Complete Dark Mode System:**
- **Smart Theme Toggle**: Bootstrap-based switch with sun/moon icons and "Light/Dark" labels
- **OS Preference Detection**: Automatically detects and applies user's preferred color scheme
- **Persistent Theme Storage**: Remembers user's theme choice across sessions
- **Instant Theme Switching**: Real-time theme updates without page reload

**Theme-Aware Components:**
- **Chart.js Integration**: Dynamic color schemes for all chart types with proper contrast
- **FullCalendar Support**: Dark-mode aware calendar with proper border and text colors
- **Vector Maps**: Custom color palettes for both light and dark themes
- **Google Maps**: Theme-specific styling for landscapes, highways, and POI markers
- **Sparkline Charts**: Optimized color sets for dark mode visibility
- **Skycons Weather Icons**: Adaptive colors for better dark mode contrast

**CSS Architecture:**
- **CSS Custom Properties**: Comprehensive variable system for consistent theming
- **Semantic Color Naming**: Intuitive color variables (--c-text-base, --c-bkg-card, etc.)
- **Component Isolation**: Each component respects global theme variables
- **Responsive Design**: Theme switching works seamlessly across all screen sizes

**Visual Enhancements:**
- **Adaptive Logo**: SVG logo automatically adjusts colors based on theme
- **Smart Contrast**: Proper text/background contrast ratios in both themes
- **Border Consistency**: Unified border colors throughout the interface
- **Loading States**: Theme-aware loaders and progress indicators

### Technical Improvements

**Architecture Updates:**
- **Theme Utility Module**: New `src/assets/scripts/utils/theme.js` with comprehensive theme management
- **CSS Variables File**: New `src/assets/styles/utils/theme.css` with light/dark color schemes
- **Component Integration**: Updated all major components to support theme switching
- **Event System**: Custom events for theme change notifications

**Performance Optimizations:**
- **Efficient Switching**: Minimal DOM manipulation for theme changes
- **CSS Variable Updates**: Leverages browser-native CSS custom properties
- **Memory Management**: Proper cleanup of theme-related event listeners
- **Build Integration**: Theme assets are properly bundled and optimized

### User Experience

**Intuitive Controls:**
- **Accessible Toggle**: Proper ARIA labels and keyboard navigation support
- **Visual Feedback**: Clear indication of current theme state
- **Smooth Transitions**: CSS transitions for theme switching (where appropriate)
- **Consistent Placement**: Theme toggle integrated into header navigation

**Smart Behavior:**
- **First-Time Detection**: Respects OS dark mode preference on first visit
- **Cross-Session Persistence**: Theme choice remembered across browser sessions
- **Fallback Handling**: Graceful degradation when localStorage is unavailable
- **Dynamic Updates**: All components update immediately when theme changes

### Development Experience

**Documentation:**
- **Theme API**: Comprehensive methods for theme management
- **Color Guidelines**: Standardized color usage across components
- **Component Examples**: Updated examples showing theme-aware components
- **Migration Guide**: Instructions for theme integration in custom components

### Enhanced Components

**Charts & Data Visualization:**
- Chart.js with dynamic color schemes
- Sparkline charts with theme-optimized colors
- Easy Pie Charts with adaptive styling
- Vector maps with custom dark mode palettes

**Interactive Elements:**
- FullCalendar with proper dark mode borders
- DataTables with theme-consistent styling  
- Date pickers with adaptive colors
- Form elements with dark mode support

**Maps & Location:**
- Google Maps with custom dark mode styling
- Vector maps with region-specific color schemes
- Marker and overlay theme integration

### Breaking Changes

None. This release is fully backward compatible.

### Migration Guide

Existing projects will automatically inherit dark mode capabilities. No code changes required.

**Optional Enhancements:**
- Add `data-theme` attribute handling for custom components
- Use CSS variables from `theme.css` for consistent coloring
- Listen for `adminator:themeChanged` events for custom theme handling

### Files Added/Modified

**New Files:**
- `src/assets/scripts/utils/theme.js` - Theme management utility
- `src/assets/styles/utils/theme.css` - CSS variables and color schemes

**Enhanced Files:**
- All HTML pages updated with theme-aware components
- Component JavaScript files updated for theme integration
- SCSS files enhanced with CSS variable usage
- Logo SVG updated for theme compatibility

## [2.5.0] - 2025-06-16

### Major Modernization Release

This release represents a comprehensive modernization of the entire build toolchain and development stack.

### Dependency Updates

**Phase 1 - Safe Updates:**
- Updated `chart.js` 4.4.2 → 4.5.0
- Updated `shx` 0.3.3 → 0.4.0  
- Added `eslint-formatter-table` for better linting output

**Phase 2 - Moderate Updates:**
- Updated `sass-loader` 14.2.1 → 16.0.5
- Updated `postcss-preset-env` 9.6.0 → 10.2.3
- Updated `stylelint-config-standard` 36.0.1 → 38.0.0
- Fixed `stylelint` command syntax for latest version

**Phase 3 - Major Breaking Changes:**
- Updated `copy-webpack-plugin` 12.0.2 → 13.0.0
- Updated `babel-loader` 9.2.1 → 10.0.0
- Updated `webpack-cli` 5.1.4 → 6.0.1
- Updated `eslint` 8.57.1 → 9.29.0

**Latest Dependencies Update:**
- Updated all Babel packages to v7.27.x
- Updated FullCalendar packages to v6.1.17
- Updated Bootstrap to v5.3.6
- Updated webpack ecosystem (webpack 5.99.9, webpack-dev-server 5.2.2)
- Updated PostCSS to v8.5.5
- Updated Sass to v1.89.2
- Updated Stylelint to v16.20.0
- Plus 22 total dependency updates

### Configuration Changes

**ESLint 9.x Migration:**
- Migrated from `.eslintrc.json` to `eslint.config.mjs` (flat config)
- Removed incompatible `eslint-config-airbnb-base` and `eslint-plugin-import`
- Created modern ESLint configuration with equivalent rules
- Updated line endings for cross-platform compatibility

**Build System Improvements:**
- Enhanced webpack configuration compatibility
- Improved CSS processing pipeline
- Better development server performance

**Package Management:**
- Fixed `package.json` to reflect exact installed dependency versions
- Removed incompatible ESLint packages from dependencies
- Ensured version alignment between installed and declared packages

**Phase 5.1 - Date Library Migration:**
- **REMOVED** `moment` 2.30.1 (67KB) - unused legacy dependency
- **ADDED** `dayjs` 1.11.13 (2KB) - modern 97% smaller alternative
- Created comprehensive `DateUtils` module with modern date handling
- Updated FullCalendar to use Day.js for dynamic date generation
- Enhanced date picker functionality with Day.js validation
- Bundle size reduction: ~65KB saved
- Zero breaking changes - Day.js provides same API coverage

### Development Experience

- **Node.js Support**: Now requires Node.js 18.12.0+ (compatible with v23.11.0)
- **Modern tooling**: All dependencies updated to latest stable versions
- **Zero security vulnerabilities**: Complete security audit clean
- **Improved performance**: Faster builds and development server
- **Better linting**: Modern ESLint 9.x with flat config
- **Enhanced CSS**: Latest PostCSS and Sass versions

### Security & Quality

- All dependencies audited and updated to latest secure versions
- Zero known security vulnerabilities
- Modern linting rules for better code quality
- Updated copyright notices to 2025

### Documentation

- Updated README with modern setup instructions
- Enhanced development workflow documentation
- Added comprehensive changelog entries

### Breaking Changes

- **Node.js**: Minimum version now 18.12.0
- **ESLint**: Configuration format changed from eslintrc to flat config
- **Development**: Some webpack-cli commands removed (init, loader, plugin)

### Migration Guide

For projects upgrading from v2.1.0:
1. Ensure Node.js version is 18.12.0 or higher
2. Run `npm install` to get updated dependencies
3. ESLint configuration is automatically updated
4. No code changes required for existing projects

## [2.1.0]
- Upgraded all dependencies

## [2.0.0]

### Changed
- Upgrade to Bootstrap 5

## [1.1.0]

### Changed
- Upgrade to webpack 5

## [1.0.0]

### Added
- Intial release
