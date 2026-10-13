const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const plugins = [];

plugins.push(
  ...(require('./htmlPlugin')),
  ...(require('./internal')),
  require('./caseSensitivePlugin'),
  require('./extractPlugin')
);

// Bundle analyzer - run with ANALYZE=true npm run build
if (process.env.ANALYZE === 'true') {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-report.html',
    openAnalyzer: false,
  }));
}

module.exports = plugins;
