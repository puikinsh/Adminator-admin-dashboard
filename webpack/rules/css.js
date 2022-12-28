// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Common Loaders
 * + @Merging Production Loaders
 * + @Merging Development Loaders
 * + @Exporting Module
 */

// ---------------------
// @Loading Dependencies
// ---------------------

const ExtractTextPlugin = require('mini-css-extract-plugin'),
  manifest = require('../manifest');

// ---------------
// @Common Loaders
// ---------------

let rule = {};

const loaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: manifest.IS_DEVELOPMENT,
      importLoaders: 1,
    },
  },
];

// ---------------------------
// @Merging Production Loaders
// ---------------------------

if (manifest.IS_PRODUCTION) {
  rule = {
    test: /\.css$/,
    use: [
      {
        loader: ExtractTextPlugin.loader,
      },
    ].concat(loaders),
  };
}

// ----------------------------
// @Merging Development Loaders
// ----------------------------

if (manifest.IS_DEVELOPMENT) {
  rule = {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader',
      },
    ].concat(loaders),
  };
}

// -----------------
// @Exporting Module
// -----------------

module.exports = rule;
