# Repository Guidelines

## Project Structure & Module Organization

Adminator is a vanilla-JavaScript dashboard template built with webpack. Page templates live in `src/*.html`; runtime modules in `src/assets/scripts/2026/`; SCSS in `src/assets/styles/2026/`; and legacy images/fonts in `src/assets/static/` (omitted from builds). `index.js` and `index.scss` are the bundle entry points. `Shell.js` renders shared navigation, topbar, and footer from its `NAV` manifest.

`tests/` contains unit tests and browser stubs. `webpack/` holds build configuration, `docs/` contains Jekyll documentation, and `scripts/` includes verification helpers. `dist/` is generated output; edit sources instead.

## Build, Test, and Development Commands

Use Node.js **22.22.2 or newer** and install dependencies with `npm ci`.

- `npm start`: start the development server at `http://localhost:4000` with hot reload.
- `npm run build`: clean `dist/` and produce an unminified production build.
- `npm run release:minified`: produce minified release assets.
- `npm run lint`: run ESLint and Stylelint; use `lint:js` or `lint:scss` separately.
- `npm test`: run Vitest in watch mode.
- `npm run test:run`: run tests once.
- `npm run test:coverage`: generate V8 text and HTML coverage reports.
- `npm run check`: lint, test, build, and verify asset references and size budgets.
- `npm run preview`: serve existing `dist/` on port 3001.
- `npm run test:browser`: check all pages; install Chromium with `npx playwright install chromium`.

## Coding Style & Naming Conventions

Use two-space indentation, UTF-8, LF endings, and a final newline. Follow ESLint and Stylelint configuration. Write modern ESM in runtime modules; existing webpack configuration uses CommonJS. Prefer `const`, camelCase functions/variables, and descriptive filenames. SCSS partials use `_name.scss`; CSS classes and data attributes use kebab-case.

Use `_tokens.scss` CSS variables for theme colors. Preserve widget mount-point checks and dynamic imports. When adding a page, register it in `webpack/plugins/htmlPlugin.js` and `Shell.js`'s `NAV`; follow the page anatomy in `CLAUDE.md`.

## Testing Guidelines

Use Vitest with jsdom. Name tests `tests/<feature>.test.js` and group behavior with `describe`/`it`. Add regression cases for changed interactions and theme behavior. Shared DOM and storage setup lives in `tests/setup.js`. Coverage targets runtime modules; no minimum percentage is configured. For visual changes, check light/dark themes and mobile layouts.

## Commit & Pull Request Guidelines

Recent commits use concise imperative subjects, such as “Lazy-load Chart.js, FullCalendar and jsvectormap”; follow that style. Release commits use `Release <version>`.

Keep PRs focused. Describe the change, link relevant issues, report validation, and include screenshots for UI changes. Before submitting, run lint, tests, and build; CI checks Node 22/24 and audits production dependencies.
