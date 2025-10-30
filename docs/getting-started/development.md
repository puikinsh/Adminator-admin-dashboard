# Development Workflow

This guide covers the development workflow for working with Adminator, including running the development server, making changes, and best practices.

## Table of Contents

- Quick Start
- Development Server
- Available npm Scripts
- Making Changes
- Hot Module Replacement
- Code Quality & Linting
- Debugging
- Working with Components
- Working with Styles
- Best Practices
- Common Issues
- Next Steps

## Quick Start

After [installation](installation.md), start the development server:

```bash
npm start
```

Your application will be available at **http://localhost:4000**

## Development Server

### Standard Development Server

The standard development server includes hot module replacement (HMR) for instant updates:

```bash
npm start
```

**Features:**
- Hot module replacement (HMR)
- Automatic browser refresh
- Source maps for debugging
- Fast rebuild times
- Runs on port 4000

### Development Server with Dashboard

For enhanced development experience with visual feedback:

```bash
npm run dev
```

**Additional Features:**
- Visual webpack dashboard
- Real-time build statistics
- Bundle size analysis
- Build time metrics
- Module dependency graph

## Available npm Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with HMR |
| `npm run dev` | Start development server with webpack dashboard |
| `npm run clean` | Clean the `dist/` directory |

### Production Build

| Command | Description |
|---------|-------------|
| `npm run build` | Production build (optimized, minified) |
| `npm run release:minified` | Production build with minification |
| `npm run release:unminified` | Production build without minification (for debugging) |
| `npm run preview` | Preview production build locally |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run all linters (JavaScript + SCSS) |
| `npm run lint:js` | Lint JavaScript files with ESLint |
| `npm run lint:scss` | Lint SCSS files with Stylelint |

## Making Changes

### File Watching

The development server automatically watches for changes in:

- **HTML files** (`src/*.html`)
- **JavaScript files** (`src/assets/scripts/**/*.js`)
- **SCSS files** (`src/assets/styles/**/*.scss`)
- **Static assets** (`src/assets/static/**/*`)

Changes are automatically compiled and the browser refreshes.

### Workflow

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Make your changes** in the `src/` directory

3. **Save the file** - Changes are automatically detected

4. **Browser refreshes** - See your changes instantly

## Hot Module Replacement (HMR)

HMR allows modules to be updated without a full page reload, preserving application state.

### What Gets Hot Reloaded?

- ✅ **JavaScript modules** - Component updates without page reload
- ✅ **SCSS/CSS** - Style updates without page reload
- ⚠️ **HTML files** - Requires full page reload
- ⚠️ **Configuration files** - Requires server restart

### HMR Benefits

- Faster development cycle
- Preserves application state
- Instant visual feedback
- Better debugging experience

## Code Quality & Linting

### JavaScript Linting (ESLint)

Adminator uses ESLint 9.x with flat configuration:

```bash
# Lint all JavaScript files
npm run lint:js

# Auto-fix issues (if possible)
npx eslint ./src --fix
```

**Configuration:** `eslint.config.mjs`

**Rules:**
- ES6+ modern JavaScript
- No jQuery patterns
- Consistent code style
- Import/export validation

### SCSS Linting (Stylelint)

Maintain consistent SCSS code style:

```bash
# Lint all SCSS files
npm run lint:scss

# Auto-fix issues (if possible)
npx stylelint "./src/**/*.scss" --fix
```

**Configuration:** `.stylelintrc.json`

### Running All Linters

```bash
npm run lint
```

This runs both JavaScript and SCSS linters in sequence.

## Debugging

### Source Maps

Development builds include source maps for easier debugging:

1. Open browser DevTools (F12)
2. Navigate to Sources tab
3. Find your original source files under `webpack://`
4. Set breakpoints and debug as normal

### Console Logging

The application includes minimal console output in production. For development debugging:

```javascript
// Development-only logging
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info:', data);
}
```

### Browser DevTools

**Recommended Extensions:**
- React Developer Tools (if using React components)
- Vue.js devtools (if using Vue components)
- Redux DevTools (if using Redux)

## Working with Components

### Creating a New Component

1. **Create component file** in `src/assets/scripts/components/`:

```javascript
// src/assets/scripts/components/MyComponent.js
class MyComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Initialize component
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add event listeners
  }

  destroy() {
    // Cleanup
  }
}

export default MyComponent;
```

2. **Import and use** in `app.js`:

```javascript
import MyComponent from '@/components/MyComponent';

// Initialize
const myComponent = new MyComponent(document.querySelector('.my-component'));
```

3. **Add component styles** in `src/assets/styles/spec/components/`:

```scss
// src/assets/styles/spec/components/myComponent.scss
.my-component {
  // Component styles
}
```

4. **Import styles** in `src/assets/styles/spec/components/index.scss`:

```scss
@import 'myComponent';
```

### Component Best Practices

- Use ES6 classes for components
- Keep components focused and single-purpose
- Implement `destroy()` method for cleanup
- Use webpack aliases (`@/components`, `@/utils`)
- Follow existing naming conventions

## Working with Styles

### SCSS Architecture

Adminator follows ITCSS (Inverted Triangle CSS) methodology:

```
styles/
├── settings/    # Variables, config
├── tools/       # Mixins, functions
├── generic/     # Reset, normalize
├── components/  # UI components
├── utils/       # Utility classes
└── vendor/      # Third-party styles
```

### Adding New Styles

1. **Component styles** → `src/assets/styles/spec/components/`
2. **Page-specific styles** → `src/assets/styles/spec/screens/`
3. **Utility classes** → `src/assets/styles/spec/utils/`

### Using CSS Variables

Adminator uses CSS custom properties for theming:

```scss
.my-component {
  background: var(--c-bkg-card);
  color: var(--c-text-base);
  border: 1px solid var(--c-border);
}
```

**Available variables:** See `src/assets/styles/spec/utils/theme.css`

### Dark Mode Support

Ensure your components support dark mode:

```scss
.my-component {
  background: var(--c-bkg-card); // Auto-adjusts for dark mode
  
  // Or use data attribute
  [data-theme="dark"] & {
    background: #1f2937;
  }
}
```

## Best Practices

### Code Organization

- ✅ Keep files small and focused
- ✅ Use meaningful file and variable names
- ✅ Group related functionality
- ✅ Follow existing project structure
- ✅ Use webpack aliases for imports

### JavaScript

- ✅ Use modern ES6+ features
- ✅ Avoid jQuery patterns
- ✅ Use vanilla JavaScript DOM APIs
- ✅ Implement proper error handling
- ✅ Add JSDoc comments for complex functions

### SCSS

- ✅ Use variables for colors and spacing
- ✅ Follow BEM naming convention (optional)
- ✅ Keep selectors shallow (max 3 levels)
- ✅ Use mixins for repeated patterns
- ✅ Support dark mode with CSS variables

### Performance

- ✅ Minimize DOM manipulations
- ✅ Use event delegation
- ✅ Debounce/throttle frequent events
- ✅ Lazy load heavy components
- ✅ Optimize images and assets

### Accessibility

- ✅ Use semantic HTML
- ✅ Add ARIA labels where needed
- ✅ Ensure keyboard navigation
- ✅ Maintain color contrast ratios
- ✅ Test with screen readers

## Common Issues

### Port Already in Use

If port 4000 is already in use:

```bash
# Kill the process using port 4000 (Windows)
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change the port in webpack/devServer.js
```

### Changes Not Reflecting

1. **Hard refresh** the browser (Ctrl+F5)
2. **Clear browser cache**
3. **Restart development server**
4. **Check for JavaScript errors** in console
5. **Verify file is being watched** (check terminal output)

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm install
npm start
```

### Linting Errors

```bash
# Auto-fix common issues
npx eslint ./src --fix
npx stylelint "./src/**/*.scss" --fix

# Check remaining issues
npm run lint
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### 1. Use the Webpack Dashboard

```bash
npm run dev
```

Provides visual feedback on build performance and bundle size.

### 2. Keep the Console Clean

Fix warnings and errors as they appear to maintain code quality.

### 3. Test in Multiple Browsers

- Chrome/Edge (Chromium)
- Firefox
- Safari (if on macOS)
- Mobile browsers (responsive mode)

### 4. Use Browser DevTools

- **Elements tab** - Inspect and modify DOM/CSS
- **Console tab** - Debug JavaScript
- **Network tab** - Monitor requests
- **Performance tab** - Profile performance
- **Application tab** - Check localStorage/theme

### 5. Commit Often

Make small, focused commits with clear messages:

```bash
git add .
git commit -m "feat: add new dashboard widget"
git push
```

## Next Steps

Now that you understand the development workflow:

1. **[Customize Themes](../customization/theme-system.md)** - Set up dark mode and theming
2. **[Build for Production](build-deployment.md)** - Deploy your application
3. **[API Reference](../api/theme-api.md)** - JavaScript API documentation
4. **[Project Structure](project-structure.md)** - Review the codebase structure

---

**Need Help?** Check the [main README](../../README.md) or [open an issue](https://github.com/puikinsh/Adminator-admin-dashboard/issues).
