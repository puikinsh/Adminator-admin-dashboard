const
  path              = require('path'),
  manifest          = require('../manifest'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

const titles = {
  'index': 'Dashboard',
  'blank': 'Blank',
  'buttons': 'Buttons',
  'calendar': 'Calendar',
  'charts': 'Charts',
  'ads': 'ads',
  'ads_1':'ads_1',
  'new-ad':'new-ad',
  'ad-details':'ad-details',
  'reports':'reports',
  'history':'history',
  'chat': 'Chat',
  'compose': 'Compose',
  'datatable': 'Datatable',
  'email': 'Email',
  'forms': 'Forms',
  'profile': 'profile',
  'users': 'users',
  'companies': 'companies',
  'referees': 'referees',
  'login': 'login',
  'google-maps': 'Google Maps',
  'signin': 'Signin',
  'signup': 'Signup',
  'ui': 'UI',
  'vector-maps': 'Vector Maps',
  '404': '404',
  '500': '500',
  'basic-table': 'Basic Table',
};

module.exports = Object.keys(titles).map(title => {
  return new HtmlWebpackPlugin({
    template: path.join(manifest.paths.src, `${title}.html`),
    path: manifest.paths.build,
    filename: `${title}.html`,
    inject: true,
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    },
  });
});
