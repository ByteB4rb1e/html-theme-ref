const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const escapeHtml = require('escape-html');

const config = require('./webpack.config.debug.js');


/**
 *
 */
class StyleDocumentationPlugin {
    static defaultOptions = {
        inputBasedir: path.join('docs', 'style'),
        outputBasedir: path.join('docs', 'style'),
        frameTemplatePath: path.join('docs', 'style', '_templates', 'frame.html'),
        indexTemplatePath: path.join('docs', 'style', '_templates', 'index.html'),
    }

    /**
     *
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
     *
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
     *
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
     * read a file from the local filesystem and escape special HTML characters,
     * if required
     *
     * @param filePath string - path to a local file
     * @param escapeHtmlChars boolean - whether to escape HTML special character
     *                                  or not
     */
    static readFile(filePath, escapeHtmlChars = false) {
        const data = fs.readFileSync(filePath);

        if (escapeHtmlChars) return escapeHtml(data);

        return data;
    }

    /**
     * recursively search files by suffix
     *
     * @param root string - path to root directory
     * @param suffix string - file suffix to filter for
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
     * get basic options of style documentation frame for building through the
     * html-webpack-plugin
     *
     * @param inputFilePath string - path to source file (partial HTML document)
     * @param inputBaseDir string  - base directory of all partials
     * @param outputBaseDir string - base directory to output partials to
     *
     * @returns partial options object for HtmlWebpackPlugin
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
     * get full configuration options of all style documentation frames for building
     * through the html-webpack-plugin
     *
     * @param inputBaseDir string  - base directory of all frame partials
     * @param outputBaseDir string - base directory to output frame partials to
     * @param templatePath string - template to expand frame partials with
     *
     * @returns generator of configuration options for html-webpack-plugin
     *          constructor
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
     * get metadata of a frame required by index
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
