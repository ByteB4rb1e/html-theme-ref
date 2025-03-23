const path = require("path");
/*
 * DISREGARD: just a vent in German
 *
 * Haben wir noch Namespaces dabei? Keins mehr? Keine mehr? Zwei noch?  Hast du
 * die Namespaces noch genommen? Hallo? Der ist ein bisschen ein Otto
 * geworden... Aber ich hab' Respekt vor dem. Ich hät jetzt Bock auf Namespaces.
 * Boah, wir würden so namespacen... `@webpackcontrib/css-minimizer-plugin`,
 * `webpack-css-minimizer-plugin`...
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: "production",
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        /**
         * Font files are larger than what's recommended by webpack.
         *
         * First of: OWN YOUR ASSETS! Don't expect everything to be hosted via a
         * CDN from the start. That's optimizations you can think about later
         * on.
         *
         * Second: That's not the whole picture. HTTP supports gzip and even
         * brotli compression, which both have a high compression ratio. We're
         * mainly worried about transmission sizes, not storage sizes, so
         * nagging about the original file size is not only overly excessive,
         * it tries to enforce optimization where it's not necessary.
         */
        maxAssetSize: 512000,
        /**
         * just dropping this comment to vent a little...
         *
         * ECMAScript dynamic imports? Check. Though unconvential, I see why it
         * was designed that way. webpack code-splitting? Not very well
         * documented and some very confusing behavior, where it's difficult to
         * discern the MUSTs from the SHOULDs. All I wanted was for webpack to
         * resolve the URL and place the referenced asset where I want it to in
         * accordance with whatever I defined in the webpack configuration.
         * Instead I'm getting some random warnings about file sizes and
         * chunking recommendations. Enabling chunking, still the same
         * warning... So deep down the rabbit hole, I almost forgot what I was
         * even trying to do: just reference a freaking file and have it
         * resolved, that's all! If the warning was just printed to console
         * stdout, fine. No, instead it's this massive overlay in the HMR that
         * makes the web page unusable... For a warning... With the text even
         * being in red... I could just disable the warnings? I'm not in the
         * business of ignoring warnings. You warn me, I act upon it.
         */
        assetFilter: assetFilename => {
            return !assetFilename.endsWith('.mp3');
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    entry: {
        tiara: [
            "./src/script/main.ts",
            "./src/style/main.scss"
        ]
    },
    output: {
        filename: "script/[name].js",
        path: path.resolve(__dirname, "build/production"),
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "style/[name].css" }),
    ],
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
                            silenceDeprecations: ['global-builtin'],
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
        {
            test: /\.(mp3)$/,
            include: /vendor/,
            type: 'asset/resource',
            generator: {
                filename: 'audio/[name][ext]',
            },
        },
        {
            test: /\.(gif)$/,
            include: /vendor/,
            type: 'asset/resource',
            generator: {
                filename: 'image/[name][ext]',
            },
        },
    ],
  },
};


