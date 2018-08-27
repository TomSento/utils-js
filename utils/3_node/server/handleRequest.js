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
        monitorResponseChanges(req, res, routeError, route);
        prepareRequest(req, res, routeError, route, function() {

        });
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

function monitorResponseChanges(req, res, routeError, route) {
    var resEndCalled = false;
    for (var i = 0, l = RES_FN_CALLS_BLACKLIST.length; i < l; i++) {
        var k = RES_FN_CALLS_BLACKLIST[i];
        ignoreSubsequentCallsAfterEnd(k, res[k]);
    }
    function ignoreSubsequentCallsAfterEnd(fnName, fnNative) {
        res[fnName] = function(/* args */) {
            if (resEndCalled) { // -------------------------------------------> PREVENT Error [ERR_STREAM_WRITE_AFTER_END]: write after end
                return;
            }
            fnNative.apply(res, arguments);
        };
    }
    res.setTimeout(route.maxTimeout, function() {}); // ----------------------> EMPTY FUNCTION SO SOCKET IS NOT DESTROYED BY Node.js
    var totalRouteTimeout = setTimeout(function() {
        routeError(req, res, 408, null);
    }, route.maxTimeout);
    (function(nativeEnd) {
        res.end = function(/* args */) { // ----------------------------------> WORKS ALSO WITH readable.pipe(res) - https://github.com/nodejs/node/blob/master/lib/_stream_readable.js#L625
            if (resEndCalled) { // -------------------------------------------> PREVENT Error [ERR_STREAM_WRITE_AFTER_END]: write after end
                return;
            }
            resEndCalled = true;
            clearTimeout(totalRouteTimeout);
            nativeEnd.apply(res, arguments);
        };
    }(res.end));
}

function prepareRequest(req, res, routeError, route, next) {
    var url = $url.parse(req.url);
    if (req.url.length >= MAX_URL_LEN || (url.query || '').length >= MAX_URL_QUERY_LEN) {
        return routeError(req, res, 414, null);
    }
    var args = [];
    var tmp = url.pathname || '/';
    if (tmp !== '/') {
        tmp = tmp[tmp.length - 1] === '/' ? tmp.slice(0, -1) : tmp;
        var m = tmp.match(route.exp);
        if (m && m.length > 1) {
            args = m.slice(1);
        }
    }
    var query = {};
    if (url.query && typeof(url.query) === 'string') {
        query = $querystring.parse(url.query) || {};
    }
    req.headers.cookie = req.headers.cookie ? prepareRequestCookies(req) : {};
    tmp = getContentType4L(req);
    if (tmp === 'json') {
        prepareRequestJSON(req, res, routeError, route, function(body) {
            next(args, query, body);
        });
    }
    else if (tmp === 'data') {
        // prepareRequestMULTIPART
    }
    else if (req.headers['content-type'] === undefined) {
        next(args, query, {});
    }
    else {
        routeError(req, res, 400, null);
    }
}

function prepareRequestCookies(req) {
    var obj = {};
    var str = req.headers.cookie;
    (function nextKV(i) {
        var j = str.indexOf('=', i + 1);
        if (j === -1) {
            return obj;
        }
        var k = str.indexOf(';', j + 1);
        if (k === -1) {
            k = str.length;
        }
        var key = str.slice(i, j).trim();
        var val = str.slice(j + 1, k);
        if (key && val) {
            obj[key] = decodeURI(val);
        }
        nextKV(++k);
    }(0));
    return obj;
}

function prepareRequestJSON(req, res, routeError, route, next) {
    if (['POST', 'PUT'].indexOf(req.method) === -1) {
        return routeError(req, res, 400, null);
    }
    var requestEnded = false;
    req.once('close', function() {
        if (!requestEnded) { // ----------------------------------------------> UNEXPECTED CLOSING
            routeError(req, res, 500, null);
        }
    });
    var size = 0;
    var b = [];
    req.on('data', function(buffer) {
        size += buffer.length;
        if (size < route.maxSize) {
            b.push(buffer);
        }
    });
    req.once('end', function() {
        requestEnded = true;
        if (size >= route.maxSize) {
            b = undefined;
            return routeError(req, res, 413, null);
        }
        try {
            var body = JSON.parse(Buffer.concat(b).toString('utf8'));
            if (Object.prototype.toString.call(body) !== '[object Object]') {
                return routeError(req, res, 400, null);
            }
            next(body);
        }
        catch (err) {
            routeError(req, res, 400, null);
        }
    });
}

function parseMultipartHeader(header) {
    var tmp = '';
    var search = ' name="';
    var len = search.length;
    var beg = header.indexOf(search);
    if (beg >= 0) {
        tmp = header.slice(beg + len, header.indexOf('"', beg + len));
    }
    var name = tmp ? tmp : ('undefined_' + Math.floor(Math.random() * 100000)); // HTML INPUT NAME
    tmp = '';
    search = ' filename="';
    len = search.length;
    beg = header.indexOf(search);
    if (beg >= 0) {
        tmp = header.slice(beg + len, header.indexOf('"', beg + len));
    }
    return {
        name: name,
        filename: tmp || null
    };
}

function FormDataEntry() { // ------------------------------------------------> ONE FILE OR VALUE PART
    this.name = undefined; // ------------------------------------------------> INPUT NAME - GROUP KEY
    this.filename = undefined;
    this.contentType = undefined;
    this.path = undefined;
    this.value = undefined;
}
