exports.SETROUTE1 = function(route, fn) {
    if (typeof(route) !== 'string' || (route[0] !== '/' && ['#public', '#error'].indexOf(route) === -1)) {
        throw new Error('api-route');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    var cache = exports.malloc('__SERVER');
    var routes = cache('routes') || [];
    var v = composeRoute(route, fn);
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
    function composeRoute() {
        return {
            route: route,
            exp: new RegExp('^' + route.replace(/{(\w+)}/g, '(\\w+)') + '$'),
            fn: fn
        };
    }
};
function Controller1(req, res) {
    var cache = exports.malloc('__SERVER');
    var self = this;
    self.req = req;
    self.res = res;
    self.responseSended = false;
    self.execTime = 0;
    self.restartInterval = function() {
        self.execTime = 0;
        self.interval = setInterval(function() {
            self.execTime += 1000;
            if (self.execTime >= cache('app').config.maxRouteTimeout) {
                clearInterval(self.interval);
                return self.routeError(408);
            }
        }, 1000);
    };
    self.prepare = function(next) {
        self.status = 200;
        self.error = null;
        self.route = self.findRoute();
        if (self.route) {
            self.prepareRequest(function() {
                next(self);
            });
        }
        else {
            var pathname = self.toPathname(self.req.url);
            var ext = require('path').extname(pathname);
            if (ext && cache('app').config.staticAccepts.indexOf(ext) >= 0) { // PROBABLY PUBLIC FILE
                var filepath = require('path').resolve(cache('app').config.publicDirectory, ('.' + pathname));
                require('fs').stat(filepath, function(err) {
                    if (err) {
                        if (!cache('errorRoute')) {
                            throw new Error('missingErrorRoute');
                        }
                        self.status = err.code === 'ENOENT' ? 404 : 500;
                        self.route = cache('errorRoute');
                        return next(self);
                    }
                    else { // ------------------------------------------------> PUBLIC FILE EXISTS IN FS
                        self.route = cache('publicRoute');
                        return next(self);
                    }
                });
            }
            else {
                self.status = 404;
                self.route = cache('errorRoute');
                return next(self);
            }
        }
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
        var typ = self.req.headers['content-type'];
        if (typ === 'application/json') {
            self.prepareRequestJSON(next);
        }
        else if ([undefined, 'text/html', 'text/plain'].indexOf(typ) >= 0) {
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
        var b = [];
        self.req.on('data', function(chunk) {
            b.push(chunk);
        });
        self.req.on('end', function() {
            try {
                var v = JSON.parse(Buffer.concat(b).toString());
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
    self.invokeRoute = function() {
        self.restartInterval();
        self.route.fn.apply(self, self.args);
    };
    self.stream = function(status, filepath) {
        self.restrictionResponse(function() {
            self.res.statusCode = self.prepareStatus(status);
            var rs = require('fs').createReadStream(filepath);
            rs.on('error', function(err) {
                return self.routeError(404, err);
            });
            rs.pipe(self.res);
        });
    };
    self.restrictionResponse = function(next) {
        if (!self.responseSended) {
            if (self.execTime < cache('app').config.maxRouteTimeout) { // ----> ELSE "errorRoute" IS CALLED FROM INSIDE "interval"
                clearInterval(self.interval);
                self.responseSended = true;
                next();
            }
        }
    };
    self.prepareStatus = function(status) { // -------------------------------> https://httpstatuses.com/
        var v = parseInt(status);
        return (isNaN(v) || v < 100 || v >= 600) ? 200 : v;
    };
}
Controller1.prototype = {
    routeError: function(status, err) {
        status = parseInt(status);
        this.status = (isNaN(status) || status < 400 || status >= 600) ? 500 : status;
        if (err) {
            this.error = err;
        }
        var cache = exports.malloc('__SERVER');
        this.route = cache('errorRoute');
        this.invokeRoute();
    },
    json: function(status, a) {
        var self = this;
        self.restrictionResponse(function() {
            self.res.writeHead(self.prepareStatus(status), {
                'Content-Type': 'application/json'
            });
            self.res.end(JSON.stringify(a, null, '    '));
        });
    },
    html: function(status, str) {
        var self = this;
        self.restrictionResponse(function() {
            self.res.writeHead(self.prepareStatus(status), {
                'Content-Type': 'text/html'
            });
            self.res.end('' + str);
        });
    },
    plain: function(status, str) {
        var self = this;
        self.restrictionResponse(function() {
            self.res.writeHead(self.prepareStatus(status), {
                'Content-Type': 'text/plain'
            });
            self.res.end('' + str);
        });
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
            var tmp = config.maxRouteTimeout === undefined ? 20000 : config.maxRouteTimeout;
            if (!Number.isInteger(tmp) || tmp < 1000) {
                throw new Error('api-config.maxRouteTimeout');
            }
            config.maxRouteTimeout = tmp;
            tmp = config.publicDirectory === undefined ? './public' : config.publicDirectory;
            if (!tmp || typeof(tmp) !== 'string') {
                throw new Error('api-config.publicDirectory');
            }
            config.publicDirectory = tmp;
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
            controller.prepare(function(preparedController) {
                preparedController.invokeRoute();
            });
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
    });
    var app = new App();
    cache('app', app);
    return app;
};
