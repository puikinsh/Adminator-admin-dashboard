const CopyWebpackPlugin = require('copy-webpack-plugin'),
  path = require('path'),
  manifest = require('../manifest');

module.exports = new CopyWebpackPlugin({
  patterns: [
    {
      from: path.join(manifest.paths.src, 'assets/static'),
      to: path.join(manifest.paths.build, 'assets/static'),
    },
  ],
});
