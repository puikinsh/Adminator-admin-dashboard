// ---------------------
// @Loading Dependencies
// ---------------------

const
  manifest = require('./manifest');


// ------------------
// @DevServer Configs
// ------------------

/**
 * [1] : To enable local network testing
 */

const devServer = {
  static: {
    directory: manifest.IS_PRODUCTION ? manifest.paths.build : manifest.paths.src,
    watch: true,
  },
  historyApiFallback: true,
  port: manifest.IS_PRODUCTION ? 3001 : 4000,
  compress: manifest.IS_PRODUCTION,
  client: {
    overlay: true,
    progress: !manifest.IS_PRODUCTION,
  },
  hot: !manifest.IS_PRODUCTION,
  host: '0.0.0.0',
  allowedHosts: 'all', // [1]
  devMiddleware: {
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: true,
    },
  },
};


// -----------------
// @Exporting Module
// -----------------

module.exports = devServer;