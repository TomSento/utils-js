import * as $path from 'path';
import * as $fs from 'fs';
import * as $url from 'url';
import * as $querystring from 'querystring';
import $global from '../../global';
import $malloc from '../../0_internal/malloc';
import $MultipartParser from './internal/MultipartParser';
import $parseMultipartHeader from './internal/parseMultipartHeader';

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

export default function $Controller1(req, res) {
    var cache = $malloc('__SERVER');
    var self = this;
    self.req = req;
    self.res = res;
    self.error = null;
    self.run = function() {
        self.prepareRoute(function() {
            self.monitorResponseChanges();
            if (['#public', '#error'].indexOf(self.route.matcher) >= 0) {
                return self.invokeRoute();
            }
            self.prepareRequest(function() {
                self.invokeRoute();
            });
        });
    };
    self.prepareRoute = function(next) {
        self.route = self.findRoute();
        if (self.route) {
            self.res.statusCode = 200;
            return next();
        }
        if (self.req.method !== 'GET') {
            self.prepareWithError(404);
            return next();
        }
        var pathname = self.toPathname(self.req.url);
        if (pathname[pathname.length - 1] === '/') { // ----------------------> "/uploads/img.jpg/" OR "/" - 404
            self.prepareWithError(404);
            return next();
        }
        var ext = $path.extname(pathname);
        if (!ext || cache('app').config.staticAccepts.indexOf(ext) === -1) {
            self.prepareWithError(404);
            return next();
        }
        var filepath = $path.resolve(cache('app').config.publicDirectory + pathname);
        $fs.stat(filepath, function(err) {
            if (err) {
                self.prepareWithError(err.code === 'ENOENT' ? 404 : 500);
            }
            else { // --------------------------------------------------------> PUBLIC FILE EXISTS IN FS
                self.route = cache('publicRoute');
                self.res.statusCode = 200;
            }
            next();
        });
    };
    self.findRoute = function() {
        var tmp = self.toPathname(self.req.url);
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
        var xhr = self.req.headers['x-requested-with'] === 'XMLHttpRequest';
        var mfd = self.getContentType4L() === 'data';
        var routes = cache('routes') || {};
        var route = routes[matcher + '?' + self.req.method + '?' + (xhr ? 'xhr?' : 'def?') + (mfd ? 'mfd' : 'def')] || null;
        if (route) {
            return route;
        }
        return routes[matcher + '?' + self.req.method + '?def?' + (mfd ? 'mfd' : 'def')] || null; // XHR INSENSITIVE
    };
    self.toPathname = function(v) {
        return v.split(/\?+/)[0] || '/';
    };
    self.getContentType4L = function() {
        var str = self.req.headers['content-type'] || '';
        var i = str.lastIndexOf(';');
        if (i >= 0) {
            str = str.slice(0, i);
        }
        return str.slice(-4);
    };
    self.prepareWithError = function(status) {
        if (!cache('errorRoute')) {
            throw new Error('missingErrorRoute');
        }
        self.route = cache('errorRoute');
        self.res.statusCode = status;
    };
    self.monitorResponseChanges = function() {
        var resEndCalled = false;
        for (var i = 0, l = RES_FN_CALLS_BLACKLIST.length; i < l; i++) {
            var k = RES_FN_CALLS_BLACKLIST[i];
            ignoreSubsequentCallsAfterEnd(k, self.res[k]);
        }
        function ignoreSubsequentCallsAfterEnd(fnName, fnNative) {
            self.res[fnName] = function(/* args */) {
                if (resEndCalled) { // ---------------------------------------> PREVENT Error [ERR_STREAM_WRITE_AFTER_END]: write after end
                    return;
                }
                fnNative.apply(self.res, arguments);
            };
        }
        self.res.setTimeout(self.route.maxTimeout, function() {}); // --------> EMPTY FUNCTION SO SOCKET IS NOT DESTROYED BY Node.js
        var totalRouteTimeout = setTimeout(function() {
            self.routeError(408);
        }, self.route.maxTimeout);
        (function(nativeEnd) {
            self.res.end = function(/* args */) { // -------------------------> WORKS ALSO WITH readable.pipe(res) - https://github.com/nodejs/node/blob/master/lib/_stream_readable.js#L625
                if (resEndCalled) { // ---------------------------------------> PREVENT Error [ERR_STREAM_WRITE_AFTER_END]: write after end
                    return;
                }
                resEndCalled = true;
                clearTimeout(totalRouteTimeout);
                nativeEnd.apply(self.res, arguments);
            };
        }(self.res.end));
    };
    self.destroyStream = function(stream) {
        if (stream instanceof ReadStream) {
            stream.destroy();
            if (typeof(stream.close) === 'function') {
                stream.on('open', function() {
                    if (typeof(this.fd) === 'number') {
                        this.close();
                    }
                });
            }
        }
        else if (stream instanceof Stream) {
            if (typeof(stream.destroy) === 'function') {
                stream.destroy();
            }
        }
        return stream;
    };
    self.prepareRequest = function(next) {
        var url = $url.parse(self.req.url);
        if (self.req.url.length >= MAX_URL_LEN || (url.query || '').length >= MAX_URL_QUERY_LEN) {
            self.prepareWithError(414);
            return next();
        }
        var tmp = url.pathname || '/';
        if (tmp === '/') {
            self.args = [];
        }
        else {
            tmp = tmp[tmp.length - 1] === '/' ? tmp.slice(0, -1) : tmp;
            var m = tmp.match(self.route.exp);
            self.args = (m || []).length > 1 ? m.slice(1) : [];
        }
        self.query = (url.query && typeof(url.query) === 'string') ? $querystring.parse(url.query) : null;
        self.body = null;
        tmp = self.getContentType4L();
        if (tmp === 'json') {
            self.prepareRequestJSON(next);
        }
        else if (tmp === 'data') {
            self.prepareRequestMULTIPART(next);
        }
        else if (self.req.headers['content-type'] === undefined) {
            next();
        }
        else {
            self.prepareWithError(400);
            next();
        }
    };
    self.prepareRequestJSON = function(next) {
        if (['POST', 'PUT'].indexOf(self.req.method).indexOf === -1) {
            return next();
        }
        var requestEnded = false;
        self.req.once('close', function() {
            if (!requestEnded) { // ------------------------------------------> UNEXPECTED CLOSING
                self.prepareWithError(500);
                next();
            }
        });
        var size = 0;
        var b = [];
        self.req.on('data', function(buffer) {
            size += buffer.length;
            if (size < self.route.maxSize) {
                b.push(buffer);
            }
        });
        self.req.once('end', function() {
            requestEnded = true;
            if (size >= self.route.maxSize) {
                b = undefined;
                self.prepareWithError(413);
                return next();
            }
            try {
                var v = JSON.parse(Buffer.concat(b).toString('utf8'));
                if (Object.prototype.toString.call(v) !== '[object Object]') {
                    self.prepareWithError(400);
                    return next();
                }
                self.body = v;
                next();
            }
            catch (err) {
                self.prepareWithError(400);
                next();
            }
        });
    };
    self.prepareRequestMULTIPART = function(next) {
        self.mfd = [];
        var boundary = self.req.headers['content-type'].split(';')[1];
        if (!boundary) {
            self.prepareWithError(400);
            return next();
        }
        boundary = boundary.slice(boundary.indexOf('=', 2) + 1); // –---------> indexOf('=', 2) FOR PERFORMANCE
        if (!boundary || ['POST', 'PUT'].indexOf(self.req.method) === -1) {
            self.prepareWithError(400);
            return next();
        }
        var requestEnded = false;
        var rm = [];
        self.req.once('close', function() {
            if (!requestEnded) { // ------------------------------------------> UNEXPECTED CLOSING - parser.onEnd() - NO ACTION
                for (var i = 0, l = rm.length; i < l; i++) {
                    $fs.unlink(rm[i]);
                }
                self.mfd = [];
                self.prepareWithError(500);
                next();
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
                    self.destroyStream(fileStream);
                }
                return;
            }
            header = $parseMultipartHeader(header);
            step = 1;
            entry.name = header.name;
            processingFile = !!header.filename;
            if (!processingFile) {
                self.destroyStream(fileStream);
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
                if (entry.path) {
                    rm.push(entry.path);
                }
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
            self.mfd.push(entry);
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
                        $fs.unlink(rm[i]);
                    }
                    self.mfd = [];
                    self.prepareWithError(431);
                }
                next();
            }
        }
        self.req.on('data', function(buffer) {
            parser.write(buffer);
        });
        self.req.once('end', function() {
            requestEnded = true;
            onceEnd();
        });
    };
    self.invokeRoute = function() {
        self.route.fn.apply(self, self.args);
    };
    self.stream = function(status, filepath) {
        self.res.statusCode = self.prepareStatus(status);
        var rs = $fs.createReadStream(filepath);
        rs.once('error', function(err) {
            return self.routeError(404, err);
        });
        rs.pipe(self.res);
    };
    self.prepareStatus = function(status) { // -------------------------------> https://httpstatuses.com/
        var v = parseInt(status);
        return (isNaN(v) || v < 100 || v >= 600) ? 200 : v;
    };
}
$Controller1.prototype = {
    routeError: function(status, err) {
        var v = parseInt(status);
        this.res.statusCode = (isNaN(v) || v < 400 || v >= 600) ? 500 : v;
        this.res.statusMessage = null;
        this.res.sendDate = true;
        if (err) {
            this.error = err;
        }
        var cache = $malloc('__SERVER');
        if (!cache('errorRoute')) {
            throw new Error('missingErrorRoute');
        }
        this.route = cache('errorRoute');
        this.invokeRoute();
    },
    json: function(status, a) {
        this.res.writeHead(this.prepareStatus(status), {
            'Content-Type': 'application/json'
        });
        this.res.end(JSON.stringify(a, null, '    '));
    },
    html: function(status, str) {
        this.res.writeHead(this.prepareStatus(status), {
            'Content-Type': 'text/html'
        });
        this.res.end('' + str);
    },
    plain: function(status, str) {
        this.res.writeHead(this.prepareStatus(status), {
            'Content-Type': 'text/plain'
        });
        this.res.end('' + str);
    }
};
$global.$Controller1 = $Controller1;

function FormDataEntry() { // ------------------------------------------------> ONE FILE OR VALUE PART
    this.name = undefined; // ------------------------------------------------> INPUT NAME - GROUP KEY
    this.filename = undefined;
    this.contentType = undefined;
    this.path = undefined;
    this.value = undefined;
}
