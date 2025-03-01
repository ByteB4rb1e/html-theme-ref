const fs = require('fs');
const path = require('path');

const escapeHtml = require('escape-html');

const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require('./webpack.config.debug.js');

function fromDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        throw new Error(`path does not exist: '${startPath}'`, startPath);
    }

    var out = [];

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            out = [...out, ...fromDir(filename, filter)];
        } else if (filename.endsWith(filter)) {
            out.push(filename);
        };
    };

    return out;
};



config.output.path = path.resolve(__dirname, 'build/demo');

const DEMO_PARTIAL_EXT = '.htm';
const DEMO_PARTIAL_PATH = ['demo', 'partial'];
const DEMO_SANDBOX_BASEDIR = 'sandbox';

const DEMO_PARTIALS = fromDir(path.join(...DEMO_PARTIAL_PATH), DEMO_PARTIAL_EXT);

var out = {};

for (var i = 0; i < DEMO_PARTIALS.length; i += 1) {

    let dirname = DEMO_PARTIALS[i].split(path.sep);
    let basename = dirname.splice(dirname.length - 1, 1);

    let removed = dirname.splice(0, DEMO_PARTIAL_PATH.length);
    if (path.join(...removed) !== path.join(...DEMO_PARTIAL_PATH)) {
        throw new Error(`${removed} != ${DEMO_PARTIAL_PATH}`);
    }

    let filename = path.join(
        DEMO_SANDBOX_BASEDIR,
        path.join(...dirname),
        `${path.basename(path.join(...basename), DEMO_PARTIAL_EXT)}.html`
    );

    let c = {
        title: 'Demo',
        filename: filename,
        template: 'demo/template/sandbox.html',
        templateParameters: {
            partial: fs.readFileSync(DEMO_PARTIALS[i])
        },
    };

    let outDir = path.dirname(filename);

    if (out[outDir] === undefined) { out[outDir] = [] }

    let raw = fs.readFileSync(DEMO_PARTIALS[i]);

    out[outDir].push([filename, escapeHtml(raw)]);

    config.plugins.push(new HtmlWebpackPlugin(c));
}

config.plugins.push(new HtmlWebpackPlugin({
    title: "Demo (Kitchen-Sink)",
    template: "demo/template/index.html",
    inject: false,
    templateParameters: {
        sandboxes: out,
        description: "This page includes every single element so that we can make sure things work together smoothly."
    }
}));

config.entry['dev-server'] = [
   'webpack/hot/dev-server.js',
   'webpack-dev-server/client/index.js?hot=true&live-reload=true',
]

module.exports = {
    ...config,
    devServer: {
        compress: true,
        open: true,
        watchFiles: ['demo/**/*.htm', 'src/**/*.scss', 'src/**/*.ts']
    },
};
