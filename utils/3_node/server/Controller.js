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

export default function Controller(req, res, routeError) {
    var cache = $malloc('__SERVER');
    var self = this;
    self.args = [];
    self.query = {};
    self.body = {};
    self.run = function() {
        self.prepareRoute(function() {
            self.monitorResponseChanges();
            self.prepareRequest(function() {
                self.invokeRoute();
            });
        });
    };
    self.prepareRoute = function(next) {
        self.route = self.findRoute();
        if (self.route) {
            res.statusCode = 200;
            return next();
        }
        if (req.method !== 'GET') {
            return routeError(req, res, 404, null);
        }
        var pathname = self.toPathname(req.url);
        if (pathname[pathname.length - 1] === '/') { // ----------------------> "/uploads/img.jpg/" OR "/" - 404
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
            self.serveStaticFile(filepath);
        });
    };
    self.findRoute = function() {
        var tmp = self.toPathname(req.url);
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
        var xhr = req.headers['x-requested-with'] === 'XMLHttpRequest';
        var mfd = self.getContentType4L() === 'data';
        var routes = cache('routes') || {};
        var route = routes[matcher + '?' + req.method + '?' + (xhr ? 'xhr?' : 'def?') + (mfd ? 'mfd' : 'def')] || null;
        if (route) {
            return route;
        }
        return routes[matcher + '?' + req.method + '?def?' + (mfd ? 'mfd' : 'def')] || null; // XHR INSENSITIVE
    };
    self.toPathname = function(v) {
        return v.split(/\?+/)[0] || '/';
    };
    self.getContentType4L = function() {
        var str = req.headers['content-type'] || '';
        var i = str.lastIndexOf(';');
        if (i >= 0) {
            str = str.slice(0, i);
        }
        return str.slice(-4);
    };
    self.serveStaticFile = function(filepath) {
        var stream = $fs.createReadStream(filepath);
        stream.once('error', function(err) {
            console.log(err); // eslint-disable-line no-console
            routeError(req, res, 500, null);
        });
        stream.pipe(res);
    };
    self.monitorResponseChanges = function() {
        var resEndCalled = false;
        for (var i = 0, l = RES_FN_CALLS_BLACKLIST.length; i < l; i++) {
            var k = RES_FN_CALLS_BLACKLIST[i];
            ignoreSubsequentCallsAfterEnd(k, res[k]);
        }
        function ignoreSubsequentCallsAfterEnd(fnName, fnNative) {
            res[fnName] = function(/* args */) {
                if (resEndCalled) { // ---------------------------------------> PREVENT Error [ERR_STREAM_WRITE_AFTER_END]: write after end
                    return;
                }
                fnNative.apply(res, arguments);
            };
        }
        res.setTimeout(self.route.maxTimeout, function() {}); // -------------> EMPTY FUNCTION SO SOCKET IS NOT DESTROYED BY Node.js
        var totalRouteTimeout = setTimeout(function() {
            routeError(req, res, 408, null);
        }, self.route.maxTimeout);
        (function(nativeEnd) {
            res.end = function(/* args */) { // ------------------------------> WORKS ALSO WITH readable.pipe(res) - https://github.com/nodejs/node/blob/master/lib/_stream_readable.js#L625
                if (resEndCalled) { // ---------------------------------------> PREVENT Error [ERR_STREAM_WRITE_AFTER_END]: write after end
                    return;
                }
                resEndCalled = true;
                clearTimeout(totalRouteTimeout);
                nativeEnd.apply(res, arguments);
            };
        }(res.end));
    };
    self.prepareRequest = function(next) {
        var url = $url.parse(req.url);
        if (req.url.length >= MAX_URL_LEN || (url.query || '').length >= MAX_URL_QUERY_LEN) {
            return routeError(req, res, 414, null);
        }
        var tmp = url.pathname || '/';
        if (tmp !== '/') {
            tmp = tmp[tmp.length - 1] === '/' ? tmp.slice(0, -1) : tmp;
            var m = tmp.match(self.route.exp);
            if (m && m.length > 1) {
                self.args = m.slice(1);
            }
        }
        if (url.query && typeof(url.query) === 'string') {
            self.query = $querystring.parse(url.query) || {};
        }
        req.headers.cookie = req.headers.cookie ? self.prepareRequestCookies() : {};
        tmp = self.getContentType4L();
        if (tmp === 'json') {
            self.prepareRequestJSON(next);
        }
        else if (tmp === 'data') {
            self.prepareRequestMULTIPART(next);
        }
        else if (req.headers['content-type'] === undefined) {
            next();
        }
        else {
            routeError(req, res, 400, null);
        }
    };
    self.prepareRequestCookies = function() {
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
    };
    self.prepareRequestJSON = function(next) {
        if (['POST', 'PUT'].indexOf(req.method) === -1) {
            return routeError(req, res, 400, null);
        }
        var requestEnded = false;
        req.once('close', function() {
            if (!requestEnded) { // ------------------------------------------> UNEXPECTED CLOSING
                routeError(req, res, 500, null);
            }
        });
        var size = 0;
        var b = [];
        req.on('data', function(buffer) {
            size += buffer.length;
            if (size < self.route.maxSize) {
                b.push(buffer);
            }
        });
        req.once('end', function() {
            requestEnded = true;
            if (size >= self.route.maxSize) {
                b = undefined;
                return routeError(req, res, 413, null);
            }
            try {
                var v = JSON.parse(Buffer.concat(b).toString('utf8'));
                if (Object.prototype.toString.call(v) !== '[object Object]') {
                    return routeError(req, res, 400, null);
                }
                self.body = v;
                next();
            }
            catch (err) {
                routeError(req, res, 400, null);
            }
        });
    };
    self.prepareRequestMULTIPART = function(next) {
        var boundary = req.headers['content-type'].split(';')[1];
        if (!boundary) {
            return routeError(req, res, 400, null);
        }
        boundary = boundary.slice(boundary.indexOf('=', 2) + 1); // –---------> indexOf('=', 2) FOR PERFORMANCE
        if (!boundary || ['POST', 'PUT'].indexOf(req.method) === -1) {
            return routeError(req, res, 400, null);
        }
        var requestEnded = false;
        var rm = [];
        self.body = [];
        req.once('close', function() {
            if (!requestEnded) { // ------------------------------------------> UNEXPECTED CLOSING - parser.onEnd() - NO ACTION
                for (var i = 0, l = rm.length; i < l; i++) {
                    $fs.unlink(rm[i], function() {});
                }
                self.body = {};
                routeError(req, res, 500, null);
            }
        });
        var parser = new $MultipartParser();
        var size = 0;
        var maxSize = self.route.maxSize;
        var entry;
        var step;
        var processingFile;
        var firstWrite;
        var fileStream;
        var path = process.cwd() + $path.sep + 'tmp' + $path.sep + 'uploadedfile-';
        var unclosedFileStreams = 0;
        parser.initWithBoundary(boundary);
        parser.onPartBegin = function() {
            if (size >= maxSize) {
                return;
            }
            entry = new FormDataEntry();
            entry.value = Buffer.alloc(0);
            step = 0;
            processingFile = false;
            firstWrite = true;
        };
        parser.onHeaderValue = function(buffer, start, end) {
            if (size >= maxSize) {
                return;
            }
            var i;
            var header = buffer.slice(start, end).toString('utf8');
            if (step === 1) {
                i = header.indexOf(';');
                if (i === -1) {
                    entry.contentType = header.trim();
                }
                else {
                    entry.contentType = header.slice(0, i).trim();
                }
                step = 2;
                return;
            }
            if (step > 0) {
                return;
            }
            if (header.indexOf('form-data; ') === -1) { // -------------------> UNKNOWN ERROR, MAYBE ATTACK
                maxSize = -1;
                if (!processingFile) {
                    $destroyStream(fileStream);
                }
                return;
            }
            header = self.parseMultipartHeader(header);
            step = 1;
            entry.name = header.name;
            processingFile = !!header.filename;
            if (!processingFile) {
                $destroyStream(fileStream);
                return;
            }
            entry.filename = header.filename;
            i = entry.filename.lastIndexOf('\\'); // -------------------------> IE9 SENDS ABSOLUTE FILENAME
            if (i === -1) { // -----------------------------------------------> FOR UNIX LIKE SENDERS
                i = entry.filename.lastIndexOf('/');
            }
            if (i >= 0) {
                entry.filename = entry.filename.slice(i + 1);
            }
            entry.path = path + (FILE_INDEX++) + '.bin';
        };
        parser.onPartData = function(buffer, start, end) {
            if (size >= maxSize) {
                return;
            }
            var data = buffer.slice(start, end);
            size += data.length;
            if (size >= maxSize) {
                return;
            }
            if (!processingFile) { // ----------------------------------------> VALUE PART
                if (firstWrite) {
                    firstWrite = false;
                }
                CONCAT[0] = entry.value;
                CONCAT[1] = data;
                entry.value = Buffer.concat(CONCAT);
                return;
            }
            if (!firstWrite) { // --------------------------------------------> FILE PART
                fileStream.write(data);
                return;
            }
            if (firstWrite) {
                firstWrite = false;
            }
            unclosedFileStreams++;
            fileStream = $fs.createWriteStream(entry.path);
            rm.push(entry.path);
            fileStream.once('close', function() {
                unclosedFileStreams--;
            });
            fileStream.once('error', function(err) { // ----------------------> MISSING "tmp" DIRECTORY OR OTHER ERROR
                console.log(err); // eslint-disable-line no-console
                unclosedFileStreams--;
            });
            fileStream.write(data);
        };
        parser.onPartEnd = function() {
            if (fileStream) {
                fileStream.end();
                fileStream = null;
            }
            if (size >= maxSize) {
                return;
            }
            entry.value = processingFile ? undefined : entry.value.toString('utf8');
            self.body.push(entry);
        };
        function onceEnd() { // ----------------------------------------------> HANDLER "parser.onEnd()" IS CALLED BY "MultipartParser" - DO NOT USE - FOR FULL CONTROL OVER INVOCATION TIME USE "onceEnd()" INSTEAD
            if (unclosedFileStreams > 0) {
                setImmediate(function() {
                    onceEnd();
                });
            }
            else {
                if (size >= maxSize) {
                    for (var i = 0, l = rm.length; i < l; i++) {
                        $fs.unlink(rm[i], function() {});
                    }
                    self.body = {};
                    return routeError(req, res, 431, null);
                }
                next();
            }
        }
        req.on('data', function(buffer) {
            parser.write(buffer);
        });
        req.once('end', function() {
            requestEnded = true;
            onceEnd();
        });
    };
    self.parseMultipartHeader = function(header) {
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
    };
    self.invokeRoute = function() {
        self.route.fn.call({}, req, res, self.args, self.query, self.body);
    };
    self.prepareStatus = function(statusCode) { // ---------------------------> https://httpstatuses.com/
        var v = parseInt(statusCode);
        return (isNaN(v) || v < 100 || v >= 600) ? 200 : v;
    };
}

function FormDataEntry() { // ------------------------------------------------> ONE FILE OR VALUE PART
    this.name = undefined; // ------------------------------------------------> INPUT NAME - GROUP KEY
    this.filename = undefined;
    this.contentType = undefined;
    this.path = undefined;
    this.value = undefined;
}
