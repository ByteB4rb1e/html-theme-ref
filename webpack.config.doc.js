const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const escapeHtml = require('escape-html');

const config = require('./webpack.config.debug.js');

/**
 * Webpack plugin for generating usability demonstration frames and and index
 * file for documenting and testing styles of this reference implementation.
 */
class StyleDocumentationPlugin {
    /**
     * Default options for the StyleDocumentationPlugin.
     *
     * @type {Object}
     * @property {string} inputBasedir - Base directory for input files.
     * @property {string} outputBasedir - Base directory for output files.
     * @property {string} frameTemplatePath - Path to the HTML template for frames.
     * @property {string} indexTemplatePath - Path to the HTML template for the index.
     */
    static defaultOptions = {
        inputBasedir: path.join('docs', 'style'),
        outputBasedir: path.join('docs', 'style'),
        frameTemplatePath: path.join('docs', 'style', '_templates', 'frame.html'),
        indexTemplatePath: path.join('docs', 'style', '_templates', 'index.html'),
    }

    /**
     * Constructor for the StyleDocumentationPlugin.
     *
     * @param {Object} [options={}] - Configuration options for the plugin.
     */
    constructor(options = {}) {
        const pluginName = StyleDocumentationPlugin.name;

        this.options = {
            ...StyleDocumentationPlugin.defaultOptions,
            ...options
        };

        this.framesOptions = [];
        this.indexOptions = null;
        this.logger = null;

        this.onBeforeRun = this.onBeforeRun.bind(this);
    }

    /**
     * Webpack's `apply` method hooks into the compiler to set up the plugin.
     *
     * @param {import('webpack').Compiler} compiler - Webpack compiler instance.
     */
    apply(compiler) {
        const pluginName = StyleDocumentationPlugin.name;

        this.logger = compiler.getInfrastructureLogger(pluginName);

        compiler.hooks.beforeRun.tap(pluginName, this.onBeforeRun);
        compiler.hooks.watchRun.tap(pluginName, this.onBeforeRun);

        for (const frameOptions of StyleDocumentationPlugin.getFrames(
            this.options.inputBasedir,
            this.options.outputBasedir,
            this.options.frameTemplatePath
        )) {
            this.framesOptions.push(frameOptions);
            this.logger.info(
                'cached frame options for:',
                frameOptions.templateParameters.sourcePath
            );
        }

        const indexFilename = path.join(this.options.outputBasedir, 'index.html');

        this.indexOptions = {
            title: "Tiara's HTML Theming Reference (Usability Demonstration)",
            filename: indexFilename,
            template: this.options.indexTemplatePath,
            // don't inject styles, we don't want the index to look pretty as
            // this could be make the frames be difficult to discern
            inject: false,
            templateParameters: {
                // description is going to be rendered as HTML so the extra
                // spaces are going to be dropped anyway.
                description: `This usability demonstration serves both as a a
                              showcase, as well as a usability test. It mirrors
                              the Sass 7:1 pattern of the style's source code,
                              in order to have a structured approach for
                              maintaing coverage. To use hot-reloading during
                              development, open each iframe in a seperate
                              window.`,
                framesMeta: StyleDocumentationPlugin.getGroupedFramesMeta(
                    this.framesOptions,
                    indexFilename,
                )
            }
        }

        this.logger.info(
            'cached frame options for:', 
            this.options.indexTemplatePath
        );
    }

    /**
     * Handles Webpack's `beforeRun` and `watchRun` hooks to apply the plugin
     * logic.
     *
     * @param {import('webpack').Compiler} compiler - Webpack compiler instance.
     */
    onBeforeRun(compiler) {
        new HtmlWebpackPlugin(this.indexOptions).apply(compiler);

        // TODO: refactor to run asynchronously
        this.framesOptions.forEach(frameOptions => {
            new HtmlWebpackPlugin(frameOptions).apply(compiler);
        })

        compiler.hooks.initialize.call(compiler);
    }

    /**
     * Reads a file and optionally escapes its HTML content.
     *
     * @param {string} filePath - Path to the file.
     * @param {boolean} [escapeHtmlChars=false] - Whether to escape HTML special characters.
     * @returns {string} The file's content.
     */
    static readFile(filePath, escapeHtmlChars = false) {
        const data = fs.readFileSync(filePath);

        if (escapeHtmlChars) return escapeHtml(data);

        return data;
    }

    /**
     * Recursively searches for files with a specified suffix.
     *
     * @param {string} root - Root directory to start the search.
     * @param {string} suffix - File suffix to filter for.
     * @returns {Generator<string, void, undefined>} A generator that yields file paths.
     */
    static *findFilesBySuffix(root, suffix) {
        if (!fs.existsSync(root)) {
            throw new Error(`path does not exist: '${root}'`);
        }

        var out = [];
        var files = fs.readdirSync(root);

        for (var i = 0; i < files.length; i++) {
            let filename = path.join(root, files[i]);
            let stat = fs.lstatSync(filename);

            if (stat.isDirectory()) {
                yield* StyleDocumentationPlugin.findFilesBySuffix(filename, suffix)
            }
            else if (filename.endsWith(suffix)) { yield filename }
        };

        return out;
    }

    /**
     * Generates basic options for a style documentation frame.
     *
     * @param {string} inputFilePath - Path to the source file (partial HTML document).
     * @param {string} inputBaseDir - Base directory of input files.
     * @param {string} outputBaseDir - Base directory for output files.
     * @returns {Object} Basic options for HtmlWebpackPlugin.
     */
    static getBasicFrameOptions(
        inputFilePath,
        inputBaseDir,
        outputBaseDir,
    ) {
        // canonical name of frame
        const outputName = path.basename(
            inputFilePath,
            path.extname(inputFilePath)
        );

        // canonical directory name of frame, applicable to both input and output
        const relDirname = path.dirname(
            path.relative(inputBaseDir, inputFilePath)
        );

        return {
            title: [
                'Usability test for',
                `${relDirname.replace('\\', '/')}/${outputName}`,
            ].join(' '),
            filename: path.join(
                outputBaseDir,
                relDirname,
                `${outputName}.html`
            ),
            templateParameters: {
                relDirname: relDirname.replace('\\', '/'),
                sourcePath: inputFilePath,
            }
        };
    }

    /**
     * Generates full configuration options for all style documentation frames.
     *
     * @param {string} inputBasedir - Base directory of input files.
     * @param {string} outputBasedir - Base directory for output files.
     * @param {string} templatePath - Path to the frame template.
     * @returns {Generator<Object, void, undefined>} A generator yielding configuration options for HtmlWebpackPlugin.
     */
    static *getFrames(
        inputBasedir,
        outputBasedir,
        templatePath,
    ) {
        for (const filePath of StyleDocumentationPlugin.findFilesBySuffix(inputBasedir, '.htm')) {
            const basicOptions = StyleDocumentationPlugin.getBasicFrameOptions(
                filePath,
                inputBasedir,
                outputBasedir,
            );

            yield {
                ...basicOptions,
                ...{
                    inject: true,
                    isDevServer: process.env.WEBPACK_SERVE,
                    template: templatePath,
                    templateParameters: {
                        ...basicOptions.templateParameters,
                        ...{
                            getContent: StyleDocumentationPlugin.readFile,
                        }
                    },
                }
            };
        }
    }

    /**
     * Extracts metadata for a frame required by the index.
     *
     * @param {Object} frameOptions - Frame options object.
     * @param {string} indexFilename - Path to the index file.
     * @returns {Object} Metadata for the frame.
     */
    static getFrameMeta(
        frameOptions,
        indexFilename,
    ) {
        return {
            href: path.relative(
                path.dirname(indexFilename),
                frameOptions.filename
            ).replace('\\', '/'),
            sourcePath: frameOptions.templateParameters.sourcePath,
            getContent: (path) => StyleDocumentationPlugin.readFile(path, true)
        }
    }

    /**
     * Groups frames metadata by relative directory paths.
     *
     * @param {Object[]} framesOptions - Array of frame options objects.
     * @param {string} indexFilename - Path to the index file.
     * @returns {Object} Grouped metadata.
     */
    static getGroupedFramesMeta(framesOptions, indexFilename) {
        const groups = {};

        for (const frame of framesOptions) {
            const relDirname = frame.templateParameters.relDirname;

            if (!(relDirname in groups)) groups[relDirname] = [];

            groups[relDirname].push(
                StyleDocumentationPlugin.getFrameMeta(frame, indexFilename)
            );
        }

        return groups;
    }
}

// doc, doc, docs, docs... I know there's there's a lot of doc going on here,
// but the output path encapsulates everything defined in the plugin, so the
// paths will be joined.
config.output.path = path.resolve(__dirname, 'build', 'doc');

// TODO: search for ts-loader instances, instead of hard-coding...
config.module.rules[1].use[0].options.configFile = 'tsconfig.doc.json';
// ensure that generated maps are emitted to the correct directory, in case
// something different is specified in the tsconfig and I forgot about it
config.module.rules[1].use[0].options.compilerOptions = {
    "outDir": path.join(config.output.path, 'script')
};

config.plugins.push(new StyleDocumentationPlugin());

module.exports = {
    ...config,
    entry: {
        'demo': [
            "./src/script/main.ts",
            "./src/style/demo.scss"
        ],
    },
    devServer: {
        compress: true,
        open: true,
        hot: true,
        liveReload: true,
        watchFiles: ['src/**/*.scss', 'src/**/*.ts']
    },
};
