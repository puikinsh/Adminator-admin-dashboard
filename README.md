# Adminator Bootstrap 5 Admin Template v2.5.0

**Adminator** is a responsive Bootstrap 5 Admin Template built with modern development tools. It provides you with a collection of ready to use code snippets and utilities, custom pages, a collection of applications and some useful widgets. 

✨ **Latest Update (v2.5.0)**: Completely modernized build system with latest dependencies, ESLint 9.x flat config, and enhanced development experience.

Preview of this awesome admin template available here: https://colorlib.com/polygon/adminator/index.html

# Preview

### Screenshot

![Adminator admin dashboard template preview](https://colorlib.com/wp/wp-content/uploads/sites/2/adminator-free-admin-dashboard-template.jpg)

### Demo Site: [Here](https://colorlib.com/polygon/adminator/index.html)

## TOC
- [What's New in v2.5.0](#whats-new-in-v250)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing & Local Development](#installing--local-development)
- [Adminator for other platforms and frameworks](#adminator-for-other-platforms-and-frameworks)
- [Files/Folder Structure](#filesfolders-structure)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Changelog](#changelog)
- [Authors](#authors)
- [License](#license)

## What's New in v2.5.0

🎉 **Major Modernization Release** - Complete overhaul of the development stack:

- **🚀 Latest Dependencies**: All 22+ dependencies updated to latest versions
- **⚡ Modern Build Tools**: webpack 5.99.9, webpack-dev-server 5.2.2
- **🔧 ESLint 9.x**: Migrated to modern flat config format
- **🎨 Enhanced CSS**: Latest Sass (1.89.2), PostCSS (8.5.5), Bootstrap (5.3.6)
- **📊 Updated Components**: Chart.js 4.5.0, FullCalendar 6.1.17
- **🛡️ Zero Vulnerabilities**: Complete security audit with all packages secure
- **🔄 Modern Tooling**: babel-loader 10.x, copy-webpack-plugin 13.x, webpack-cli 6.x
- **📱 Enhanced Experience**: Better development server, faster builds, improved linting

## Getting Started

In order to run **Adminator** on your local machine all what you need to do is to have the prerequisites stated below installed on your machine and follow the installation steps down below. Prebuilt static assets can be found under [releases](https://github.com/puikinsh/Adminator-admin-dashboard/releases).

#### Prerequisites
  - **Node.js 18.12.0 or higher** (tested with Node.js 23.11.0)
  - **npm** (included with Node.js) or **Yarn**
  - **Git**

#### Installing & Local Development

Start by typing the following commands in your terminal in order to get **Adminator** full package on your machine and starting a local development server with live reload feature.

```bash
# Clone the repository
git clone https://github.com/puikinsh/Adminator-admin-dashboard.git adminator

# Navigate to the project directory
cd adminator

# Install dependencies
npm install

# Start development server (available at http://localhost:4000)
npm start

# Alternative: Start with webpack dashboard
npm run dev
```

#### Development Commands

```bash
# Development server with hot reload
npm start

# Development server with dashboard
npm run dev

# Build for production (optimized)
npm run build

# Build for production (unminified)
npm run release:unminified

# Build for production (minified)
npm run release:minified

# Preview production build
npm run preview

# Lint JavaScript files
npm run lint:js

# Lint SCSS files  
npm run lint:scss

# Run all linters
npm run lint
```

## Adminator for other platforms and frameworks
* [Adminator right to left](https://github.com/mortezakarimi/Adminator-admin-dashboard-rtl) - Adminator modified to work with right to left languages like Persian and Arabic

## Files/Folders Structure

Here is a brief explanation of the template folder structure and some of its main files usage:

```
└── src                         # Contains all template source files.
│   └── assets                  # Contains JS, CSS, images and icon fonts.
│   │   └── scripts             # Contains all JavaScript files.
│   │   │   └── charts          # Chart.js, Sparkline & Pie Chart plugins init.
│   │   │   └── chat            # All chat app JS code.
│   │   │   └── constants       # Template constant values like color values.
│   │   │   └── datatable       # Date table plugin init.
│   │   │   └── datepicker      # Bootstrap datepicker init.
│   │   │   └── email           # All email app code.
│   │   │   └── fullcalendar    # Fullcalendar plugin init.
│   │   │   └── googleMaps      # Google maps API integration code.
│   │   │   └── masonry         # Masonry layout code.
│   │   │   └── popover         # Bootstrap popover plugin init.
│   │   │   └── scrollbar       # Perfect scrollbar plugin init.
│   │   │   └── search          # Topbar toggle search init.
│   │   │   └── sidebar         # Sidebar JS code.
│   │   │   └── skycons         # Animated icons plugin init.
│   │   │   └── utils           # Basic utils used for proper rendering.
│   │   │   └── vectorMaps      # Vector maps plugin init.
│   │   │   └── app.js          # Main application entry point.
│   │   │
│   │   └── static              # Contains the non-code files.
│   │   │   └── fonts           # Contains icon fonts.
│   │   │   └── images          # Contains all template images/svg.
│   │   │
│   │   └── styles              # Contains all SCSS files.
│   │       └── spec            # Contains custom SCSS files.
│   │       │   └── components  # Contains all template components.
│   │       │   └── generic     # Contains basic scaffolding styles.
│   │       │   └── screens     # Contains views specific styles.
│   │       │   └── settings    # Contains all template variables.
│   │       │   └── tools       # Contains all mixins.
│   │       │   └── utils       # Contains helper classes.
│   │       │   └── index.scss  # Indicator file.
│   │       │
│   │       └── vendor          # Contains all plugin files & custom styles.
│   │       └── index.scss      # Main style entry point.
│   │
│   └── *.html                  # All HTML template pages.
└── webpack                     # Contains Webpack configuration.
│   └── plugins                 # Contains all Webpack plugins config.
│   └── rules                   # Contains Webpack loaders config.
│   └── config.js               # Main Webpack configuration.
│   └── devServer.js            # Development server configuration.
│   └── manifest.js             # Build system constants.
│
└── .babelrc                    # Babel ES6 transpiler configuration.
└── .editorconfig               # Code editor consistency settings.
└── eslint.config.mjs           # ESLint 9.x flat configuration.
└── .gitattributes              # Git attributes configuration.
└── .gitignore                  # Git ignore patterns.
└── .stylelintrc.json           # SCSS/CSS linting configuration.
└── browserslist                # Supported browsers configuration.
└── CHANGELOG.md                # Version history and updates.
└── package.json                # Node.js package configuration.
└── README.md                   # This documentation file.
└── webpack.config.js           # Webpack entry configuration.
```

## Deployment

In deployment process, you have several commands:

1. **Production Build** - Generate optimized assets for production:
```bash
npm run build
```

2. **Production Preview** - Preview the production build locally:
```bash
npm run preview
```

3. **Custom Builds**:
```bash
# Unminified production build (for debugging)
npm run release:unminified

# Minified production build (smallest size)
npm run release:minified
```

The built files will be available in the `dist/` directory.

## Built With

### Core Framework & Build Tools
- [Bootstrap 5.3.6](http://getbootstrap.com/) - Modern CSS framework
- [Webpack 5.99.9](https://webpack.js.org/) - Module bundler and build tool
- [Babel 7.27.x](https://babeljs.io/) - JavaScript transpiler
- [Sass 1.89.2](http://sass-lang.com/) - CSS preprocessor
- [PostCSS 8.5.5](http://postcss.org/) - CSS transformations
- [ESLint 9.29.0](https://eslint.org/) - JavaScript linting (flat config)
- [Stylelint 16.20.0](https://stylelint.io/) - CSS/SCSS linting

### UI Components & Charts
- [Chart.js 4.5.0](http://www.chartjs.org/) - Modern charting library
- [FullCalendar 6.1.17](https://fullcalendar.io/) - Interactive calendar
- [DataTables](https://datatables.net/) - Advanced table functionality
- [Easy Pie Chart](http://rendro.github.io/easy-pie-chart/) - Animated pie charts
- [Perfect Scrollbar 1.5.6](https://github.com/utatti/perfect-scrollbar) - Custom scrollbars

### JavaScript Libraries
- [jQuery 3.7.1](https://jquery.com/) - DOM manipulation library
- [Lodash 4.17.21](https://lodash.com/) - Utility library
- [Moment.js 2.30.1](https://momentjs.com/) - Date manipulation
- [Masonry 4.2.2](https://masonry.desandro.com/) - Grid layouts
- [jQuery Sparkline](https://omnipotent.net/jquery.sparkline/) - Inline charts
- [jVectorMap](http://jvectormap.com/) - Interactive vector maps

### Icons & Fonts
- [Font Awesome](http://fontawesome.io/) - Icon library
- [Themify Icons](https://themify.me/themify-icons) - Additional icons
- [Roboto Font](https://fonts.google.com/specimen/Roboto) - Google Fonts

### Additional Plugins
- [Bootstrap Datepicker](https://bootstrap-datepicker.readthedocs.io/) - Date selection
- [Skycons](https://darkskyapp.github.io/skycons/) - Animated weather icons
- [Load Google Maps API](https://github.com/yuanqing/load-google-maps-api) - Maps integration

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

#### Latest Release: V 2.5.0 (2025-06-16)
- Complete modernization of build system and dependencies
- Updated to ESLint 9.x with flat config
- All 22+ dependencies updated to latest versions
- Enhanced development experience and performance
- Zero security vulnerabilities

#### Previous Releases
- **V 2.1.0**: Upgraded all dependencies
- **V 2.0.0**: Upgrade to Bootstrap 5
- **V 1.1.0**: Upgrade to webpack 5
- **V 1.0.0**: Initial Release

## Authors
[Colorlib](https://colorlib.com)

## More info
- [Bootstrap Dashboards](https://colorlib.com/wp/free-bootstrap-admin-dashboard-templates/)
- [Bootstrap Templates](https://colorlib.com/wp/free-bootstrap-templates/)
- [HTML Templates](https://colorlib.com/wp/free-html-website-templates/)
- [Free Admin Dashboards](https://colorlib.com/wp/free-html5-admin-dashboard-templates/)
- [Website Templates](https://colorlib.com/wp/templates/)
- [Free CSS Templates](https://colorlib.com/wp/free-css-website-templates/)
- [WordPress Themes](https://colorlib.com/wp/free-wordpress-themes/)

## License

Adminator is licensed under The MIT License (MIT). Which means that you can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the final products. But you always need to state that Colorlib is the original author of this template.
