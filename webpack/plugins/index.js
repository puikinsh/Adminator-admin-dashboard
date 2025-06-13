const
  manifest          = require('../manifest');

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

module.exports = plugins;
