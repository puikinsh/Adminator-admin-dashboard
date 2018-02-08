const
  manifest          = require('../manifest');

const plugins = [];

plugins.push(
  require('./imageminPlugin'),
  ...(require('./htmlPlugin')),
  ...(require('./internal')),
  require('./caseSensitivePlugin'),
  require('./extractPlugin')
);

if (manifest.IS_DEVELOPMENT) {
  plugins.push(require('./dashboardPlugin'));
}

if (manifest.IS_PRODUCTION) {
  plugins.push(require('./copyPlugin'));
}

module.exports = plugins;
