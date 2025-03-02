const escapeHtml = require('escape-html');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const fs = require('fs');
const path = require('path');

const config = require('./webpack.config.debug.js');

/**
 * recursively search files by suffix
 *
 * @param root - path to root directory
 * @param suffix - file suffix to filter for
 */
function findFilesBySuffix(root, suffix) {
    if (!fs.existsSync(root)) {
        throw new Error(`path does not exist: '${startPath}'`, startPath);
    }

    var out = [];
    var files = fs.readdirSync(root);

    for (var i = 0; i < files.length; i++) {
        let filename = path.join(root, files[i]);
        let stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            out = [...out, ...findFilesBySuffix(filename, suffix)];
        }
        else if (filename.endsWith(suffix)) { out.push(filename) }
    };

    return out;
};

const BUILDTARGET = 'doc';
const BUILDDIR = 'build';
const DOC_PARTIAL_EXT = '.htm';
const DOC_PARTIAL_PATH = ['docs', 'partial'];
const DOC_SANDBOX_BASEDIR = 'sandbox';
const DOC_PARTIALS = findFilesBySuffix(path.join(...DOC_PARTIAL_PATH), DOC_PARTIAL_EXT);

config.output.path = path.resolve(__dirname, path.join(BUILDDIR, BUILDTARGET));

var out = {};

for (var i = 0; i < DOC_PARTIALS.length; i += 1) {

    let dirname = DOC_PARTIALS[i].split(path.sep);
    let basename = dirname.splice(dirname.length - 1, 1);

    let removed = dirname.splice(0, DOC_PARTIAL_PATH.length);
    if (path.join(...removed) !== path.join(...DOC_PARTIAL_PATH)) {
        throw new Error(`${removed} != ${DOC_PARTIAL_PATH}`);
    }

    let filename = path.join(
        DOC_SANDBOX_BASEDIR,
        path.join(...dirname),
        `${path.basename(path.join(...basename), DOC_PARTIAL_EXT)}.html`
    );

    let c = {
        title: 'Documentation',
        filename: filename,
        template: 'docs/template/sandbox.html',
        templateParameters: {
            partial: fs.readFileSync(DOC_PARTIALS[i])
        },
    };

    let outDir = path.dirname(filename);

    if (out[outDir] === undefined) { out[outDir] = [] }

    let raw = fs.readFileSync(DOC_PARTIALS[i]);

    out[outDir].push([filename, escapeHtml(raw)]);

    config.plugins.push(new HtmlWebpackPlugin(c));
}

config.plugins.push(new HtmlWebpackPlugin({
    title: "Demo (Kitchen-Sink)",
    template: "docs/template/index.html",
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
        watchFiles: ['docs/**/*.htm', 'src/**/*.scss', 'src/**/*.ts']
    },
};
