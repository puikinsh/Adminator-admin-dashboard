module.exports = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  exclude : /(node_modules)/,
  use     : ['file-loader'],
};

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.(png|jpe?g|gif)$/i,
//         exclude : /(node_modules)/,
//         use: [
//           {
//             loader: 'file-loader',
//           },
//         ],
//       },
//     ],
//   },
// };
