# Changelog

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
