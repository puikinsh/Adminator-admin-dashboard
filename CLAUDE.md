# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm start` - Start development server with hot reload (available at http://localhost:4000)
- `npm run dev` - Start development server with webpack dashboard
- `npm run build` - Build for production (optimized)
- `npm run release:minified` - Build production with minification
- `npm run release:unminified` - Build production without minification
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run all linters (JavaScript + SCSS)
- `npm run lint:js` - Lint JavaScript files using ESLint 9.x flat config
- `npm run lint:scss` - Lint SCSS files using Stylelint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report

### Build Analysis

- `npm run build:analyze` - Build with bundle analyzer (opens interactive report)

### Utility Commands
- `npm run clean` - Clean the dist directory

## Project Architecture

### Technology Stack
- **Build System**: Webpack 5.101.3 with modern configuration
- **JavaScript**: ES6+ with Babel transpilation, ESLint 9.x flat config
- **CSS**: Sass/SCSS with PostCSS processing, Bootstrap 5.3.8
- **Frontend Framework**: **100% jQuery-free** vanilla JavaScript with modern class-based architecture
- **Theme System**: CSS variables-based dark/light mode system

### Core Application Structure
The application follows a modular class-based architecture:

**Main Application Class** (`src/assets/scripts/app.js`):
- `AdminatorApp` - Main application controller with component management
- Handles initialization, mobile optimizations, and global event coordination
- Component registry system for managing feature modules

**Core Components**:
- `Sidebar` (`src/assets/scripts/components/Sidebar.js`) - Navigation sidebar logic
- `ChartComponent` (`src/assets/scripts/components/Chart.js`) - Chart rendering and theme integration
- `Theme` (`src/assets/scripts/utils/theme.js`) - Theme management with localStorage persistence

**Utility Modules**:
- `DOM` (`src/assets/scripts/utils/dom.js`) - DOM manipulation helpers
- `DateUtils` (`src/assets/scripts/utils/date.js`) - Date handling with Day.js integration
- `Events` (`src/assets/scripts/utils/events.js`) - Event delegation, debounce, throttle
- `Performance` (`src/assets/scripts/utils/performance.js`) - ResizeObserver, IntersectionObserver utilities
- `Storage` (`src/assets/scripts/utils/storage.js`) - Safe localStorage wrapper with fallback
- `Sanitize` (`src/assets/scripts/utils/sanitize.js`) - HTML/input sanitization for security
- `Logger` (`src/assets/scripts/utils/logger.js`) - Development-only logging

### Dark Mode System
The project features a comprehensive dark mode implementation:

**Theme Toggle Integration**:
- Automatically injects theme toggle into navigation if missing
- Detects OS preference on first visit
- Persists theme choice in localStorage
- Real-time theme switching without page reload

**Component Theme Awareness**:
- Chart.js integration with dynamic color schemes
- FullCalendar dark mode support
- Vector maps with theme-specific palettes
- All UI components use CSS variables for theming

**CSS Variables Architecture**:
- Semantic color variables (e.g., `--c-bkg-body`, `--c-text-base`)
- Component-specific theme variables
- Automatic contrast and accessibility considerations

### Mobile Optimization
The application includes extensive mobile enhancements:

**Responsive Features**:
- Full-width search overlay for mobile
- Enhanced dropdown behavior with overlay management
- Touch-friendly interactions
- Viewport-based responsive breakpoints

**Mobile-Specific Behavior**:
- Prevents horizontal scrolling on mobile
- Auto-focus management for form inputs
- Gesture-based navigation support

### File Organization
```
src/
├── assets/
│   ├── scripts/           # JavaScript modules
│   │   ├── components/    # Reusable UI components
│   │   ├── utils/         # Utility functions
│   │   ├── charts/        # Chart initialization modules
│   │   ├── fullcalendar/  # Calendar integration
│   │   └── app.js         # Main application entry point
│   ├── styles/            # SCSS stylesheets
│   │   ├── spec/          # Custom component styles
│   │   └── vendor/        # Third-party plugin styles
│   └── static/            # Static assets (fonts, images)
├── *.html                 # HTML template pages
```

### Build Configuration

**Webpack Setup**:
- Modern flat ESLint configuration
- Sass compilation with PostCSS processing
- Source map generation for development
- Production optimization with minification and tree-shaking
- Hot module replacement for development
- Code splitting for vendor libraries (Chart.js, FullCalendar, Bootstrap)
- Bundle analyzer available via `npm run build:analyze`

**Development Server**:
- Webpack dev server on port 4000
- Live reload and hot module replacement
- Proxy configuration for API endpoints

## Working with This Codebase

### Adding New Components
1. Create component class in `src/assets/scripts/components/`
2. Register component in `AdminatorApp.init()` method
3. Add component-specific styles in `src/assets/styles/spec/components/`
4. Ensure theme compatibility using CSS variables

### Modifying Themes
- Theme logic is centralized in `src/assets/scripts/utils/theme.js`
- CSS variables are defined in `src/assets/styles/utils/theme.css`
- Chart.js theme integration is automatic via `Chart.defaults` configuration

### Testing Changes
- Always run `npm run lint` before committing
- Test both light and dark themes
- Verify mobile responsiveness at various breakpoints
- Check component integration via browser developer tools

### Development Workflow
1. Run `npm start` for development server
2. Use `npm run dev` for enhanced debugging with webpack dashboard
3. Lint code with `npm run lint` before commits
4. Build production assets with `npm run build`
5. Preview production build with `npm run preview`

### Key Dependencies
- **Bootstrap 5.3.8**: UI framework and CSS components (JS components replaced with vanilla alternatives)
- **Chart.js 4.5.0**: Interactive charts with theme support (replaces jQuery Sparkline)
- **FullCalendar 6.1.17**: Calendar component with dark mode
- **Day.js 1.11.18**: Lightweight date manipulation
- **Perfect Scrollbar 1.5.6**: Custom scrollbar implementation
- **Masonry Layout 4.2.2**: Grid layouts (vanilla JS compatible)

### Removed Dependencies

**Successfully removed all jQuery dependencies (~600KB bundle reduction):**
- ❌ `jquery` (3.7.1) - Replaced with vanilla JS DOM manipulation
- ❌ `jquery-sparkline` (2.4.0) - Replaced with Chart.js mini charts
- ❌ `bootstrap-datepicker` (1.10.0) - Replaced with HTML5 date inputs + vanilla JS
- ❌ `datatables` (1.10.18) - Replaced with vanilla JS table component
- ❌ `easy-pie-chart` (2.1.7) - Replaced with vanilla JS SVG pie charts
- ❌ `jvectormap` (2.0.4) - Replaced with jsvectormap 1.7.0 vanilla JS SVG world map
- ❌ `lodash` (4.17.21) - Replaced with custom Events utility (debounce/throttle)

### Modern Vanilla JS Implementations
- **Sparkline Charts**: Chart.js-based mini charts with theme support
- **Pie Charts**: Custom SVG-based circular progress indicators
- **Data Tables**: Full-featured table with sorting, pagination, and search
- **Date Pickers**: Enhanced HTML5 date inputs with custom styling
- **Vector Maps**: SVG-based world map with markers and interactions
- **Bootstrap 5 Components**: Vanilla JS implementations of modals, dropdowns, popovers, tooltips, and accordions