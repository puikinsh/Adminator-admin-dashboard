module.exports = {
  test    : /\.(js|jsx)$/,
  exclude : /(node_modules|build|dist\/)/,
  use     : ['babel-loader'],
};
