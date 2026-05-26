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
  context: manifest.paths.src,
  entry,
  mode: manifest.NODE_ENV,
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
