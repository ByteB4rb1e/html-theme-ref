const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
    module: {
        rules: [
          {
            test: /\.ts$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json'
                    }
                }
            ],
            exclude: /node_modules/,
          },
          {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require('cssnano')({ preset: 'default' })
                            ]
                        }
                    }
                },
                'sass-loader',
            ],
            exclude: /node_modules/,
          },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss'],
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({ filename: '[name].css'}),
    ]
};
