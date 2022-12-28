const ExtractTextPlugin = require('mini-css-extract-plugin'),
  manifest = require('../manifest');

module.exports = new ExtractTextPlugin({
  filename: manifest.outputFiles.css,
  // allChunks: true,
});
