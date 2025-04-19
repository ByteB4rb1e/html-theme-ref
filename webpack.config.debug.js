const path = require("path");
const config = require('./webpack.config.js');

config.output.path = path.resolve(__dirname, 'build/debug');
config.module.rules[1].use[0].options.configFile = 'tsconfig.debug.json';

// disable CSS minification
//config.module.rules[0].use.splice(0, 1);

module.exports = {
    ...config,
    mode: 'development',
    devtool: 'source-map',
};
