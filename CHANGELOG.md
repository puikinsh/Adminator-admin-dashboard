# Changelog

## [2.6.0] - 2025-01-21

### 🌙 Dark Mode Release

This release introduces a comprehensive dark mode system with seamless theme switching and component integration.

### ✨ New Features

**🎨 Complete Dark Mode System:**
- **Smart Theme Toggle**: Bootstrap-based switch with sun/moon icons and "Light/Dark" labels
- **OS Preference Detection**: Automatically detects and applies user's preferred color scheme
- **Persistent Theme Storage**: Remembers user's theme choice across sessions
- **Instant Theme Switching**: Real-time theme updates without page reload

**🎯 Theme-Aware Components:**
- **Chart.js Integration**: Dynamic color schemes for all chart types with proper contrast
- **FullCalendar Support**: Dark-mode aware calendar with proper border and text colors
- **Vector Maps**: Custom color palettes for both light and dark themes
- **Google Maps**: Theme-specific styling for landscapes, highways, and POI markers
- **Sparkline Charts**: Optimized color sets for dark mode visibility
- **Skycons Weather Icons**: Adaptive colors for better dark mode contrast

**🎛️ CSS Architecture:**
- **CSS Custom Properties**: Comprehensive variable system for consistent theming
- **Semantic Color Naming**: Intuitive color variables (--c-text-base, --c-bkg-card, etc.)
- **Component Isolation**: Each component respects global theme variables
- **Responsive Design**: Theme switching works seamlessly across all screen sizes

**🖼️ Visual Enhancements:**
- **Adaptive Logo**: SVG logo automatically adjusts colors based on theme
- **Smart Contrast**: Proper text/background contrast ratios in both themes
- **Border Consistency**: Unified border colors throughout the interface
- **Loading States**: Theme-aware loaders and progress indicators

### 🔧 Technical Improvements

**🏗️ Architecture Updates:**
- **Theme Utility Module**: New `src/assets/scripts/utils/theme.js` with comprehensive theme management
- **CSS Variables File**: New `src/assets/styles/utils/theme.css` with light/dark color schemes
- **Component Integration**: Updated all major components to support theme switching
- **Event System**: Custom events for theme change notifications

**⚡ Performance Optimizations:**
- **Efficient Switching**: Minimal DOM manipulation for theme changes
- **CSS Variable Updates**: Leverages browser-native CSS custom properties
- **Memory Management**: Proper cleanup of theme-related event listeners
- **Build Integration**: Theme assets are properly bundled and optimized

### 🎮 User Experience

**💡 Intuitive Controls:**
- **Accessible Toggle**: Proper ARIA labels and keyboard navigation support
- **Visual Feedback**: Clear indication of current theme state
- **Smooth Transitions**: CSS transitions for theme switching (where appropriate)
- **Consistent Placement**: Theme toggle integrated into header navigation

**🔄 Smart Behavior:**
- **First-Time Detection**: Respects OS dark mode preference on first visit
- **Cross-Session Persistence**: Theme choice remembered across browser sessions
- **Fallback Handling**: Graceful degradation when localStorage is unavailable
- **Dynamic Updates**: All components update immediately when theme changes

### 🛠️ Development Experience

**📝 Documentation:**
- **Theme API**: Comprehensive methods for theme management
- **Color Guidelines**: Standardized color usage across components
- **Component Examples**: Updated examples showing theme-aware components
- **Migration Guide**: Instructions for theme integration in custom components

### 🔍 Enhanced Components

**📊 Charts & Data Visualization:**
- Chart.js with dynamic color schemes
- Sparkline charts with theme-optimized colors
- Easy Pie Charts with adaptive styling
- Vector maps with custom dark mode palettes

**🗓️ Interactive Elements:**
- FullCalendar with proper dark mode borders
- DataTables with theme-consistent styling  
- Date pickers with adaptive colors
- Form elements with dark mode support

**🗺️ Maps & Location:**
- Google Maps with custom dark mode styling
- Vector maps with region-specific color schemes
- Marker and overlay theme integration

### ⚠️ Breaking Changes

None. This release is fully backward compatible.

### 🏁 Migration Guide

Existing projects will automatically inherit dark mode capabilities. No code changes required.

**Optional Enhancements:**
- Add `data-theme` attribute handling for custom components
- Use CSS variables from `theme.css` for consistent coloring
- Listen for `adminator:themeChanged` events for custom theme handling

### 📋 Files Added/Modified

**New Files:**
- `src/assets/scripts/utils/theme.js` - Theme management utility
- `src/assets/styles/utils/theme.css` - CSS variables and color schemes

**Enhanced Files:**
- All HTML pages updated with theme-aware components
- Component JavaScript files updated for theme integration
- SCSS files enhanced with CSS variable usage
- Logo SVG updated for theme compatibility

## [2.5.0] - 2025-06-16

### 🎉 Major Modernization Release

This release represents a comprehensive modernization of the entire build toolchain and development stack.

### ⬆️ Dependency Updates

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

### 🔧 Configuration Changes

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

**🎯 Phase 5.1 - Date Library Migration:**
- **REMOVED** `moment` 2.30.1 (67KB) - unused legacy dependency
- **ADDED** `dayjs` 1.11.13 (2KB) - modern 97% smaller alternative
- Created comprehensive `DateUtils` module with modern date handling
- Updated FullCalendar to use Day.js for dynamic date generation
- Enhanced date picker functionality with Day.js validation
- Bundle size reduction: ~65KB saved
- Zero breaking changes - Day.js provides same API coverage

### 🛠️ Development Experience

- **Node.js Support**: Now requires Node.js 18.12.0+ (compatible with v23.11.0)
- **Modern tooling**: All dependencies updated to latest stable versions
- **Zero security vulnerabilities**: Complete security audit clean
- **Improved performance**: Faster builds and development server
- **Better linting**: Modern ESLint 9.x with flat config
- **Enhanced CSS**: Latest PostCSS and Sass versions

### 🔒 Security & Quality

- All dependencies audited and updated to latest secure versions
- Zero known security vulnerabilities
- Modern linting rules for better code quality
- Updated copyright notices to 2025

### 📝 Documentation

- Updated README with modern setup instructions
- Enhanced development workflow documentation
- Added comprehensive changelog entries

### ⚠️ Breaking Changes

- **Node.js**: Minimum version now 18.12.0
- **ESLint**: Configuration format changed from eslintrc to flat config
- **Development**: Some webpack-cli commands removed (init, loader, plugin)

### 🏗️ Migration Guide

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
