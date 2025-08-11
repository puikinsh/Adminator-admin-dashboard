module.exports = {
  test    : /\.(png|gif|jpg?g|svg)$/i,
  exclude : /(node_modules)/,
  type    : 'asset/resource',
  generator: {
    filename: 'assets/[name][ext]',
  },
};
