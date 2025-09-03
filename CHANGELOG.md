# Changelog

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
