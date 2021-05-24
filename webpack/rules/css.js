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

const
  manifest          = require('../manifest'),
  ExtractTextPlugin = require('mini-css-extract-plugin');


// ---------------
// @Common Loaders
// ---------------

let rule = {};

const loaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap : manifest.IS_DEVELOPMENT,
      // minimize  : manifest.IS_PRODUCTION,
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
    // loader: ExtractTextPlugin({
    //   use: loaders,
    // }),
    use: [ExtractTextPlugin.loader, loaders],
  };
}


// ----------------------------
// @Merging Development Loaders
// ----------------------------

if (manifest.IS_DEVELOPMENT) {
  rule = {
    test: /\.css$/,
    use: [{
      loader: 'style-loader',
    }].concat(loaders),
  };
}


// -----------------
// @Exporting Module
// -----------------

module.exports = rule;
