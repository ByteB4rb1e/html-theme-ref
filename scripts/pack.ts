import * as yargs from 'yargs';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as child_process from 'child_process';

const usage = `Create a tarball from a package

This script is a wrapper around \`npm pack\`. 

It copies the current working directory to a temporary directory, moves the
build artifacts to the root of it and then starts \`npm pack\` from within that
directory.

This is necessary, because traditional directory layout of build environments
isn't really compatible with npm and Typescript transpilation. With
Typescript/npm packages, usually build artifacts are transpiled into the same
directory as their sources and then excluded via e.g.  \`.gitignore\`. This is
how the \`npm pack\` workflow expects it. I don't like the isolation between 
build artifacts and sources that come with it.`

const argv = require('yargs')
    .usage('$0 [args] inputDir outputDir docsDir', usage)
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
    'README.md',
    'package.json',
].forEach((target) => {
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
