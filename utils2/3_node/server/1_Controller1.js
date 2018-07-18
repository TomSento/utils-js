import * as $path from 'path';
import * as $fs from 'fs';
import * as $url from 'url';
import * as $querystring from 'querystring';
import $global from '../../global';
import $malloc from '../../0_internal/malloc';
import $MultipartParser from './internal/MultipartParser';

export default function $Controller1(req, res) {
    var cache = $malloc('__SERVER');
    var self = this;
    self.req = req;
    self.res = res;
    self.error = null;
    self.run = function() {
        self.prepareRoute(function(status) {
            self.res.statusCode = status;
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
            return next(200);
        }
        if (self.req.method !== 'GET') {
            self.route = cache('errorRoute');
            return next(404);
        }
        var pathname = self.toPathname(self.req.url);
        var ext = $path.extname(pathname);
        if (!ext || cache('app').config.staticAccepts.indexOf(ext) === -1) {
            self.route = cache('errorRoute');
            return next(404);
        }
        var filepath = $path.resolve(cache('app').config.publicDirectory, ('.' + pathname));
        $fs.stat(filepath, function(err) {
            if (err) {
                if (!cache('errorRoute')) {
                    throw new Error('missingErrorRoute');
                }
                self.route = cache('errorRoute');
                return next(err.code === 'ENOENT' ? 404 : 500);
            }
            else { // --------------------------------------------------------> PUBLIC FILE EXISTS IN FS
                self.route = cache('publicRoute');
                return next(200);
            }
        });
    };
    self.findRoute = function() {
        var matchers = cache('matchers') || {};
        var matcher = null;
        for (var k in matchers) {
            if (matchers.hasOwnProperty(k)) {
                var exp = matchers[k];
                if (exp.test(self.toPathname(self.req.url))) {
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
    self.monitorResponseChanges = function() {
        var responded = false;
        self.res.on('close', function() {
            if (!responded) {
                self.routeError(500);
            }
        });
        self.res.on('finish', function() { // --------------------------------> AFTER "res.end()" IS CALLED
            responded = true;
        });
        var execTime = 0;
        (function tick() {
            execTime += 1000;
            if (!responded && self.route.matcher !== '#error' && execTime < self.route.maxTimeout) {
                setTimeout(function() {
                    tick();
                }, 1000);
            }
        }());
        var fnsModifyingResponse = [
            'addTrailers',
            'end',
            'removeHeader',
            'setHeader',
            'setTimeout',
            'write',
            'writeContinue',
            'writeHead',
            'writeProcessing'
        ];
        for (var i = 0, l = fnsModifyingResponse.length; i < l; i++) {
            var fnName = fnsModifyingResponse[i];
            restrict408(fnName, self.res[fnName]);
        }
        function restrict408(fnName, fnNative) {
            self.res[fnName] = function(/* ...args */) {
                if (!responded) {
                    if (self.route.matcher !== '#error' && execTime >= self.route.maxTimeout) {
                        return self.routeError(408);
                    }
                    fnNative.apply(self.res, arguments);
                }
            };
        }
        self.res.on('pipe', function(source) {
            if (self.route.matcher !== '#error' && execTime >= self.route.maxTimeout) {
                self.destroyStream(source);
            }
        });
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
        var m = (url.pathname || '').match(self.route.exp);
        self.args = (m || []).length > 1 ? m.slice(1) : [];
        self.query = (url.query && typeof(url.query) === 'string') ? $querystring.parse(url.query) : null;
        self.body = null;
        self.req.on('error', function(err) {
            console.log(err); // eslint-disable-line no-console
            self.routeError(500);
        });
        var tmp = self.getContentType4L();
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
            self.routeError(400);
        }
    };
    self.prepareRequestJSON = function(next) {
        if (['POST', 'PUT'].indexOf(self.req.method).indexOf === -1) {
            return next();
        }
        var size = 0;
        var b = [];
        self.req.on('data', function(buffer) {
            size += buffer.length;
            if (size < self.route.maxSize) {
                b.push(buffer);
            }
        });
        self.req.once('end', function() {
            if (size >= self.route.maxSize) {
                b = undefined;
                return self.routeError(431);
            }
            try {
                var v = JSON.parse(Buffer.concat(b).toString('utf8'));
                if (Object.prototype.toString.call(v) !== '[object Object]') {
                    return self.routeError(400);
                }
                self.body = v;
                next();
            }
            catch (err) {
                self.routeError(400);
            }
        });
    };
    self.prepareRequestMULTIPART = function(next) {
        self.filepaths = [];
        var boundary = self.req.headers['content-type'].split(';')[1];
        if (!boundary) {
            return self.routeError(400);
        }
        boundary = boundary.slice(boundary.indexOf('=', 2) + 1); // –---------> indexOf('=', 2) FOR PERFORMANCE
        if (!boundary || ['POST', 'PUT'].indexOf(self.req.method) === -1) {
            return self.routeError(400);
        }
        var unlinkOnClose = true;
        self.req.once('close', function() {
            if (unlinkOnClose) {
                for (var i = 0, l = self.filepaths.length; i < l; i++) {
                    $fs.unlink(self.filepaths[i]);
                }
            }
        });
        var parser = new $MultipartParser();
        var size = 0;
        var maxSize = self.route.maxSize;
        var unclosedStreams = 0;
        parser.initWithBoundary(boundary);
        parser.onPartBegin = function() {
            console.log('PART_BEGIN');
        };
        parser.onHeaderValue = function(buffer, start, end) {
            var header = buffer.slice(start, end).toString('utf8');
            console.log('HEADER_VALUE: ' + header);
        };
        parser.onPartData = function(buffer, start, end) {
            var part = buffer.slice(start, end);
            console.log('PART_DATA: ' + part.toString('utf8'));
        };
        parser.onPartEnd = function() {
            console.log('PART_END');
        };
        parser.onEnd = function() {
            if (unclosedStreams > 0) {
                setImmediate(function() {
                    parser.onEnd();
                });
            }
            else {
                if (size >= maxSize) {
                    return self.routeError(431);
                }
                next();
            }
        };
        self.req.once('end', function() {
            if (size < maxSize) {
                unlinkOnClose = false;
            }
            parser.end();
        });
    };
    self.invokeRoute = function() {
        self.route.fn.apply(self, self.args);
    };
    self.stream = function(status, filepath) {
        self.res.statusCode = self.prepareStatus(status);
        var rs = $fs.createReadStream(filepath);
        rs.on('error', function(err) {
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
