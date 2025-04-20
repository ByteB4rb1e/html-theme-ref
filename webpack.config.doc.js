const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const escapeHtml = require('escape-html');

/**
 * Webpack plugin for generating usability demonstration frames and and index
 * file for documenting and testing styles of this reference implementation.
 *
 * TODO: explain in detail on how the usability demonstration is structured,
 * meant to be used and implemented by this plugin.
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

        // set defaults
        this.options = {
            ...StyleDocumentationPlugin.defaultOptions,
            ...options,
        };

        this.framesOptions = [];
        this._plugins = null;
        this._fileDependencies = null;
        this.indexOptions = null;
        this.logger = null;

        this.onWatchRun = this.onWatchRun.bind(this);
        this.onAfterCompile = this.onAfterCompile.bind(this);
    }

    /**
     * Webpack's `apply` method hooks into the compiler to set up the plugin.
     *
     * @param {import('webpack').Compiler} compiler - Webpack compiler instance.
     */
    apply(compiler) {
        const pluginName = StyleDocumentationPlugin.name;

        const resolvePath = (path, compiler) => {
            return path.resolve(compiler.config.output.path, path);
        }

        // normalize paths
        this.options = {
            ...this.options,
            ...{
                inputBasedir: path.resolve(this.options.inputBasedir),
                outputBasedir: path.resolve(
                    compiler.options.output.path,
                    this.options.outputBasedir
                ),
                frameTemplatePath: path.resolve(this.options.frameTemplatePath),
                indexTemplatePath: path.resolve(this.options.indexTemplatePath)
            }
        }

        this.logger = compiler.getInfrastructureLogger(pluginName);

        this.logger.info('registering compiler hooks...');

        compiler.hooks.beforeRun.tap(pluginName, this.onWatchRun);
        compiler.hooks.watchRun.tap(pluginName, this.onWatchRun);
        compiler.hooks.afterCompile.tap(pluginName, this.onAfterCompile);

        this.logger.info('generating plugin options...');

        for (const frameOptions of StyleDocumentationPlugin.getFramesOptions(
            this.options.inputBasedir,
            this.options.outputBasedir,
            this.options.frameTemplatePath
        )) {
            this.framesOptions.push(frameOptions);
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

        this.logger.info('applying compiler to plugins...');

        var pluginRegistrationCount = 0;
        for (const [plugin, fileDependencies] of this.plugins()) {
            plugin.apply(compiler);
            pluginRegistrationCount += 1;
        }

        this.logger.info(
            'number of files dependent upon:',
            this._fileDependencies.length
        );

        this.logger.info(
            'number of (child) plugins compiler was applied to:',
            pluginRegistrationCount
        );
    }

    /**
     * Handles Webpack's `beforeRun` and `watchRun` hooks to apply the plugin
     * logic.
     *
     * @param {import('webpack').Compiler} compiler - Webpack compiler instance.
     *
     * @remarks
     * There is a bug in html-webpack-plugin, where it uses the wrong hook for
     * watch events, therefore file changes aren't emitted properly. Therefore
     * I'm applying the plugins directly to the compiler for each compilation,
     * instead of enqueing it as a plugin during initialization.
     *
     * {@link https://github.com/webpack/webpack/issues/16312#issuecomment-1262993892
     * | Issue report and workaround}
     */
    onWatchRun(compiler) {
        if (compiler.watchMode) {
            if (compiler.modifiedFiles) {
                const cwd = process.cwd();
                compiler.modifiedFiles.forEach((filePath) => {
                    if (this._fileDependencies.includes(filePath)) {
                        const plugins = this.getPluginsForFileDependency(filePath);

                        this.logger.info(
                            `dependendent file of ${plugins.length} plugin(s) modified:`,
                            path.relative(cwd, filePath)
                        );

                        //compiler.watching.invalidate();
                    }
                });
            }
        }

        compiler.hooks.initialize.call(compiler);
    }

    /**
     * get an iterator of (child) plugins applied to the compiler. If the
     * plugins haven't been constructed yet, they will.
     *
     * @returns {Generator<[HtmlWebpackPlugin, string[]], void, undefined>} A
     *          generator that yields a tuple of a plugin and its dependent files
     */
    *plugins() {
        if(this._plugins) {
            for (const [plugin, fileDependencies] of this._plugins) {
                yield [ plugin, [...fileDependencies] ];
            }

            return
        }

        this._fileDependencies = [];
        this._plugins =  [];

        const indexPluginData = [
            new HtmlWebpackPlugin(this.indexOptions),
            [this.options.indexTemplatePath]
        ];

        this._fileDependencies.push(this.options.indexTemplatePath);
        this._plugins.push(indexPluginData);
        yield [
            indexPluginData[0],
            [...indexPluginData[1]]
        ];

        this._fileDependencies.push(this.options.frameTemplatePath);
        for (const frameOptions of this.framesOptions) {
            const framePluginData = [
                new HtmlWebpackPlugin(frameOptions),
                [
                    frameOptions.templateParameters.sourcePath,
                    this.options.frameTemplatePath,
                ]
            ];

            this._fileDependencies.push(
                frameOptions.templateParameters.sourcePath
            );
            this._plugins.push(framePluginData);
            yield [
                framePluginData[0],
                [...framePluginData[1]]
            ];
        }
    }

    /**
     * get plugins dependent upon a source file
     */
    getPluginsForFileDependency(filePath) {
        const matches = [];

        for (const [plugin, fileDependencies] of this.plugins()) {
            if (fileDependencies.includes(filePath)) matches.push(plugin);
        }

        return matches;
    }

    /**
     * TODO: write JSDOC block comment
     */
    onAfterCompile(compilation) {
        const buildDependencyGroup = path.resolve(this.options.inputBasedir);
        compilation.buildDependencies.add(buildDependencyGroup);

        this.framesOptions.forEach(frameOptions => {
            const sourcePath = frameOptions.templateParameters.sourcePath;

            if (!compilation.fileDependencies.has(sourcePath)) {
                compilation.fileDependencies.add(sourcePath);
                this.logger.info(`manually added file dependency: ${sourcePath}`);
            }
        });
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
    static *getFramesOptions(
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

module.exports = (env, argv) => {

    const configFile = argv.mode === 'development' ? 'webpack.config.debug.js' : 'webpack.config.js';
    const config = require(`./${configFile}`);

    // doc is the build target (directory) and docs the subdirectory under the target
    // directory, since all the other assets will have a directory in there as well.
    // This is so that when I'm merging the release and docs output, all assets are
    // deduplicated. See Makefile and scripts/npm-pack.ts for info on how that
    // works.
    config.output.path = path.resolve('build', 'doc');
    // something different is specified in the tsconfig and I forgot about it
    config.module.rules[1].use[0].options.compilerOptions = {
        "outDir": path.join(config.output.path, 'script')
    };

    config.plugins.push(new StyleDocumentationPlugin());

    return {
        ...config,
        entry: {
            'demo': [
                "./src/script/main.ts",
                "./src/style/demo.scss"
            ],
        },
        devServer: {
            compress: true,
            open: false,
            hot: true,
            liveReload: true,
            watchFiles: ['src/**/*.scss', 'src/**/*.ts'],
            devMiddleware: {
                writeToDisk: true
            },
            static: 'build/doc/docs/style',
        }
    }
};
