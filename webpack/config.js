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
  extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
  modules: [
    path.join(__dirname, '../node_modules'),
    path.join(manifest.paths.src, ''),
  ],
};

const optimization = {
  minimize: manifest.MINIFY
};

if (manifest.MINIFY) {
  optimization.minimizer = [
    new CssMinimizerPlugin(),
    new TerserPlugin()
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
  optimization: optimization,
  resolve,
  plugins,
  devServer,
  // Suppress Bootstrap SASS deprecation warnings
  stats: {
    warningsFilter: [
      /Deprecation Warning/,
      /node_modules\/bootstrap/,
      /repetitive deprecation warnings omitted/
    ]
  }
};
