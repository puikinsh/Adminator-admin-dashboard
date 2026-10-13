# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture (2026 redesign)

This is the **Adminator 2026** template — a vanilla-JS admin dashboard with a token-driven CSS-variable design system. There is **one** entry bundle, **one** stylesheet root, **one** shell renderer.

- No jQuery. No Bootstrap. No legacy admin.js / Sidebar component.
- Theme (light/dark) is a `data-theme` attribute on `<html>`, set by an early-paint script in each page and toggled at runtime via `init.js`.
- Sidebar, topbar, and footer are rendered by `Shell.js` from a single `NAV` manifest. Pages provide three placeholder divs (`data-shell-sidebar`, `data-shell-topbar`, `data-shell-footer`) plus `<body data-active="..." data-crumbs="...">`.
- Heavy widgets: real **Chart.js** (`charts.js`), real **FullCalendar** (`calendar.js`), real **jsvectormap** (`maps.js`). All three read CSS variables at render and re-render on theme toggle via a `MutationObserver` on `data-theme`.
- **All three are lazy-loaded** via `import()`. Each `init*()` checks for its mount point and returns *before* the import when the page has no such element, so a page only downloads the library it actually uses. Every page's initial payload is `runtime.js` + `2026.js` + `style.css` (~130 KB raw / ~28 KB gzip) and nothing else.
- **No Babel.** webpack 5 parses ESM natively and the browserslist floor (Chrome/Firefox 90, Safari/iOS 15) needs no transpiling — an A/B build showed byte-equivalent output, so the toolchain was removed in 4.2.0. If you widen `browserslist` to older engines, reintroduce `babel-loader` in `webpack/rules/`.

## File layout

```text
src/
├── *.html                       # 18 pages — each ~500 lines, mostly content
├── assets/
│   ├── scripts/2026/            # The only JS
│   │   ├── index.js             # entry — imports SCSS, mounts shell, runs init
│   │   ├── Shell.js             # NAV manifest + sidebar/topbar/footer renderers
│   │   ├── init.js              # theme toggle, dropdowns, nav-groups, todos, accordions, tabs, mobile drawer
│   │   ├── palette.js           # ⌘K command palette — builds its list from NAV
│   │   ├── charts.js            # Chart.js SEEDS + tokens() — lazy-loads chart.js
│   │   ├── calendar.js          # FullCalendar seed events + toolbar binding — lazy-loaded
│   │   ├── maps.js              # jsvectormap world map — lazy-loaded
│   │   └── vendor-jsvectormap.js # re-export so lib + map data + CSS share one chunk
│   ├── styles/2026/             # The only SCSS
│   │   ├── index.scss           # entry — @use's every partial below
│   │   ├── _tokens.scss         # CSS variables, light + dark
│   │   ├── _base.scss           # reset, body, .eyebrow, .mono
│   │   ├── _animations.scss     # rise-in / bar-in / fade-in / draw / spin
│   │   ├── _shell.scss          # .shell, sidebar, topbar, footer chrome
│   │   ├── _dropdowns.scss      # .dd-* (notifications, messages, profile)
│   │   ├── _components.scss     # .hero, .btn, .card, .grid, .table, .tag
│   │   ├── _forms.scss          # inputs, select, textarea, check, radio, switch
│   │   ├── _ui.scss             # alerts, badges, progress, spinner, tabs, accordion, modal
│   │   ├── _auth.scss           # signin/signup split-screen shell
│   │   ├── _error.scss          # 404 / 500 cards
│   │   ├── _chat.scss           # 2-pane chat layout
│   │   ├── _data.scss           # data-table, pager
│   │   ├── _charts.scss         # chart-canvas-wrap, legend
│   │   ├── _dashboard.scss      # KPIs, sv-* (site visits), todo, weather
│   │   ├── _email.scss          # 3-pane email layout
│   │   ├── _calendar.scss       # mini-cal, rail, upcoming list
│   │   ├── _fullcalendar.scss   # FullCalendar token overrides
│   │   ├── _palette.scss        # ⌘K palette modal
│   │   └── _responsive.scss     # all media queries in one place
│   └── static/                  # 2.2 MB, currently referenced by NOTHING — see below
tests/                           # vitest + jsdom
webpack/                         # config, manifest, devServer, rules/, plugins/
docs/                            # Jekyll (just-the-docs) site — redirects to adminator.colorlib.com/docs/
scripts/                         # Playwright screenshot + publishing helpers (not part of the build)
```

webpack uses a filesystem cache separated by build mode and minification setting. Modern Sass options are `style` and `loadPaths`. Chart.js registration lives in `vendor-chartjs.js`; add components there when introducing new chart types.

The 2026 webpack entry produces two **initial** chunks — `runtime.js` and `2026.js` — which HtmlWebpackPlugin injects into every page, plus three **async** chunks fetched on demand: `vendor-chartjs.js`, `vendor-fullcalendar.js`, `vendor-jsvectormap.js` (+ its small CSS). In production, JS and CSS filenames get an 8-char contenthash; dev keeps plain names for readable source maps and HMR.

**Dead weight, knowingly retained:** `grep -rn "assets/static" src/` returns zero hits. The FontAwesome and Themify icon fonts (1.5 MB), `bg.jpg`, `500.png`, `404.png`, `logo.png` and even `logo.svg` are all leftovers from the pre-2026 template — the brand mark is inline SVG in `Shell.js` and every icon is an inline `<svg>`. These assets are retained in source but are no longer copied to `dist/`. Imported images/fonts are emitted by webpack asset rules when used. The unused copy plugin has been removed.

`splitChunks` deliberately defines almost no cacheGroups and sets `defaultVendors: false`. Each library is reached through exactly one `import()` carrying a `webpackChunkName` comment, which already produces one chunk per library; a catch-all vendor group with a static `name` collapses them all back into a single chunk (that is how `calendar.html` used to download Chart.js). Don't re-add one.

## Page anatomy

Every shell page is structured the same way:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Fonts live here, NOT in the SCSS. A CSS @import lands inside the built
         stylesheet, so the browser can't discover the font request until
         style.css has downloaded and parsed. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Inter+Tight:wght@500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap">
    <title>...</title>
    <script>
      // Early-paint theme bootstrap — sets data-theme before CSS arrives,
      // so dark-mode users don't see a light flash.
      (function () {
        try {
          var saved = localStorage.getItem('dash26-theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
        } catch (e) { document.documentElement.setAttribute('data-theme', 'light'); }
      })();
    </script>
  </head>
  <body data-active="dashboard" data-crumbs="Workspace | Dashboard">
    <div class="shell">
      <div data-shell-sidebar></div>
      <div class="main">
        <div data-shell-topbar></div>
        <main class="content">
          <!-- Page-specific content here -->
        </main>
        <div data-shell-footer></div>
      </div>
    </div>
  </body>
</html>
```

`data-active` matches a `key` in `Shell.js`'s `NAV` manifest (e.g. `dashboard`, `email`, `calendar`, `charts`). `data-crumbs` is a `|`-separated list — last segment is highlighted as the current page.

Standalone pages (signin, signup, 404, 500) skip the `.shell` wrapper and use their own layout (`.auth-shell`, `.error-shell`).

## Widget mount points

Modules self-activate by querying the DOM — a page opts into a widget purely with markup, and each module early-returns when its selector is absent (so every page can safely load the same bundle):

| Markup | Module | Notes |
|---|---|---|
| `<canvas data-chart-key="revenue-line">` | `charts.js` | key must exist in `SEEDS` |
| `<div data-vmap>` | `maps.js` | world map, fixed marker list |
| `<div data-fc>` | `calendar.js` | single instance; toolbar bound via `.cal-nav-btn` / `.cal-today-btn` / `.cal-view-tab` |

| `[data-accordion]` + `[data-accordion-trigger]` | `init.js` | toggles `is-open` |
| `.todo-check` inside `.todo-item` | `init.js` | toggles `is-done` |
| `[data-dropdown]` inside `.dd-wrap` | `init.js` | one open at a time, Esc/outside-click closes |
| `[data-drawer-open]` | `init.js` | mobile off-canvas sidebar (`body.has-drawer-open`) |
| `[data-palette-open]`, ⌘K/Ctrl+K, `/` | `palette.js` | mounts into `<body>` lazily |

Note: `initTabGroups()` in `init.js` wires `[data-tab-group]` + `data-tab-target` / `data-tab-id`, but no page currently uses it — the tabs on `ui.html` are a static `.tabs`/`.tab` demo. Likewise `datatable.html` and `google-maps.html` (an `<iframe>`) are pure markup with no JS behind them.

## Adding a new page

1. Create `src/foo.html` with the body anatomy above — including the three font `<link>` tags, which are per-page.
2. Add `'foo': 'Adminator · Foo'` to the `titles` map in `webpack/plugins/htmlPlugin.js` — that map is the source of truth for which templates get built.
3. Add a sidebar entry to `NAV` in `src/assets/scripts/2026/Shell.js`. Set `key: 'foo'`, `href: 'foo.html'`, and an inline SVG path for the icon. The ⌘K palette picks it up automatically.
4. Restart the dev server (the webpack config picks up new templates only on restart).

## Adding a new chart

Add a seed function to `SEEDS` in `src/assets/scripts/2026/charts.js`, keyed by a slug:

```js
'my-chart': (t) => ({ type: 'line', data: { ... }, options: { ... } }),
```

Then in any page: `<canvas data-chart-key="my-chart"></canvas>`. The `t` argument is a tokens object with the active theme's `primary`, `success`, `danger`, etc. — use `t.primary`, ``` `${t.primary}24` ``` for transparency, etc., never hex literals. `tests/charts-seeds.test.js` asserts every seed actually consumes the tokens it's handed, so a hard-coded color will fail the suite.

`SEEDS` is a plain data map with no Chart.js import, which is what lets the library stay behind a dynamic `import()` — keep it that way. `buildAll()` awaits `loadChartJs()` before instantiating anything.

## Styling FullCalendar (v7)

FullCalendar 7 is **one** package (`fullcalendar`) with subpath exports, not the old `@fullcalendar/*` scope. `vendor-fullcalendar.js` pulls in the calendar, its four plugins, the `classic` theme plugin, `skeleton.css` and the theme's `theme.css` — but deliberately **not** the theme's `palette.css`, because `_fullcalendar.scss` supplies the palette from 2026 tokens instead. That is what makes the calendar follow light/dark automatically.

Three things will trip you up:

1. **v7 emits hashed class names** (`.fc-Kf`, `.fc-classic-YjJ`) that change between builds. Never write a selector against them. Style through CSS variables, or render your own element via a content callback (`dayHeaderContent` does this for the `.fc-dow` column headers) and style that.
2. **Event colours must be set as `--fc-classic-event` / `--fc-classic-event-contrast`, not `--fc-event-color`.** FullCalendar writes `--fc-event-color: var(--fc-classic-event)` as an *inline style* on every event element, and inline styles outrank class rules — so setting `--fc-event-color` in CSS is silently ignored.
3. **Per-event classes use `className: 'x'` (string), not v6's `classNames: ['x']` (array).** The array form is dropped without warning, which just makes every event render in the default colour.

`eventDisplay: 'block'` in `calendar.js` is what makes month-view timed events paint as filled pills rather than a dot plus label.

**`npm outdated` lies about FullCalendar.** It will report `@fullcalendar/core` as upgradable — in v7 that package is only shared TypeScript types with an empty `index.d.ts`, and installing it does not give you a `Calendar` class. It is not a dependency of this project any more; ignore the row.

## Adding a new theme variable

1. Add it to both `:root[data-theme="light"]` and `:root[data-theme="dark"]` in `_tokens.scss`.
2. Use it via `var(--your-token)` anywhere.
3. If charts/maps need it, add it to `tokens()` in `charts.js` / `maps.js` so they pick it up at render.

## Commands

- `npm start` — dev server at <http://localhost:4000> (HMR enabled). `npm run dev` is the same, an alias for `npm start`.
- `npm run build` — production build to `dist/`, unminified with extracted CSS (identical to `release:unminified`; useful for reading the output). Every build script sets `NODE_ENV` through `cross-env` — the env vars must come *after* `cross-env`, or Windows breaks.
- `npm run release:minified` / `npm run release:unminified` — the two artifacts the release workflow ships.
- `npm run lint` — ESLint (`./src ./webpack ./*.js`) + Stylelint (`./src/**/*.scss`), must be 0/0. Also `lint:js` / `lint:scss` individually.
- `npm run build:analyze` — bundle analyzer report.
- `npm run clean` — wipe `dist/` with native Node.js.
- `npm run check` — lint, unit tests, minified build, asset verification, and bundle budgets.
- `npm run preview` — serve existing `dist/` on loopback port 3001 without webpack.
- `npm run test:browser` — Playwright smoke checks; install Chromium first with `npx playwright install chromium`.
- `npm run screenshots` — Playwright captures of the README shots; **requires `npm start` running in another terminal**. Override the target with `BASE_URL=...`.

### Tests

Vitest + jsdom, config in `vitest.config.mjs`, suites in `tests/` (`shell.test.js`, `init.test.js`, `charts-seeds.test.js`, `palette.test.js`).

```bash
npm test                                   # watch mode
npm run test:run                           # single pass (use this in automation)
npm run test:coverage                      # v8 coverage over src/assets/scripts/2026/**
npx vitest run tests/shell.test.js         # one file
npx vitest run -t 'renders the sidebar'    # one test by name
```

`tests/setup.js` wipes the DOM and `localStorage` before each test and stubs `localStorage` / `matchMedia`, which jsdom doesn't provide. Tests import the 2026 modules directly — no build step needed.

## CI / releasing

`.github/workflows/merge.yml` runs lint, tests, `npm audit --omit=dev --audit-level=high`, and a build on PRs to `master`, across Node 22.x and 24.x. `release.yml` runs on push to `master`, builds both zips, verifies the archive structure, and cuts a GitHub release tagged `v<package.json version>`.

Routine PRs do not require version bumps. For a release, bump `version` in `package.json`. `release.yml` checks for an existing tag before installation, validates every push, and builds archives only for unreleased versions. Both workflows audit production dependencies and enforce minified bundle budgets; Chromium checks cover all pages, both themes, and desktop/mobile viewports.

The shell reads its brand/footer version from `package.json`; bump that single field for a release.

Release zips are built with `(cd dist && zip -r ../name.zip .)`. Do not switch to `zip -j`: it flattens any nested emitted assets into the archive root.

**Node baseline is >= 22.22.2** (`engines`, `.nvmrc` pins 24) — jsdom 30 and webpack-dev-server 6 both refuse to run below that.

## Conventions

- **CSS variables, never hex.** All colors live in `_tokens.scss`.
- **`is-active` / `is-open` / `is-done`** for state classes (BEM-ish modifiers).
- **`data-` attributes drive JS**, never `id`s except for `themeToggle` and `heroDate`.
- **Inline `<svg>` icons** (24×24 viewBox, `stroke-width: 1.75–2`, `fill: none`). Avoid icon-font dependencies.
- **`'Inter'` for body, `'Inter Tight'` for display, `'JetBrains Mono'` for numerics/eyebrows.** Loaded via per-page `<head>` links, using preconnect and `display=swap`.
- **Guard clauses everywhere.** Every init function returns early when its host element is missing, and `localStorage` access is always wrapped in `try/catch` — the bundle is shared by all 18 pages and must not throw on any of them.
