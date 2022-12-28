const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = [
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.sharpMinify,
      options: {
        encodeOptions: {
          // Your options for `sharp`
          // https://sharp.pixelplumbing.com/api-output
        },
      },
    },
  }),
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.svgoMinify,
      options: {
        encodeOptions: {
          // Pass over SVGs multiple times to ensure all optimizations are applied. False by default
          multipass: true,
          plugins: [
            // set of built-in plugins enabled by default
            // see: https://github.com/svg/svgo#default-preset
            'preset-default',
          ],
        },
      },
    },
  }),
];
