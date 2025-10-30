# Project Structure

This guide explains the folder structure and organization of the Adminator admin dashboard template.

## Overview

Adminator follows a modern, modular architecture with clear separation of concerns. The project is organized into source files, build configuration, and documentation.

```
adminator-admin-dashboard/
├── src/                    # Source files
├── dist/                   # Built/compiled files (generated)
├── webpack/                # Build configuration
├── docs/                   # Documentation
├── node_modules/           # Dependencies (generated)
└── Configuration files
```

## Root Directory

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies and npm scripts |
| `webpack.config.js` | Webpack entry point |
| `.babelrc` | Babel ES6+ transpiler configuration |
| `eslint.config.mjs` | ESLint 9.x flat configuration for code linting |
| `.stylelintrc.json` | Stylelint configuration for SCSS/CSS linting |
| `.editorconfig` | Editor settings for consistent code style |
| `browserslist` | Target browser versions for compilation |
| `.gitignore` | Git ignore patterns |
| `.gitattributes` | Git attributes configuration |
| `.nvmrc` | Node.js version specification |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `CHANGELOG.md` | Version history and release notes |
| `LICENSE` | MIT license information |
| `CODE_OF_CONDUCT.md` | Community guidelines |

## Source Directory (`src/`)

The `src/` directory contains all template source files that are compiled into the final application.

### HTML Templates

Located directly in `src/`, these are the template pages:

```
src/
├── index.html              # Main dashboard page
├── blank.html              # Blank page template
├── 404.html                # 404 error page
├── 500.html                # 500 error page
├── signin.html             # Sign in page
├── signup.html             # Sign up page
├── email.html              # Email inbox
├── compose.html            # Email compose
├── chat.html               # Chat application
├── calendar.html           # Calendar view
├── charts.html             # Charts showcase
├── forms.html              # Form elements
├── buttons.html            # Button styles
├── ui.html                 # UI elements showcase
├── basic-table.html        # Basic table
├── datatable.html          # Data table with features
├── google-maps.html        # Google Maps integration
└── vector-maps.html        # Vector maps
```

### Assets Directory (`src/assets/`)

Contains all JavaScript, styles, images, and fonts.

```
src/assets/
├── scripts/                # JavaScript files
├── styles/                 # SCSS stylesheets
└── static/                 # Static assets (images, fonts)
```

## JavaScript Structure (`src/assets/scripts/`)

Modern, jQuery-free vanilla JavaScript architecture.

### Main Application

```
scripts/
├── app.js                  # Main application entry point
├── index.js                # Module exports
└── components/             # Reusable components
    ├── Sidebar.js          # Sidebar navigation component
    └── Chart.js            # Chart component wrapper
```

### Feature Modules

Each feature has its own directory with an `index.js` entry point:

```
scripts/
├── charts/                 # Chart implementations
│   ├── chartJS/           # Chart.js integration
│   ├── easyPieChart/      # Pie chart component
│   └── sparkline/         # Sparkline mini charts
├── chat/                   # Chat application logic
├── email/                  # Email application logic
├── fullcalendar/          # Calendar integration
├── googleMaps/            # Google Maps integration
├── vectorMaps/            # Vector maps integration
├── datatable/             # Data table functionality
├── datepicker/            # Date picker component
├── masonry/               # Masonry grid layout
├── popover/               # Popover components
├── scrollbar/             # Custom scrollbar
├── search/                # Search functionality
├── sidebar/               # Sidebar behavior
├── skycons/               # Weather icons
└── ui/                    # UI components
```

### Utilities and Constants

```
scripts/
├── utils/                  # Utility functions
│   ├── dom.js             # DOM manipulation helpers
│   ├── date.js            # Date utilities (Day.js wrapper)
│   ├── theme.js           # Theme management (dark/light mode)
│   └── index.js           # Utility exports
└── constants/             # Application constants
    └── colors.js          # Color definitions
```

## Styles Structure (`src/assets/styles/`)

SCSS-based styling with modular architecture following ITCSS methodology.

```
styles/
├── index.scss              # Main style entry point
├── spec/                   # Custom styles
│   ├── components/        # Component styles
│   │   ├── sidebar.scss
│   │   ├── topbar.scss
│   │   ├── footer.scss
│   │   ├── forms.scss
│   │   ├── loader.scss
│   │   ├── masonry.scss
│   │   ├── pageContainer.scss
│   │   ├── progressBar.scss
│   │   └── easyPieChart.scss
│   ├── generic/           # Base/reset styles
│   │   └── base.scss
│   ├── screens/           # Page-specific styles
│   │   ├── chat.scss
│   │   └── email.scss
│   ├── settings/          # Variables and configuration
│   │   ├── baseColors.scss
│   │   ├── materialColors.scss
│   │   ├── borders.scss
│   │   ├── breakpoints.scss
│   │   └── fonts.scss
│   ├── tools/             # Mixins and functions
│   │   └── mixins/
│   └── utils/             # Utility classes
│       ├── colors.scss
│       ├── theme.css      # CSS variables for dark mode
│       └── layout/        # Layout helpers
└── vendor/                # Third-party plugin styles
```

## Static Assets (`src/assets/static/`)

```
static/
├── fonts/                  # Icon fonts
│   ├── themify-icons/     # Themify Icons
│   └── font-awesome/      # Font Awesome (if used)
└── images/                 # Images and graphics
    ├── logo.svg           # Application logo
    ├── bg.jpg             # Background images
    ├── 404.png            # Error page illustrations
    └── 500.png
```

## Webpack Configuration (`webpack/`)

Modular webpack configuration split into logical parts:

```
webpack/
├── config.js               # Main webpack configuration
├── manifest.js             # Build constants and paths
├── devServer.js            # Development server settings
├── plugins/                # Webpack plugins configuration
│   ├── index.js
│   ├── html.js            # HTML generation
│   ├── copy.js            # File copying
│   ├── extractCSS.js      # CSS extraction
│   └── ...
└── rules/                  # Webpack loaders configuration
    ├── index.js
    ├── javascript.js      # Babel loader
    ├── styles.js          # SCSS/CSS loaders
    ├── fonts.js           # Font loaders
    └── images.js          # Image loaders
```

## Build Output (`dist/`)

Generated directory containing compiled production files:

```
dist/
├── index.html              # Compiled HTML files
├── *.html                  # All other pages
├── assets/
│   ├── bundle.[hash].js   # Compiled JavaScript
│   ├── styles.[hash].css  # Compiled CSS
│   └── static/            # Copied static assets
└── ...
```

## Documentation (`docs/`)

GitHub Pages documentation site:

```
docs/
├── index.md                # Documentation home
├── getting-started/        # Getting started guides
│   ├── installation.md
│   └── project-structure.md (this file)
├── customization/          # Customization guides
│   └── theme-system.md
├── api/                    # API documentation
│   └── theme-api.md
└── examples/               # Code examples
    └── theme-integration.md
```

## Key Architecture Decisions

### 1. **jQuery-Free**
All JavaScript is written in modern vanilla JavaScript (ES6+) without jQuery dependency, resulting in smaller bundle size and better performance.

### 2. **Component-Based**
JavaScript is organized into reusable components (`Sidebar`, `Chart`, etc.) using ES6 classes.

### 3. **Modular SCSS**
Styles follow ITCSS methodology with clear separation of settings, tools, generic, components, and utilities.

### 4. **Modern Build System**
Webpack 5 with Babel for ES6+ transpilation, SCSS compilation, and asset optimization.

### 5. **Dark Mode Support**
CSS custom properties (variables) enable seamless theme switching between light and dark modes.

## File Naming Conventions

- **JavaScript**: camelCase for files and classes (`app.js`, `Sidebar.js`)
- **SCSS**: kebab-case for files (`sidebar.scss`, `page-container.scss`)
- **HTML**: kebab-case for files (`basic-table.html`, `google-maps.html`)
- **Components**: PascalCase for class names (`Sidebar`, `ChartComponent`)

## Import Paths

The project uses webpack aliases for cleaner imports:

```javascript
// Instead of: import Sidebar from '../../components/Sidebar'
import Sidebar from '@/components/Sidebar';

// Available aliases:
// @/              -> src/
// @/components    -> src/assets/scripts/components/
// @/utils         -> src/assets/scripts/utils/
// @/constants     -> src/assets/scripts/constants/
```

## Adding New Features

### Adding a New Page

1. Create HTML file in `src/` (e.g., `my-page.html`)
2. Add page-specific styles in `src/assets/styles/spec/screens/`
3. Add page-specific JavaScript in `src/assets/scripts/`
4. The build system will automatically include it

### Adding a New Component

1. Create component file in `src/assets/scripts/components/`
2. Export the component class
3. Import and use in `app.js` or other modules
4. Add component styles in `src/assets/styles/spec/components/`

### Adding a New Utility

1. Create utility file in `src/assets/scripts/utils/`
2. Export functions/classes
3. Import from `@/utils/` in other files

## Next Steps

Now that you understand the project structure:

1. **[Development Workflow](development.md)** - Learn the development process
2. **[Customize Themes](../customization/theme-system.md)** - Set up dark mode and theming
3. **[Build for Production](build-deployment.md)** - Deploy your application
4. **[API Reference](../api/theme-api.md)** - JavaScript API documentation

---

**Need Help?** Check the [main README](../../README.md) or [open an issue](https://github.com/puikinsh/Adminator-admin-dashboard/issues).
