const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: {
        tiara: [
            "./src/script/index.ts",
            "./src/style/themes/tiara/index.scss"
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
            test: /\.scss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: "css-loader", options: { sourceMap: true } },
                { loader: "postcss-loader", options: { sourceMap: true } },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            silenceDeprecations: ['import'],
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


