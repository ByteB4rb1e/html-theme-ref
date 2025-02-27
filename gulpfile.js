/**
 * @fileoverview This file contains the Gulp tasks for building and developing
 * the project. It includes tasks for compiling SCSS to CSS, TypeScript to
 * JavaScript, and rendering Nunjucks templates to HTML. The script also sets up
 * a BrowserSync server for live-reloading during debug.
 * 
 * Tasks include:
 * - `buildCss`: Compiles SCSS files to CSS with PostCSS plugins for 
 *   optimizations.
 * - `buildJs`: Compiles TypeScript files to JavaScript with sourcemaps.
 * - `buildDemo`: Renders Nunjucks templates to HTML for demo purposes.
 * - `watch`: Watches source files for changes and triggers appropriate build 
 *   tasks.
 * - `browser`: Initializes BrowserSync for live-reloading.
 * 
 * Note: When implementing new tasks, scope imports in the respective function 
 * and only scope them globally, if they are shared between tasks.
 * 
 * @author victory-k.it
 * @version 1.0.0
 * @date 2024-12-07
 * @license UNLICENSED
 */
const browserSync = require('browser-sync').create();
const fs = require('fs');
const glob = require('glob');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');

const BUILDDIR = (process.env.GULP_BUILDDIR !== undefined) ? process.env.GULP_BUILDDIR : path.join(process.cwd(), 'build');

const BUILDDIR_PROD = path.join(BUILDDIR, 'production');
const BUILDDIR_DEBUG = path.join(BUILDDIR, 'debug');
const BUILDDIR_CSS_DEV = path.join(BUILDDIR, 'debug/css');
const BUILDDIR_CSS_PROD = path.join(BUILDDIR, 'production/css');
const BUILDDIR_DEMO = path.join(BUILDDIR, 'debug');
const BUILDDIR_FONTS_DEV = path.join(BUILDDIR, 'debug/fonts');
const BUILDDIR_FONTS_PROD = path.join(BUILDDIR, 'production/fonts');
const BUILDDIR_SVG_DEV = path.join(BUILDDIR, 'debug/svg');
const BUILDDIR_SVG_PROD = path.join(BUILDDIR, 'production/svg');
const BUILDDIR_JS_DEV = path.join(BUILDDIR, 'debug/js');
const BUILDDIR_JS_PROD = path.join(BUILDDIR, 'production/js');
const SRCDIR_CSS = path.join(__dirname, 'src/scss');
const SRCDIR_DEMO = path.join(__dirname, 'demo');
const SRCDIR_FONTS = path.join(__dirname, 'vendor/fonts');
const SRCDIR_SVG = path.join(__dirname, 'src/svg');
const SRCDIR_JS = path.join(__dirname, 'src/ts');
const BASEDIR_BROWSER = BUILDDIR_DEMO;


/**
 * Reads and parses a TypeScript configuration file.
 * @param {string} configPath - The path to the TypeScript configuration file.
 * @returns {object} The parsed TypeScript configuration.
 */
function _getTsConfig(configPath) {
    const configFile = fs.readFileSync(configPath);
    return JSON.parse(configFile);
}


function _webpackConfigCss() {
    let webpackMode = 'production';
    let webpackDevTool = false;
    let destDir = BUILDDIR_CSS_PROD;
    let confpath = './webpack.config.js';

    if (process.env.NODE_ENV === 'debug') {
        webpackMode = 'development';
        webpackDevTool = 'source-map';
        destDir = BUILDDIR_CSS_DEV;
        confpath = './webpack.config.debug.js';
    }


    return {
        ...require(confpath),
        entry: Object.assign({}, ...glob.sync(path.join(SRCDIR_CSS, '*.scss')).map((p) => {

            const filepath = (p.startsWith('/') || p.startsWith('.')) ? p : `./${p}`;

            return {
                [p.replace(/^.*[\\/]/, '').replace('.scss', '')]: filepath
            }
        })),
        mode: webpackMode,
        output: {
          path: (destDir.startsWith('/')) ? destDir : path.join(__dirname, destDir)
        },
        devtool: webpackDevTool,
    };
}


function _webpackConfigJs() {
    let webpackMode = 'production';
    let webpackDevTool = false;
    let destDir = BUILDDIR_JS_PROD;
    let confpath = './webpack.config.js';

    if (process.env.NODE_ENV === 'debug') {
        webpackMode = 'development';
        webpackDevTool = 'source-map';
        destDir = BUILDDIR_JS_DEV;
        confpath = './webpack.config.debug.js';
    }

    return {
        ...require(confpath),
        entry: Object.assign({}, ...glob.sync(path.join(SRCDIR_JS, '*.ts')).map((p) => {
            const filepath = (p.startsWith('/') || p.startsWith('.')) ? p : `./${p}`;

            return {
                [p.replace(/^.*[\\/]/, '').replace('.ts', '')]: filepath
            }
        })),
        mode: webpackMode,
        output: {
          filename: '[name].js',
          path: path.join(__dirname, destDir),
          path: (destDir.startsWith('/')) ? destDir : path.join(__dirname, destDir)
        },
        devtool: webpackDevTool,
    };
}



/**
 * Initializes the BrowserSync server for debug.
 */
function browser() {
    let basedir = BUILDDIR_JS_PROD;

    if (process.env.NODE_ENV == 'debug') {
        basedir = BUILDDIR_JS_DEV;
    }

    browserSync.init({
        server: {
            baseDir: __dirname,
            index: path.join(basedir, 'index.html') // Default HTML file to open
        },
        open: true // Automatically open the browser
    });
}


function buildCss() {
    const config = _webpackConfigCss();

    let pipeline = gulp.src(path.join(SRCDIR_CSS, '*.scss'));

    pipeline = pipeline.pipe(webpack(config));

    pipeline = pipeline.pipe(gulp.dest(config.output.path));

    return pipeline.pipe(browserSync.stream());
}


/**
 * Builds JavaScript files from TypeScript source files and bundles dependencies
 * @returns {NodeJS.ReadWriteStream} The Gulp stream.
 */
function buildJs() {
    const config = _webpackConfigJs();

    let pipeline = gulp.src(path.join(SRCDIR_JS, '*.ts'));

    pipeline = pipeline.pipe(webpack(config));

    pipeline = pipeline.pipe(gulp.dest(config.output.path));

    return pipeline.pipe(browserSync.stream());
}


function buildFonts() {
    let destdir = BUILDDIR_FONTS_PROD;

    if (process.env.NODE_ENV === 'debug') {
        destdir = BUILDDIR_FONTS_DEV;
    }

    let pipeline = gulp.src(path.join(SRCDIR_FONTS, '*'));

    pipeline = pipeline.pipe(gulp.dest(destdir));

    return pipeline.pipe(browserSync.stream());
}


function buildSvg() {
    let destdir = BUILDDIR_SVG_PROD;

    if (process.env.NODE_ENV === 'debug') {
        destdir = BUILDDIR_SVG_DEV;
    }

    let pipeline = gulp.src(path.join(SRCDIR_SVG, '*'));

    pipeline = pipeline.pipe(gulp.dest(destdir));

    return pipeline.pipe(browserSync.stream());
}


function watchCss() {
    let pipeline = gulp.src(path.join(SRCDIR_CSS, '*.scss'));

    const config = _webpackConfigCss();

    config.watch = true;

    config.plugins.push(function() {
        this.hooks.done.tap('AfterBuildPlugin', (stats) => {
            browserSync.reload()
        });
    });

    pipeline.pipe(webpack(config));
}


function watchFonts() {

    gulp.series(buildFonts, () => {
        gulp.watch(SRCDIR_FONTS, buildFonts);
    });
}


function watchSvg() {

    gulp.series(buildFonts, () => {
        gulp.watch(SRCDIR_SVG, buildSvg);
    });
}


function watchJs() {
    let pipeline = gulp.src(path.join(SRCDIR_JS, '*.ts'));

    const config = _webpackConfigJs();

    config.watch = true;

    config.plugins.push(function() {
        this.hooks.done.tap('AfterBuildPlugin', (stats) => {
            browserSync.reload()
        });
    });

    pipeline.pipe(webpack(config));
}


function writePackageJson() {
    let destdir = BUILDDIR_PROD;

    if (process.env.NODE_ENV === 'debug') {
        destdir = BUILDDIR_DEBUG;
    }

    var pkg = require('./package.json');

    fs.writeFileSync(
        path.join(destdir, 'package.json'), 
        `{ "name": "${pkg.name}", "version": "${pkg.version}", "author": "${pkg.author}", "description": "${pkg.description}", "files":[ "./**/*" ] }`
    );

    return gulp.src('*')
}

exports.build = gulp.parallel(buildJs, buildCss, buildFonts, buildSvg);
exports.buildCss = buildCss;
exports.buildFonts = buildFonts;
exports.buildSvg = buildSvg;
exports.buildJs = buildJs;
exports.watchCss = watchCss;
exports.watchFonts = watchFonts;
exports.watchSvg = watchSvg;
exports.watchJs = watchJs;
exports.writePackageJson = writePackageJson;

/**
 * Gulp task to watch for changes in source files.
 */
exports.default = gulp.parallel(
    browser,
    gulp.parallel(watchJs, watchCss, watchFonts, watchSvg)
);


exports._browserSync = browserSync;
