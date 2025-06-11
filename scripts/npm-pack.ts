import * as buffer from 'node:buffer';
import * as child_process from 'node:child_process';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import {FileHandle, open} from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import * as util from 'node:util';
import * as zlib from 'node:zlib';
// dependency of pacote, which is dependency of npm cli
import { Pack } from 'tar';
import { Minipass } from 'minipass';
import { WriteStream } from '@isaacs/fs-minipass';
const { pipeline } = require('node:stream');

const SCRIPTNAME = path.basename(__filename);

const DEFAULT_INPUT_DIR: string = path.join('build', 'release');
const DEFAULT_OUTPUT_DIR: string = 'dist';
const DEFAULT_ASSETS_INDEX_BASENAME: string = 'package.sha256sums';
const DEFAULT_DOCS_DIRNAME: string = '';
const DEFAULT_HASHING_ALGORITHM: string = 'sha256';

function usage(exec: string): string {
    return `
Usage: ${exec} [OPTIONS] [INPUT]

Create a tarball from a package

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

Optionally INPUT is merged on top of DOCS.

This is necessary, because traditional directory layout of build environments
isn't compatible with npm pack routine. With npm packages, usually build
artifacts are transpiled into the same directory as their sources and then
excluded via e.g.  \`.gitignore\`. This is how the \`npm pack\` routine expects
it, which gives poor isolation between sources and build artifacts.

Positional arguments:

    INPUT  - directory of build output used as the input for packaging
             [default:${DEFAULT_INPUT_DIR}]

Options:

    --digest-basename  - basename of assets index. This is the output 
                         file that contains a listing of all the output files
                         which are meant to be used by the system integrating
                         the HTML theme.
                         [default:${DEFAULT_ASSETS_INDEX_BASENAME}]

    --docs-dirname     - name of directory to output documentation into
                         (if supplied through DOCS).
                         [default:${DEFAULT_DOCS_DIRNAME}]

    --pack-destination - name of directory to output documentation into
                         (if supplied through DOCS).
                         [default:${DEFAULT_OUTPUT_DIR}]

    --input-docs PATH  - directory containing documentation, which is used as an
                         auxiliary input for packaging alongside INPUT. It is
                         expected that the directory has the same layout as
                         INPUT. If the directory does not follow the same
                         layout, supply --docs-dirname

    --input-test-reports  - 

    -h, --help            - 

Examples:

    ${exec}

    ${exec} --pack-destination dist
`;
}

export interface PackageOptions {
    inputDir: string,
    outputDir: string,
    docsInputDir: string | null,
    testReportsInputDir: string | null,
    digestBasename: string,
    docsOutputDirname: string,
    hashingAlgorithm: string,
}

/**
 * recursively traverse a directory and yield all paths relative to the root
 *
 * @param root - path where to start traversal from
 */
export function* listFiles(
    root: string,
    trueRoot?: string,
): Generator<string, void, unknown> {
    trueRoot = trueRoot ?? root;
    if (!fs.existsSync(root)) {
        throw new Error(`path does not exist: '${root}'`);
    }

    var files = fs.readdirSync(root);

    for (var i = 0; i < files.length; i++) {
        let filePath = path.join(root, files[i]);
        let stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) { yield* listFiles(filePath, trueRoot) }
        else { yield path.relative(trueRoot, filePath); }
    };
};


export async function hashFile(
    name: string,
    algorithm?: string,
    bufsize?: number
): Promise<string> {
    algorithm = algorithm ?? 'sha256';
    bufsize = bufsize ?? 1000 * 1024;
    const buf = buffer.Buffer.alloc(bufsize);
    const fh: FileHandle = await open(name);
    const hash: crypto.Hash = crypto.createHash(algorithm);

    while(true) {
        //buf.byteOffset = 0;
        const bytesRead = (await fh.read(buf)).bytesRead;

        if (!bytesRead) break;
        else if (bytesRead === bufsize) hash.update(buf);
        else hash.update(buf.subarray(0, bytesRead));
    }

    await fh.close();
    return hash.digest('hex');
}


function copyFiles(
    files: string[],
    outputDir: string,
    cwd?: string,
): void {
    cwd = cwd ?? process.cwd();
    outputDir = path.resolve(cwd, outputDir);

    files.forEach((target) => {
        // TODO: sync file stats
        fs.cpSync(
            path.resolve(cwd, target),
            (files.length == 1) ? outputDir : path.join(outputDir, target),
            {
                recursive: true,
                filter: (src: string, dest: string) => {
                    console.log(
                        `cp: ${path.relative(cwd, src)} > ${dest}`
                    );
                    return true;
                }
            }
        );
    });
}


/**
 * TODO: write TSDOC block comment
 */
async function pack(options: PackageOptions): Promise<void> {
    var cwd = process.cwd();

    if (path.dirname(options.inputDir) == path.basename(options.inputDir)) {
        throw new Error('inputDir must have a nesting depth of at least 2')
    }

    if ([path.sep, '.'].includes(options.inputDir[0])) {
        throw new Error(`inputDir must be a relative path inside of '${cwd}'`)
    }

    console.log(`${SCRIPTNAME}: creating temporary directory...`);
    const tempDir = fs.mkdtempSync(path.join(
        os.tmpdir(),
        `${path.basename(cwd)}-`
    ));

    console.log(`${SCRIPTNAME}: copying metadata...`);
    copyFiles(['LICENSE', 'README.md'], tempDir);

    if (options.docsInputDir) {
        console.log(`${SCRIPTNAME}: copying docs...`);
        copyFiles(
            [path.join(cwd, options.docsInputDir)],
            path.join(tempDir, options.docsOutputDirname),
        )
    }

    console.log(`${SCRIPTNAME}: copying build output...`);
    copyFiles(
        [options.inputDir],
        tempDir,
    );

    console.log(
        `${SCRIPTNAME}: generating digest: ${options.digestBasename}...`
    );
    // TODO: sync file stats
    var fd: number = fs.openSync(
        path.join(tempDir, options.digestBasename), 
        'w'
    );

    const packageSpec = JSON.parse(fs.readFileSync(
        'package.json',
        { encoding: 'utf-8' }
    ));

    if (!fs.existsSync(options.outputDir)) {
        fs.mkdirSync(options.outputDir);
    }

    const archivePath = path.join(
        options.outputDir,
        `${packageSpec.name}-${packageSpec.version}.tar`
    );
    console.info(`${SCRIPTNAME}: creating archive: \'${archivePath}\'...`);
    const p = new Pack({cwd: tempDir, gzip: false});
    const stream = new WriteStream(archivePath, {mode: 0o666});

    p.pipe(stream as unknown as Minipass.Writable);

    const promise = new Promise<void>((res, rej) => {
        stream.on('error', rej)
        stream.on('close', res)
        p.on('error', rej)
    })

    for (const match of listFiles(tempDir)) {
        if (match === options.digestBasename) continue;

        const normpath = match.replace(path.win32.sep, path.posix.sep);
        const hash = await hashFile(
            path.join(tempDir, match),
            options.hashingAlgorithm
        );

        console.debug(`tar: ${match}: ${hash} (${options.hashingAlgorithm})`);
        fs.writeSync(fd, `${hash} *${normpath}\n`);
        p.add(match);
    }

    fs.closeSync(fd);

    console.log(`tar: ${options.digestBasename}`);
    p.add(options.digestBasename);

    await p.end();
    await promise;

    const archiveHashPath = `${archivePath}.${options.hashingAlgorithm}`;
    console.log(`${options.hashingAlgorithm}: ${archiveHashPath}`);
    const archiveHash = await hashFile(archivePath, options.hashingAlgorithm);
    fs.writeFileSync(archiveHashPath, archiveHash);

    const cArchivePath = `${archivePath}.gz`;
    console.log(`gzip: ${archivePath} > ${cArchivePath}`);
    await pipeline(
        fs.createReadStream(archivePath),
        zlib.createGzip(),
        fs.createWriteStream(`${cArchivePath}`),
        async () => {
            const cArchiveHashPath = `${cArchivePath}.${options.hashingAlgorithm}`;
            console.log(`${options.hashingAlgorithm}: ${cArchiveHashPath}`);
            const cArchiveHash = await hashFile(
                cArchivePath,
                options.hashingAlgorithm
            );
            fs.writeFileSync(cArchiveHashPath, cArchiveHash);
            console.log(`rm: ${archivePath}`);
            fs.rmSync(archivePath);
        }
    );
}

(async (): Promise<void> => {
    if (require.main === module) {
        // minimum number of positional arguments
        const minPosargs: number = 2;

        // default values of options arguments
        const defaultOptargs: {[key: string]: any} = {
            'digest-basename': DEFAULT_ASSETS_INDEX_BASENAME,
            'docs-dirname': DEFAULT_DOCS_DIRNAME,
            'hashing-algorithm': DEFAULT_HASHING_ALGORITHM,
            'pack-destination': DEFAULT_OUTPUT_DIR,
        };

        // required options arguments
        const requiredOptargs: string[] = [
            'docs-dirname',
            'digest-basename',
            'hashing-algorithm',
            'pack-destination',
        ];

        // the interface of parseArgs is very simple and Typescript does not play
        // nicely with it, since it expects any reassignments to be of the same type
        // as the primitives parseArgs allows. That's why I'm doing a lot of `as
        // unknown as whatever` kung-fu down below. The node runtime doesn't care
        // anyway...
        var {values, positionals} = util.parseArgs({
            options: {
                'docs-dirname': {
                    type: 'string',
                },
                'digest-basename': {
                    type: 'string',
                },
                'hashing-algorithm': {
                    type: 'string',
                },
                'pack-destination': {
                    type: 'string',
                },
                'input-test-reports': {
                    type: 'string',
                },
                'input-docs': {
                    type: 'string',
                },
                'help': {
                    type: 'boolean',
                    short: 'h'
                }
            },
            allowPositionals: true
        });

        // there's probably a prettier way as to not have to reassign this just to
        // make tsc happy, but I'm a little exhausted...
        const args: string[] = positionals;

        if (values.help != undefined) {
            const exec = [
                'ts-node',
                path.join(path.basename(__dirname), path.basename(__filename))
            ].join(' ');
            console.log(usage(exec));
            process.exit(1);
        }

        values = {...defaultOptargs, ...values};

        var errors: boolean = false;

        for (var requiredOptarg of requiredOptargs) {
            if (!(requiredOptarg in values)) {
                console.error(
                    `error: missing options argument: --${requiredOptarg}`
                );
                errors = true;
            }
        }

        if (positionals.length < minPosargs) {
            if (positionals.length == 1) {
                positionals.push(DEFAULT_OUTPUT_DIR);
            }

            else if (positionals.length == 0) {
                positionals.push(DEFAULT_INPUT_DIR);
                positionals.push(DEFAULT_OUTPUT_DIR);
            }
        }

        if (errors != false) {
            console.log(`supply -h/--help, for more information.`)
            process.exit(1);
        }

        await pack({
            inputDir: positionals[0],
            outputDir: values['pack-destination']!,
            docsInputDir: values['input-docs'] ?? null,
            testReportsInputDir: values['input-test-reports'] ?? null,
            digestBasename: values['digest-basename']!,
            docsOutputDirname: values['docs-dirname']!,
            hashingAlgorithm: values['hashing-algorithm']!,
        });
    }
})()
