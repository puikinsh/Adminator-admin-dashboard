// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Entry Point Setup
 * + @Path Resolving
 * + @Exporting Module
 */


// ---------------------
// @Loading Dependencies
// ---------------------

const
  path = require('path'),
  manifest = require('./manifest'),
  devServer = require('./devServer'),
  rules = require('./rules'),
  plugins = require('./plugins');

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// ------------------
// @Entry Point Setup
// ------------------

const
  entry = [
    path.join(manifest.paths.src, 'assets', 'scripts', manifest.entries.js),
  ];


// ---------------
// @Path Resolving
// ---------------

const resolve = {
  extensions: ['.tsx', '.ts', '.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
  modules: [
    path.join(__dirname, '../node_modules'),
    path.join(manifest.paths.src, ''),
  ],
  alias: {
    '@': path.join(manifest.paths.src),
    '@/components': path.join(manifest.paths.src, 'assets', 'scripts', 'components'),
    '@/utils': path.join(manifest.paths.src, 'assets', 'scripts', 'utils'),
    '@/constants': path.join(manifest.paths.src, 'assets', 'scripts', 'constants'),
  },
};

const optimization = {
  minimize: manifest.MINIFY,
  // Code splitting for better caching and smaller initial bundle
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      // Vendor chunks
      chartjs: {
        test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
        name: 'vendor-chartjs',
        priority: 30,
      },
      fullcalendar: {
        test: /[\\/]node_modules[\\/]@fullcalendar[\\/]/,
        name: 'vendor-fullcalendar',
        priority: 30,
      },
      bootstrap: {
        test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
        name: 'vendor-bootstrap',
        priority: 20,
      },
      // Other node_modules
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
        reuseExistingChunk: true,
      },
      // Common code shared between entry points
      common: {
        name: 'common',
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
      },
    },
  },
  // Extract webpack runtime into separate chunk
  runtimeChunk: 'single',
};

if (manifest.MINIFY) {
  optimization.minimizer = [
    new CssMinimizerPlugin(),
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: manifest.IS_PRODUCTION,
          drop_debugger: manifest.IS_PRODUCTION,
        },
        output: {
          comments: false,
        },
      },
      extractComments: false,
    }),
  ];
}

// -----------------
// @Exporting Module
// -----------------
module.exports = {
  devtool: manifest.IS_PRODUCTION ? false : 'source-map',
  context: path.join(manifest.paths.src, manifest.entries.js),
  // watch: !manifest.IS_PRODUCTION,
  entry,
  mode: manifest.NODE_ENV,
  // output: {
  //   path: manifest.paths.build,
  //   publicPath: '',
  //   filename: manifest.outputFiles.bundle,
  // },
  module: {
    rules,
  },
  optimization,
  resolve,
  plugins,
  devServer,
  // Suppress Bootstrap SASS deprecation warnings (modern syntax)
  ignoreWarnings: [
    /Deprecation Warning/,
    /node_modules\/bootstrap/,
    /repetitive deprecation warnings omitted/,
    /red\(\) is deprecated/,
    /green\(\) is deprecated/,
    /blue\(\) is deprecated/,
    /Global built-in functions are deprecated/,
  ],
};
