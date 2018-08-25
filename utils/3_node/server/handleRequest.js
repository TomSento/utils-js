import * as $path from 'path';
import * as $fs from 'fs';
import * as $url from 'url';
import * as $querystring from 'querystring';
import $malloc from '../../0_internal/malloc';
import $MultipartParser from './internal/MultipartParser';
import $destroyStream from '../destroyStream';

var STATIC_ACCEPTS = [
    '.txt', '.md',
    '.html', '.xml', '.json',
    '.woff', '.woff2', '.otf', '.ttf', '.eot',
    '.js', '.css',
    '.jpg', '.png', '.gif', '.svg', '.ico',
    '.mp4', '.mp3', '.swf',
    '.pdf', '.docx', '.xlsx', '.doc', '.xls',
    '.zip', '.rar'
];
var EXP_ONLY_SLASHES = /^\/{2,}$/;
var RES_FN_CALLS_BLACKLIST = [ // --------------------------------------------> EXCEPT end()
    'addTrailers',
    'removeHeader',
    'setHeader',
    'setTimeout',
    'write',
    'writeContinue',
    'writeHead',
    'writeProcessing'
];
var MAX_URL_LEN = 2000;
var MAX_URL_QUERY_LEN = 1000;
var FILE_INDEX = 0;
var CONCAT = [null, null];

export default function handleRequest(req, res, routeError) {
    prepareRoute(req, res, routeError, function(route) {

    });
}

function prepareRoute(req, res, routeError, next) {
    var route = findRoute();
    if (route) {
        res.statusCode = 200;
        return next(route);
    }
    if (req.method !== 'GET') {
        return routeError(req, res, 404, null);
    }
    var pathname = toPathname(req.url);
    if (pathname[pathname.length - 1] === '/') { // --------------------------> "/uploads/img.jpg/" OR "/" - 404
        return routeError(req, res, 404, null);
    }
    var ext = $path.extname(pathname);
    if (!ext || STATIC_ACCEPTS.indexOf(ext) === -1) {
        return routeError(req, res, 404, null);
    }
    var filepath = $path.resolve('./public' + pathname);
    $fs.stat(filepath, function(err) {
        if (err) {
            return routeError(req, res, err.code === 'ENOENT' ? 404 : 500, null);
        }
        serveStaticFile();
    });
}

function findRoute() {

}

function toPathname(v) {
    return v.split(/\?+/)[0] || '/';
}

function serveStaticFile() {

}
