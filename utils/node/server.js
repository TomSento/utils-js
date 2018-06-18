exports.SETROUTE1 = function(route, fn, flags) {
    if (typeof(route) !== 'string' || (route[0] !== '/' && ['#public', '#error'].indexOf(route) === -1)) {
        throw new Error('api-route');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    if (typeof(flags) !== 'string') {
        throw new Error('api-flags');
    }
    var cache = exports.malloc('__SERVER');
    var routes = cache('routes') || [];
    var v = parseRoute();
    var replaced = false;
    for (var i = 0, l = routes.length; i < l; i++) {
        if (routes[i].route === v.route) {
            routes[i] = v;
            replaced = true;
        }
    }
    if (!replaced) {
        routes.push(v);
    }
    cache('routes', routes);
    if (route === '#error') {
        return cache('errorRoute', v);
    }
    else if (route === '#public') {
        return cache('publicRoute', v);
    }
    function parseRoute() {
        var exp = /^-s\s(\d+)(GB|MB|kB)\s+-t\s(\d+)s(?:(?=\s+-xhr)(?:\s+-(xhr))|)(?:(?=\s+-mfd)(?:\s+-(mfd))|)$/; // https://regex101.com/r/Rq520Q/4/
        var m = flags.match(exp);
        if (!m) {
            throw new Error('Route "flags" must follow "-s <Value><Unit> -t <Value><Unit> -xhr? -mfd?" syntax.');
        }
        return {
            route: route,
            exp: new RegExp('^' + route.replace(/\[(\w+)\]/g, '(\\w+)') + '$'),
            fn: fn,
            maxSize: parseMaxSize(m[1], m[2]),
            maxTimeout: parseMaxTimeout(m[3]),
            xhr: !!m[4],
            mfd: !!m[5]
        };
    }
    function parseMaxSize(v, unit) {
        v = parseInt(v);
        if (['#public', '#error'].indexOf(route) >= 0) {
            if (isNaN(v) || v !== 0) {
                throw new Error('Expected "-s 0' + unit + '".');
            }
        }
        else {
            if (isNaN(v) || v < 0) {
                throw new Error('invalidMaxSize');
            }
        }
        var exponents = {
            'kB': 3,
            'MB': 6,
            'GB': 9
        };
        return v * Math.pow(10, exponents[unit]);
    }
    function parseMaxTimeout(v) {
        v = parseInt(v);
        if (isNaN(v) || v <= 0) {
            throw new Error('invalidMaxTimeout');
        }
        return v * 1000;
    }
};
function Controller1(req, res) {
    var cache = exports.malloc('__SERVER');
    var self = this;
    self.req = req;
    self.res = res;
    self.error = null;
    self.run = function() {
        self.prepareRoute(function(status) {
            self.res.statusCode = status;
            self.monitorResponseChanges();
            if (['#public', '#error'].indexOf(self.route.route) >= 0) {
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
        var pathname = self.toPathname(self.req.url);
        var ext = require('path').extname(pathname);
        if (ext && cache('app').config.staticAccepts.indexOf(ext) >= 0) { // -> PROBABLY PUBLIC FILE
            var filepath = require('path').resolve(cache('app').config.publicDirectory, ('.' + pathname));
            require('fs').stat(filepath, function(err) {
                if (err) {
                    if (!cache('errorRoute')) {
                        throw new Error('missingErrorRoute');
                    }
                    self.route = cache('errorRoute');
                    return next(err.code === 'ENOENT' ? 404 : 500);
                }
                else { // ----------------------------------------------------> PUBLIC FILE EXISTS IN FS
                    self.route = cache('publicRoute');
                    return next(200);
                }
            });
        }
        else {
            self.route = cache('errorRoute');
            return next(404);
        }
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
            if (!responded && self.route.route !== '#error' && execTime < self.route.maxTimeout) {
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
                    if (self.route.route !== '#error' && execTime >= self.route.maxTimeout) {
                        return self.routeError(408);
                    }
                    fnNative.apply(self.res, arguments);
                }
            };
        }
        self.res.on('pipe', function(source) {
            if (self.route.route !== '#error' && execTime >= self.route.maxTimeout) {
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
    self.findRoute = function() {
        var routes = cache('routes');
        if ((routes || []).length === 0) {
            throw new Error('missingRoutes');
        }
        for (var i = 0, l = routes.length; i < l; i++) {
            var v = routes[i];
            if (v && v.exp.test(self.toPathname(self.req.url))) {
                return v;
            }
        }
        return null;
    };
    self.toPathname = function(v) {
        return v.split(/\?+/)[0] || '/';
    };
    self.prepareRequest = function(next) {
        var url = require('url').parse(self.req.url);
        var m = (url.pathname || '').match(self.route.exp);
        self.args = (m || []).length > 1 ? m.slice(1) : [];
        self.query = (url.query && typeof(url.query) === 'string') ? require('querystring').parse(url.query) : null;
        self.body = null;
        self.req.on('error', function(err) {
            exports.log(err);
            self.routeError(500);
        });
        var contentType = self.req.headers['content-type'];
        var tmp = contentType || '';
        var i = tmp.lastIndexOf(';');
        if (i >= 0) {
            tmp = tmp.slice(0, i);
        }
        tmp = tmp.slice(-4);
        if (tmp === 'json') {
            self.prepareRequestJSON(next);
        }
        else if (tmp === 'data') {
            self.prepareRequestMULTIPART(next);
        }
        else if (contentType === undefined) {
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
                exports.log(err);
                self.routeError(400);
            }
        });
    };
    self.prepareRequestMULTIPART = function(next) {
        self.filepaths = [];
        var boundary = self.req.headers['content-type'].split(';')[1];
        if (!boundary || ['POST', 'PUT'].indexOf(self.req.method) === -1) {
            return self.routeError(400);
        }
        boundary = boundary.slice(boundary.indexOf('=', 2) + 1); // –---------> indexOf('=', 2) FOR PERFORMANCE
        var unlinkOnClose = true;
        var size = 0;
        var maxSize = 50000000; // -------------------------------------------> 50MB
        self.req.once('close', function() {
            for (var i = 0, l = self.filepaths.length; i < l; i++) {
                if (unlinkOnClose) {
                    require('fs').unlink(self.filepaths[i]);
                }
            }
        });
        // var data;
        var unclosedStreams = 0;
        var parser = {};
        parser.initWithBoundary(boundary);
        parser.onPartBegin = function() {
            console.log('PART_BEGIN');
        };
        parser.onHeaderValue = function(buffer, start, end) {
            var header = buffer.slice(start, end).toString('utf8');
            console.log('HEADER_VALUE: ' + header);
        };
        parser.onPartData = function(buffer, start, end) {
            var data = buffer.slice(start, end);
            console.log('PART_DATA: ' + data.toString('utf8'));
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
        self.route.fn.apply(self, self.args);
    };
    self.stream = function(status, filepath) {
        self.res.statusCode = self.prepareStatus(status);
        var rs = require('fs').createReadStream(filepath);
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
Controller1.prototype = {
    routeError: function(status, err) {
        var v = parseInt(status);
        this.res.statusCode = (isNaN(v) || v < 400 || v >= 600) ? 500 : v;
        this.res.statusMessage = null;
        this.res.sendDate = true;
        if (err) {
            this.error = err;
        }
        var cache = exports.malloc('__SERVER');
        this.route = cache('errorRoute');
        this.invokeRoute();
    },
    json: function(status, a) {
        var self = this;
        self.res.writeHead(self.prepareStatus(status), {
            'Content-Type': 'application/json'
        });
        self.res.end(JSON.stringify(a, null, '    '));
    },
    html: function(status, str) {
        var self = this;
        self.res.writeHead(self.prepareStatus(status), {
            'Content-Type': 'text/html'
        });
        self.res.end('' + str);
    },
    plain: function(status, str) {
        var self = this;
        self.res.writeHead(self.prepareStatus(status), {
            'Content-Type': 'text/plain'
        });
        self.res.end('' + str);
    }
};
exports.Controller1 = Controller1;
exports.SERVER = function(env, packageJSON, config) {
    var cache = exports.malloc('__SERVER');
    if (!config) {
        return cache('app') || null;
    }
    function App() {
        this.js = [];
        this.configure = function() {
            if (['DEBUG', 'TEST', 'RELEASE'].indexOf(env) === -1) {
                throw new Error('api-env');
            }
            this.env = env;
            this[env] = true;
            if (typeof(config.https) !== 'boolean') {
                throw new Error('api-config.https');
            }
            if (!config.host || typeof(config.host) !== 'string') {
                throw new Error('api-config.host');
            }
            if (!Number.isInteger(config.port) || config.port <= 0) {
                throw new Error('api-config.port');
            }
            var tmp = config.publicDirectory === undefined ? './public' : config.publicDirectory;
            if (!tmp || typeof(tmp) !== 'string') {
                throw new Error('api-config.publicDirectory');
            }
            config.publicDirectory = tmp;
            config.tmpDirectory = './tmp';
            tmp = config.staticAccepts === undefined
                ? ['.jpg', '.png', '.gif', '.ico', '.js', '.coffee', '.css', '.txt', '.xml', '.woff', '.woff2', '.otf', '.ttf', '.eot', '.svg', '.zip', '.rar', '.pdf', '.docx', '.xlsx', '.doc', '.xls', '.html', '.htm', '.appcache', '.map', '.ogg', '.mp4', '.mp3', '.webp', '.webm', '.swf', '.package', '.json', '.md']
                : config.staticAccepts;
            if (!Array.isArray(tmp)) {
                throw new Error('api-config.staticAccepts');
            }
            config.staticAccepts = tmp;
            this.config = config;
        };
        this.configure();
        this.handleRequest = function(req, res) {
            var controller = new exports.Controller1(req, res);
            controller.run();
        };
    }
    App.prototype = {
        pushJS: function(filepath) {
            this.js.push(filepath);
        },
        loadJS: function(next) {
            var self = this;
            (function loop(i) {
                var filepath = self.js[i];
                if (!filepath) {
                    return next && next();
                }
                require.cache[filepath] = undefined;
                var file = require(filepath);
                if (typeof(file.init) !== 'function') {
                    throw new Error('Missing "init()" in "' + filepath + '".');
                }
                file.init(function() {
                    loop(++i);
                });
            }(0));
        },
        create: function() {
            var self = this;
            if (self.config.https) {
                var options = {
                    key: self.config.key,
                    cert: self.config.cert
                };
                self.server = require('https').createServer(options, self.handleRequest).listen(self.config.port, self.config.host);
            }
            else {
                self.server = require('http').createServer(self.handleRequest).listen(self.config.port, self.config.host);
            }
            var socketCounter = 0;
            self.socket = {};
            self.server.on('connection', function(socket) {
                var k = socketCounter++;
                self.socket[k] = socket;
                socket.once('close', function() {
                    delete self.socket[k];
                });
            });
        },
        createLog: function() {
            /* eslint-disable no-console */
            console.clear();
            console.log('@pid ' + process.pid + ' (' + [
                new Date().toGMTString(),
                'Node.js: ' + process.version,
                'OS: ' + require('os').platform() + ' ' + require('os').release()
            ].join('; ') + ')');
            console.log('');
            console.log('env     : ' + env);
            console.log('name    : ' + packageJSON.name || '-');
            console.log('version : ' + packageJSON.version || '-');
            console.log('author  : ' + packageJSON.author || '-');
            console.log('');
            console.log('http://' + this.config.host + ':' + this.config.port + '/\n');
            /* eslint-enable no-console */
        },
        destroy: function() {
            this.server.close();
            for (var k in this.socket) {
                if (this.socket.hasOwnProperty(k)) {
                    this.socket[k].destroy();
                }
            }
        }
    };
    exports.SETROUTE1('#public', function() { // -----------------------------> LIKE CONTROLLER
        var pathname = this.toPathname(this.req.url);
        var filepath = require('path').resolve(config.publicDirectory, ('.' + pathname));
        this.stream(200, filepath);
    }, '-s 0kB -t 20s');
    var app = new App();
    cache('app', app);
    return app;
};
