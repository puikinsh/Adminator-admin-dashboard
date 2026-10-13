module.exports = {
  test    : /\.(png|gif|jpe?g|webp|avif|svg)$/i,
  exclude : /(node_modules)/,
  type    : 'asset/resource',
  generator: {
    filename: 'assets/[name].[contenthash:8][ext]',
  },
};
