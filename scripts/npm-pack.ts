import * as yargs from 'yargs';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as child_process from 'child_process';

import { globIterateSync } from 'glob';

const usage = `Create a tarball from a package

This script is a wrapper around \`npm pack\`. 

This project uses npm pack to distribute its assets, even though it's not the
most ideal as the resulting tarball has a directory structure specific to npm
packages. The reason it is still utilized though is because it does not require
any additional dependencies outside the Node.js/npm runtime environment.

It copies the current working directory to a temporary directory, moves the
build artifacts to the root of it and then starts \`npm pack\` from within that
directory.

A \`file-list.txt\` index of all assets to be used by implementors is generated,
in which each file to be used is listed on a separate line.

Optionally the documentation is copied to a \`_docs/\` sub-directory.

This is necessary, because traditional directory layout of build environments
isn't compatible with npm pack routine. With npm packages, usually build
artifacts are transpiled into the same directory as their sources and then
excluded via e.g.  \`.gitignore\`. This is how the \`npm pack\` routine expects
it, which gives poor isolation between sources and build artifacts.
`

const argv = require('yargs')
    // yargs doesn't adhere to established standards and reinvents the wheel
    // with this convention of defining the usage... Really annoying, as it does
    // not allow for indicating options, since it will be parsed as a positional
    // argument... Yes, I'm starting to doubt my choice of yargs and considering
    // migrating to commander.js. Oy! 200+ issues for an argument parser...
    .usage('$0 inputDir outputDir [docsDir]', usage)
    .positional('inputDir', {
            type: 'string',
            default: 'build/release',
            describe: 'path to package build'
    })
    .positional('outputDir', {
            type: 'string',
            default: 'dist',
            describe: 'path to dist directory'
    })
    .positional('docsDir', {
            type: 'string',
            default: null,
            describe: 'path to docs build'
    })
    .demandOption(['inputDir', 'outputDir'])
    .help()
    .argv;

var cwd = process.cwd();

if (path.dirname(argv.inputDir) == path.basename(argv.inputDir)) {
    throw new Error('inputDir must have a nesting depth of at least 2')
}

if ([path.sep, '.'].includes(argv.inputDir[0])) {
    throw new Error(`inputDir must be a relative path inside of '${cwd}'`)
}

const tempDir = fs.mkdtempSync(path.join(
    os.tmpdir(),
    `${path.basename(cwd)}-`
));

fs.cpSync(
    argv.inputDir,
    tempDir,
    {
        recursive: true,
        filter: (src: string, dest: string) => {
            console.log(
                `cp: ${path.relative(cwd, src)} > ${path.relative(cwd, dest)}`
            );
            return true;
        }
    }
);

[
    'LICENSE',
    'README.md',
].forEach((target) => {
    // TODO: sync file stats
    fs.cpSync(
        path.join(cwd, target),
        path.join(tempDir, target),
        {
            recursive: true,
            filter: (src: string, dest: string) => {
                console.log(
                    `cp: ${path.relative(cwd, src)} > ${path.relative(cwd, dest)}`
                );
                return true;
            }
        }
    );
});

if (argv.docsDir) {
    console.log('docs supplied, will copy...')
    // TODO: sync file stats
    fs.cpSync(
        path.join(cwd, argv.docsDir),
        path.join(tempDir, `_docs`),
        {
            recursive: true,
            filter: (src: string, dest: string) => {
                console.log(
                    `cp: ${path.relative(cwd, src)} > ${path.relative(cwd, dest)}`
                );
                return true;
            }
        }
    );
}

console.log('generating index (\'assets.txt\') of assets...')
// TODO: sync file stats
var fd: number = fs.openSync(path.join(tempDir, 'assets.txt'), 'w');
// NOTICE: MUST use POSIX path separators
// iterating over globbing search results, to avoid memory pressure
for (const match of globIterateSync(
    [argv.inputDir, '**'].join('/'),
    { withFileTypes: true }
)) {
    if (match.isDirectory()) continue;
    const relPath = path.relative(argv.inputDir, match.relative());
    fs.writeSync(fd, `${relPath}\n`);
}
fs.closeSync(fd);

console.log('generating npm package specification \'package.json\'...');
const packageSpec = JSON.parse(fs.readFileSync(
    'package.json',
    { encoding: 'utf-8' }
));
fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({
        'name': packageSpec.name,
        'version': packageSpec.version,
        'description': packageSpec.description,
        'author': packageSpec.author,
        'private': true
    }, null, 4)
);

var outputDir = path.resolve(path.join(cwd, argv.outputDir));
console.log(`mkdir: ${outputDir}`);
fs.mkdirSync(outputDir, { recursive: true });

console.log(`npm: pack --pack-destination ${outputDir}`);
child_process.execSync(
    `npm pack --pack-destination ${outputDir}`,
    {
        cwd: tempDir,
        stdio: "inherit"
    }
);
