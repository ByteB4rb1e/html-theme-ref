const path = require("path");
const config = require('./webpack.config.js');

config.output.path = path.resolve(__dirname, 'build/debug');
// TODO: search for ts-loader instances, instead of hard-coding...
config.module.rules[1].use[0].options.configFile = 'tsconfig.debug.json';
config.module.rules[1].use[0].options.compilerOptions = {
    "outDir": path.join(config.output.path, 'script')
};

// disable CSS minification
//config.module.rules[0].use.splice(0, 1);

module.exports = {
    ...config,
    mode: 'development',
    devtool: 'source-map',
};
