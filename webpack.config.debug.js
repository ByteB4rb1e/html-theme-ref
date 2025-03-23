const path = require("path");
const config = require('./webpack.config.js');
const CopyPlugin = require("copy-webpack-plugin");

config.output.path = path.resolve(__dirname, 'build/debug');
config.module.rules[1].use[0].options.configFile = 'tsconfig.debug.json';

config.plugins.push(new CopyPlugin({
    patterns: [
        // allows for wrapping projects, that generate this project's
        // assets dynamically, not having to worry about auxiliary
        // debugging assets polution. See the file for more information.
        {
            from: path.resolve(__dirname, 'src/.gitignore-output'),
            // TODO: find a cleaner way as to not have to reference the output
            // path manually. It's hard to believe how convoluted the
            // CopyWebpackPlugin is for something as simple as applying globbing
            // patterns and moving files from A to B, while respecting the
            // global context set in webpack. Why do I have to explicitly say
            // where the file should go, if I already defined it via the output
            // path??  I just want to rename the basename...
            to: ({context, absoluteFilename}) => path.join(
                config.output.path,
                '.gitignore'
            ),
            toType: 'file'
        },
    ],
}));

// disable CSS minification
//config.module.rules[0].use.splice(0, 1);

module.exports = {
    ...config,
    mode: 'development',
    devtool: 'source-map',
};
