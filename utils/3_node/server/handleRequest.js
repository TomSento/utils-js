import * as $path from 'path';
import * as $fs from 'fs';
import * as $url from 'url';
import * as $querystring from 'querystring';
import $malloc from '../../0_internal/malloc';
import $MultipartParser from './internal/MultipartParser';
import $destroyStream from '../destroyStream';

var cache = $malloc('__SERVER');
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
    var route = findRoute(req);
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
        serveStaticFile(req, res, routeError, filepath);
    });
}

function findRoute(req) {
    var tmp = toPathname(req.url);
    if (EXP_ONLY_SLASHES.test(tmp)) {
        return null;
    }
    var pathname = (tmp !== '/' && tmp[tmp.length - 1] === '/') ? tmp.slice(0, -1) : tmp;
    var matchers = cache('matchers') || {};
    var matcher = null;
    for (var k in matchers) {
        if (matchers.hasOwnProperty(k)) {
            var exp = matchers[k];
            if (exp.test(pathname)) {
                matcher = k;
            }
        }
    }
    if (!matcher) {
        return null;
    }
    var mfd = getContentType4L(req) === 'data';
    var routes = cache('routes') || {};
    return routes[matcher + '?' + req.method + '?' + (mfd ? 'mfd' : 'def')] || null;
}

function toPathname(v) {
    return v.split(/\?+/)[0] || '/';
}

function getContentType4L(req) {
    var str = req.headers['content-type'] || '';
    var i = str.lastIndexOf(';');
    if (i >= 0) {
        str = str.slice(0, i);
    }
    return str.slice(-4);
}

function serveStaticFile(req, res, routeError, filepath) {
    var stream = $fs.createReadStream(filepath);
    stream.once('error', function(err) {
        console.log(err); // eslint-disable-line no-console
        routeError(req, res, 500, null);
    });
    stream.pipe(res);
}
