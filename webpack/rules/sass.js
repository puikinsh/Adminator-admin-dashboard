// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Common Loaders
 * + @Exporting Module
 */


// ---------------------
// @Loading Dependencies
// ---------------------

const
  manifest          = require('../manifest'),
  path              = require('path'),
  cssNext           = require('postcss-preset-env'),
  ExtractTextPlugin = require('mini-css-extract-plugin');

// ---------------
// @Common Loaders
// ---------------

const loaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap : manifest.IS_DEVELOPMENT
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: manifest.IS_DEVELOPMENT,
      postcssOptions: {
        plugins: [
          [
            cssNext(),
          ],
        ],
      },
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: manifest.IS_DEVELOPMENT,
      sassOptions: {
        outputStyle: manifest.MINIFY ? 'compressed' : 'expanded',
        includePaths: [
          path.join('../../', 'node_modules'),
          path.join(manifest.paths.src, 'assets', 'styles'),
          path.join(manifest.paths.src, ''),
        ],
      },
    }
  }
];

if (manifest.IS_PRODUCTION) {
  loaders.unshift(ExtractTextPlugin.loader);
} else {
  loaders.unshift({
    loader: 'style-loader',
  });
}

const rule = {
  test: /\.scss$/,
  use: loaders
};

// -----------------
// @Exporting Module
// -----------------

module.exports = rule;
