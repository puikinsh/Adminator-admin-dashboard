const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  manifest = require('../manifest');

const titles = {
  'index': 'Dashboard',
  'blank': 'Blank',
  'buttons': 'Buttons',
  'calendar': 'Calendar',
  'charts': 'Charts',
  'chat': 'Chat',
  'compose': 'Compose',
  'datatable': 'Datatable',
  'email': 'Email',
  'forms': 'Forms',
  'google-maps': 'Google Maps',
  'signin': 'Signin',
  'signup': 'Signup',
  'ui': 'UI',
  'vector-maps': 'Vector Maps',
  '404': '404',
  '500': '500',
  'basic-table': 'Basic Table',
  'test': 'Test',
};

let minify = {
  collapseWhitespace: false,
  minifyCSS: false,
  minifyJS: false,
  removeComments: true,
  useShortDoctype: false,
};

if (manifest.MINIFY) {
  minify = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    useShortDoctype: true,
  };
}

module.exports = Object.keys(titles).map((title) => {
  return new HtmlWebpackPlugin({
    template: path.join(manifest.paths.src, `${title}.html`),
    path: manifest.paths.build,
    filename: `${title}.html`,
    inject: true,
    minify,
  });
});
