const chokidar = require('chokidar');
const escapeHtml = require('escape-html');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { globSync } = require('glob');

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
const DOC_STYLE_EXT = '.htm';
const DOC_STYLE_PATH = ['docs', 'style'];
const DOC_SANDBOX_BASEDIR = '';
const DOC_STYLE_PARTIALS = findFilesBySuffix(path.join(...DOC_STYLE_PATH), DOC_STYLE_EXT);

config.output.path = path.resolve(__dirname, path.join(BUILDDIR, BUILDTARGET));

var out = {};

for (var i = 0; i < DOC_STYLE_PARTIALS.length; i += 1) {

    let dirname = DOC_STYLE_PARTIALS[i].split(path.sep);
    let basename = dirname.splice(dirname.length - 1, 1);

    let removed = dirname.splice(0, DOC_STYLE_PATH.length);
    if (path.join(...removed) !== path.join(...DOC_STYLE_PATH)) {
        throw new Error(`${removed} != ${DOC_STYLE_PATH}`);
    }

    let filename = path.join(
        DOC_SANDBOX_BASEDIR,
        path.join(...dirname),
        `${path.basename(path.join(...basename), DOC_STYLE_EXT)}.html`
    );

    let c = {
        title: `Usability test for ${filename}`,
        filename: filename,
        inject: true,
        isDevServer: process.env.WEBPACK_SERVE,
        template: 'docs/style/_templates/sandbox.html',
        templateParameters: {
            partial: fs.readFileSync(DOC_STYLE_PARTIALS[i])
        },
    };

    let outDir = path.dirname(filename);

    if (out[outDir] === undefined) { out[outDir] = [] }

    let raw = fs.readFileSync(DOC_STYLE_PARTIALS[i]);

    out[outDir].push([filename, escapeHtml(raw)]);

    config.plugins.push(new HtmlWebpackPlugin(c));
}

config.plugins.push(new HtmlWebpackPlugin({
    title: "Tiara's HTML Theming Reference (Usability Demonstration)",
    template: "docs/style/_templates/index.html",
    inject: false,
    templateParameters: {
        sandboxes: out,
        description: "This usability demonstration serves both as a a showcase, as well as a usability test. It mirrors the Sass 7:1 pattern of the style's source code, in order to have a structured approach for maintaing coverage. To use hot-reloading during development, open each iframe in a seperate window."
    }
}));

module.exports = {
    ...config,
    entry: {
        'demo': [
            "./src/script/main.ts",
            "./src/style/demo.scss"
        ],
    },
    devServer: {
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            // Watch .htm files manually, since they're not part of the
            // dependency graph (and shouldn't be)
            chokidar.watch(
                globSync('./docs/**/*.htm'),
                // TODO: Improve environment detection for MinGW and Cygwin
                // polling is pretty inefficient...
                {
                    usePolling: true,
                }
            ).on('change', (filePath) => {
                console.log(`${filePath} changed. Reloading...`);
                // documented absolutely nowhere...
                // luckily (almost) opened a PR for something else, so I still
                // knew the basic layout of the repository. 'content-changed'
                // does not work, though 'static-changed' does...
                //
                // https://github.com/webpack/webpack-dev-server/blob/fb38571a90c54f01b79fccd5c2b7e5113abef315/lib/Server.js#L3378
                devServer.sendMessage(
                    devServer.webSocketServer.clients,
                    "static-changed"
                );
            });

            return middlewares;
        },
        compress: true,
        open: true,
        hot: true,
        liveReload: true,
        watchFiles: ['src/**/*.scss', 'src/**/*.ts']
    },
};
