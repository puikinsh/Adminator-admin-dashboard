module.exports = {
    test: /\.elm$/,
    exclude: [/elm-stuff/, /node_modules/],
    use: {
        loader: 'elm-webpack-loader',
        options: {}
    }
};
