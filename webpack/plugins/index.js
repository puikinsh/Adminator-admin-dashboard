const manifest = require('../manifest');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const plugins = [];

plugins.push(
  ...(require('./htmlPlugin')),
  ...(require('./internal')),
  require('./caseSensitivePlugin'),
  require('./extractPlugin'),
  require('./copyPlugin')
);

if (manifest.IS_DEVELOPMENT) {
  plugins.push(require('./dashboardPlugin'));
}

if (manifest.IS_PRODUCTION) {
  plugins.push(require('./copyPlugin'));
}

// Bundle analyzer - run with ANALYZE=true npm run build
if (process.env.ANALYZE === 'true') {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-report.html',
    openAnalyzer: true,
  }));
}

module.exports = plugins;
