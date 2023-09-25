const
  manifest          = require('../manifest'),
  ExtractTextPlugin = require('mini-css-extract-plugin');

module.exports = new ExtractTextPlugin({
  filename: manifest.outputFiles.css,
  // allChunks: true,
});
