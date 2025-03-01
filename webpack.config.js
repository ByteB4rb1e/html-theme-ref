const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: "production",
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: {
        tiara: [
            "./src/script/index.ts",
            "./src/style/themes/tiara/index.scss"
        ],
        fontawesome: [
            "./node_modules/@fortawesome/fontawesome-free/js/fontawesome.js",
            "./node_modules/@fortawesome/fontawesome-free/scss/regular.scss",
            "./node_modules/@fortawesome/fontawesome-free/scss/solid.scss",
            "./node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss",
        ],
        boxicons: [
            "./node_modules/boxicons/css/boxicons.min.css",
        ],
    },
    output: {
        filename: "script/[name].js",
        path: resolve(__dirname, "build/production"),
    },
    plugins: [new MiniCssExtractPlugin({ filename: "style/[name].css" })],
    optimization: { minimizer: [`...`, new CssMinimizerPlugin()] },
    module: {
        rules: [
        {
            test: /\.s?[ca]ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: "css-loader", options: { sourceMap: true } },
                { loader: "postcss-loader", options: { sourceMap: true } },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            silenceDeprecations: ['import', 'global-builtin'],
                        },
                    },
                },
            ],
        },
        {
            test: /\.tsx?$/,
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
            test: /\.(woff|woff2|eot|ttf)$/,
            type: 'asset/resource',
            generator: {
                filename: 'font/[hash][ext][query]'
            }
        },
    ],
  },
};


