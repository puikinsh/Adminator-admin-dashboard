module.exports = {
  test: /\.tsx?$/,
  exclude: /(node_modules|build|dist\/)/,
  use: [
    {
      loader: 'babel-loader',
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        experimentalWatchApi: true,
      },
    },
  ],
};