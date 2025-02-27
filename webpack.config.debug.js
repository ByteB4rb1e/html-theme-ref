const config = require('./webpack.config.js');

config.module.rules[0].use[0].options.configFile = 'tsconfig.debug.json';

//disable CSS minification;
config.module.rules[0].use.splice(2, 1);

module.exports = {
    ...config,
};
