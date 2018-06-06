exports.SETROUTE1 = function(route, fn) {
    if (typeof(route) !== 'string' || (route[0] !== '/' && ['#public', '#error'].indexOf(route) === -1)) {
        throw new Error('invalidParameter');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('invalidParameter');
    }
    var cache = exports.malloc('__SERVER');
    var routes = cache('routes') || [];
    var v = composeRoute(route, fn);
    routes.push(v);
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
    self.args = [];
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
            var m = self.toPathname(self.req.url).match(self.route.exp);
            if ((m || []).length > 1) {
                self.args = m.slice(1);
            }
            return next(self);
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
            throw new Error('missingRoute');
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
exports.SERVER = function(config) {
    var cache = exports.malloc('__SERVER');
    if (!config) {
        return cache('app') || null;
    }
    function App() {
        this.configure = function() {
            var tmp = parseInt(config.maxRouteTimeout);
            config.maxRouteTimeout = (isNaN(tmp) || tmp < 1000) ? 20000 : tmp;
            config.publicDirectory = require('path').resolve(config.publicDirectory || './public');
            config.staticAccepts = Array.isArray(config.staticAccepts)
                ? config.staticAccepts
                : ['.jpg', '.png', '.gif', '.ico', '.js', '.coffee', '.css', '.txt', '.xml', '.woff', '.woff2', '.otf', '.ttf', '.eot', '.svg', '.zip', '.rar', '.pdf', '.docx', '.xlsx', '.doc', '.xls', '.html', '.htm', '.appcache', '.map', '.ogg', '.mp4', '.mp3', '.webp', '.webm', '.swf', '.package', '.json', '.md'];
            this.config = config;
        };
        this.configure();
        this.handleRequest = function(req, res) {
            var controller = new exports.Controller1(req, res);
            controller.prepare(function(preparedController) {
                preparedController.invokeRoute();
            });
        };
        this.server = require('http').createServer(this.handleRequest).listen(config.port, config.host);
    }
    exports.SETROUTE1('#public', function() { // -----------------------------> LIKE CONTROLLER
        var pathname = this.toPathname(this.req.url);
        var filepath = require('path').resolve(config.publicDirectory, ('.' + pathname));
        this.stream(200, filepath);
    });
    cache('app', new App());
};
