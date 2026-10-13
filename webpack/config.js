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
  entry = {
    '2026': path.join(manifest.paths.src, 'assets', 'scripts', '2026', 'index.js'),
  };


// ---------------
// @Path Resolving
// ---------------

const resolve = {
  extensions: ['.tsx', '.ts', '.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
  modules: [
    path.join(__dirname, '../node_modules'),
    path.join(manifest.paths.src, ''),
  ],
  /* Only '@' survives. The '@/components', '@/utils' and '@/constants'
     aliases pointed at directories deleted in the 2026 rewrite, so they
     resolved to nothing. */
  alias: {
    '@': path.join(manifest.paths.src),
  },
};

const optimization = {
  minimize: manifest.MINIFY,
  // Code splitting for better caching and smaller initial bundle
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    /* No hand-written vendor cacheGroups.
       Chart.js, FullCalendar and jsvectormap are each reached through a single
       dynamic import() carrying a webpackChunkName comment, so webpack already
       emits one async chunk per library. A catch-all `vendors` group with a
       static `name` actively fights that — it collapses every node_modules
       module into one chunk, which is how calendar.html ended up downloading
       Chart.js. Anything genuinely shared still gets split by the defaults. */
    cacheGroups: {
      /* webpack's built-in `defaultVendors` group re-splits node_modules code
         out of our named async chunks, which left jsvectormap's library code in
         an unnamed numeric chunk and the readable name on a 0.1 KB stub.
         Turning it off keeps each library in the chunk its import() named. */
      defaultVendors: false,
      default: {
        minChunks: 2,
        priority: -20,
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
  context: manifest.paths.src,
  entry,
  mode: manifest.NODE_ENV,
  cache: {
    type: 'filesystem',
    name: `${manifest.NODE_ENV}-${manifest.MINIFY ? 'minified' : 'unminified'}`,
    buildDependencies: { config: [__filename, path.resolve(__dirname, '../package.json')] },
  },
  performance: {
    // Budget initial downloads separately from intentionally lazy widgets.
    maxEntrypointSize: 140 * 1024,
    maxAssetSize: 320 * 1024,
    hints: manifest.MINIFY ? 'error' : false,
  },
  module: { rules },
  optimization,
  resolve,
  plugins,
  devServer,
  output: {
    path: manifest.paths.build,
    /* Content-hashed names in production so the CDN's immutable cache
       headers stop biting users post-deploy. HtmlWebpackPlugin rewrites
       the <script> tags to the hashed filenames automatically. */
    filename: manifest.IS_PRODUCTION ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: manifest.IS_PRODUCTION ? '[name].[contenthash:8].js' : '[name].js',
  },
};
