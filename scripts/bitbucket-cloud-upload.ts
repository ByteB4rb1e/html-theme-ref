#!/usr/bin/env ts-node
/* 
 * This script exists, so that the build driver stays within the Node.js runtime
 * environment and not require an external executable like curl and, most
 * importantly, not require any of those fragile npm packages as dependencies.
 */
import * as child_process from 'node:child_process';
import * as fs from 'node:fs';
import * as https from 'node:https';
import { ClientRequest } from 'node:http';
import * as path from 'node:path';
import * as util from 'node:util';

const HOSTNAME: string = 'api.bitbucket.org';
const DEFAULT_WORKSPACE: string = 'byteb4rb1e';
const DEFAULT_REPO_SLUG: string = 'html-theme-ref';
// defaulting to 2 MiB allocation, please don't be a smart-ass about
// bit-shifting as a performance enhancement...
const DEFAULT_BUFFER_SIZE: number = 2 * Math.pow(1024, 2);
/**
 * mapping of file extension to MIME types
 *
 * @remarks
 * {@link https://en.wikipedia.org/wiki/List_of_archive_formats
   | Wikipedia article on Archive formats, including their MIME types}
 */
const MIME_TYPES: {[key: string]: string} = {
    '.tar': 'application/x-tar',
}

export interface UploadOptions {
    /**
     * paths of local files to upload
     */
    localArtifacts: string[],
    /**
     * workspace id in Bitbucket Cloud
     */
    workspace: string,
    /**
     * name of repository hosted on Bitbucket Cloud
     */
    repoSlug: string,
    /**
     * Bitbucket Cloud access token
     */
    accessToken: string,
    /**
     * size of buffer for reading local files.
     */
    bufferSize: number,
}

/**
 * returns a usage string for this script
 *
 * @param path - path to this script, or an alias
 */
export function usage(argv1: string): string {
    return `
Usage: ${argv1} [OPTIONS] PATH [PATH] ...

Upload download artifacts to Bitbucket Cloud (${HOSTNAME})


Positional arguments:

    PATH - path to a local artifact that should be uploaded. Currently only
           files with a .tar extension are supported. Extend MIME_TYPES in this
           script to allow for files with different extensions.

Options:

    -w, --workspace    - id of a Bitbucket Cloud workspace
                         [default:${DEFAULT_WORKSPACE}]

    -r, --repo-slug    - slug of a Bitbucket Cloud repository
                         [default:${DEFAULT_REPO_SLUG}]

    -a, --access-token - access token of Bitbucket Cloud. The access token must
                         be granted write access to the repository. [required]

    -b, --buffer-size  - size of buffer (in Mebibytes) to read local files into
                         [default:${DEFAULT_BUFFER_SIZE / Math.pow(1024, 2)}]

    -h, --help         - display this help message

Environment variables:

    BITBUCKET_ACCESS_TOKEN - same as \`-a\`,\`--access-token\` option

References:

    https://developer.atlassian.com/cloud/bitbucket/rest/api-group-downloads/#api-repositories-workspace-repo-slug-downloads-get
`;
}

/**
    write local files as RFC1341 multipart data to an open HTTP socket

    @param socket - request object returned by `https.request` operation
    @param boundary - RFC1341 boundary announced to server
    @param data - object of file basenames and corresponding (open) file
                  descriptors, as well as their resolved MIME type
    @param bufferSize - size of read buffer

    @remarks
    RTFM - it really isn't that hard to write a client for uploading multipart
    form-data instead of relying on a dependency that introduces breaking
    changes every week... https://datatracker.ietf.org/doc/html/rfc1341
 */
export function writeMultipartData(
    socket: ClientRequest,
    boundary: string,
    data: {[key: string]: [number, string]},
    bufferSize?: number,
): void {
    bufferSize = bufferSize ?? DEFAULT_BUFFER_SIZE;

    Object.entries(data).forEach(([basename, [fd, mimeType]]) => {
        console.log(`uploading ${basename}...`);

        const buffer = Buffer.alloc(bufferSize);

        socket.write(`--${boundary}`);
        socket.write('\r\n');
        socket.write(`Content-Disposition: form-data; name="file";filename="${basename}"`);
        socket.write('\r\n');
        socket.write(`Content-Type: ${mimeType}`);
        socket.write('\r\n\r\n');

        let bytesRead = 0;
        do {
            bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
            // slicing so we make sure not to write any null bytes
            socket.write(buffer.slice(0, bytesRead));
        } while (bytesRead > 0);

        socket.write('\r\n');

        fs.close(fd);
    });

    socket.write('\r\n');
}

/**
 * Upload local files as download artifacts to Bitbucket Cloud with access token
 * authentication
 *
 * @param options - configuration options for HTTP client
 *
 * @remarks
 * {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-downloads/#api-repositories-workspace-repo-slug-downloads-post
 * | Bitbucket Cloud API Reference}
 */
function upload(options: UploadOptions): void {
    options = {
        ...{
            bufferSize: DEFAULT_BUFFER_SIZE,
            repoSlug: DEFAULT_REPO_SLUG,
            workspace: DEFAULT_WORKSPACE,
        },
        ...options
    };

    // let's make sure the file's are actually readable by getting a file
    // descriptor for all of them right at the beginning, including their MIME
    // type. Assuming files are encoded...
    const artifacts: {[key: string]: [number, string]} = {};
    for (const file in options.localArtifacts) {
        const mimeType = MIME_TYPES[path.extname(file)];

        if (mimeType === undefined) {
            throw new Error(`unable to determine MIME type: ${file}`);
        }

        artifacts[path.basename(file)] = [fs.openSync(file, 'rb'), mimeType];
    }

    // define a RFC1341 boundary
    const boundary = `boundary-${Math.random().toString(16).slice(2)}`;

    console.log(`connecting and sending header to ${HOSTNAME}...`);

    // open the socket and set a callback for the response from the server
    // thank you Bitbucket for keeping your API stable. 🙏
    const socket = https.request({
        hostname: HOSTNAME,
        path: `/2.0/repositories/${options.workspace}/${options.repoSlug}/downloads`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${options.accessToken}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        }
    }, (res) => {
        let responseData = '';

        res.on('data', chunk => responseData += chunk);

        res.on('end', () => {
            console.log(`${HOSTNAME}:`, responseData);
        });
    });

    console.log(`sending body to ${HOSTNAME}...`);

    try {
        writeMultipartData(socket, boundary, artifacts, options.bufferSize);
    }

    catch(e: any) {
        console.error('error writing multipart data:', e);
        socket.abort();
    }

    socket.write(`--${boundary}--`);
    socket.end();
};

if (require.main === module) {
    // minimum number of positional arguments
    const minPosargs: number = 1;

    // default values of options arguments
    const defaultOptargs: {[key: string]: any} = {
        workspace: DEFAULT_WORKSPACE,
        'repo-slug': DEFAULT_REPO_SLUG,
        'buffer-size': DEFAULT_BUFFER_SIZE,
        'access-token': process.env.BITBUCKET_ACCESS_TOKEN,
    }

    // required options arguments
    const requiredOptargs: string[] = [
        'workspace',
        'repo-slug',
        'access-token',
        'buffer-size'
    ];

    // the interface of parseArgs is very simple and Typescript does not play
    // nicely with it, since it expects any reassignments to be of the same type
    // as the primitives parseArgs allows. That's why I'm doing a lot of `as
    // unknown as whatever` kung-fu down below. The node runtime doesn't care
    // anyway...
    var {values, positionals} = util.parseArgs({
        options: {
            'workspace': {
                type: 'string',
                short: 'w'
            },
            'repo-slug': {
                type: 'string',
                short: 'r'
            },
            'access-token': {
                type: 'string',
                short: 'a'
            },
            'buffer-size': {
                type: 'string',
                short: 'b'
            },
            'help': {
                type: 'boolean',
                short: 'h'
            }
        },
        allowPositionals: true,
    });

    if (values.help != undefined) {
        const exec = [
            'ts-node',
            path.join(path.basename(__dirname), path.basename(__filename))
        ].join(' ');
        console.log(usage(exec));
        process.exit(1);
    }

    // convert from Mebibytes (input) to bytes and truncate the result since
    // bytes aren't fractional...
    if (values['buffer-size'] != undefined) {
        values['buffer-size'] = Math.trunc(
            parseFloat(values['buffer-size']) * Math.pow(1024, 2)
        ) as unknown as string;
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
        console.error(
            `error: at least ${minPosargs} positional argument(s) required`
        );
        errors = true;
    }

    if (errors != false) {
        console.log(`supply -h/--help, for more information.`)
        process.exit(1);
    }

    upload({
        localArtifacts: positionals,
        workspace: values['workspace']!,
        repoSlug: values['repo-slug']!,
        accessToken: values['access-token']!,
        bufferSize: values['buffer-size'] as unknown as number,
    });
}
