import * as path from 'path';

import releaseConfig from './webpack.config.mjs';


export default (env, argv) => {
    const config = releaseConfig(env, argv);

    config.output.path = path.resolve('build', 'debug');
    // TODO: search for ts-loader instances, instead of hard-coding...
    config.module.rules[1].use[0].options.configFile = 'tsconfig.debug.json';
    config.module.rules[1].use[0].options.compilerOptions = {
        "outDir": path.join(config.output.path, 'script')
    };

    // disable CSS minification
    //config.module.rules[0].use.splice(0, 1);

    return {
        ...config,
        mode: 'development',
        devtool: 'source-map',
    };
}
