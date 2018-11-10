import * as $path from 'path';
import * as $fs from 'fs';
import * as $https from 'https';
import * as $http from 'http';
import * as $os from 'os';

import $handleRequest from './handleRequest';

function Server(mode, packageJSON, config, routeError) {
    if (['DEBUG', 'TEST', 'RELEASE'].indexOf(mode) === -1) {
        throw new Error('api-mode');
    }
    if (Object.prototype.toString.call(packageJSON) !== '[object Object]') {
        throw new Error('api-packageJSON');
    }
    if (Object.prototype.toString.call(config) !== '[object Object]') {
        throw new Error('api-config');
    }
    if (!Number.isInteger(config.port) || config.port <= 0) {
        throw new Error('api-config.port');
    }
    if (!config.host || typeof(config.host) !== 'string') {
        throw new Error('api-config.host');
    }
    if (typeof(config.https) !== 'boolean') {
        throw new Error('api-config.https');
    }
    if (!routeError || typeof(routeError) !== 'function') {
        throw new Error('api-routeError');
    }
    this.mode = mode;
    this.packageJSON = packageJSON;
    this.config = config;
    this.js = [];
    this.handleRequest = function(req, res) {
        $handleRequest(req, res, routeError);
    };
    this.removeTmpFiles = function() {
        var dir = process.cwd() + $path.sep + 'tmp';
        var filenames = $fs.readdirSync(dir);
        for (var i = 0, l = filenames.length; i < l; i++) {
            var path = dir + $path.sep + filenames[i];
            $fs.unlinkSync(path);
        }
    };
}
Server.prototype = {
    link: function(filepath) {
        this.js.push(filepath);
    },
    load: function(next) {
        var self = this;
        (function loop(i) {
            var filepath = self.js[i];
            if (!filepath) {
                return next && next();
            }
            require.cache[filepath] = undefined;
            var file = require(filepath);
            if (typeof(file.load) !== 'function') {
                throw new Error('Missing "load()" in "' + filepath + '".');
            }
            file.load(function() {
                loop(++i);
            });
        }(0));
    },
    create: function() {
        var self = this;
        self.removeTmpFiles();
        if (self.config.https) {
            var options = {
                key: self.config.key,
                cert: self.config.cert
            };
            self.server = $https.createServer(options, self.handleRequest).listen(self.config.port, self.config.host);
        }
        else {
            self.server = $http.createServer(self.handleRequest).listen(self.config.port, self.config.host);
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
        return self.server;
    },
    log: function(filepath) {
        /* eslint-disable no-console */
        console.clear();
        if (filepath) {
            var d = new Date();
            var uid = [('' + d.getDate()).padStart(3, '0'), ('' + d.getHours()).padStart(2, '0'), ('' + d.getMinutes()).padStart(2, '0'), ('' + d.getSeconds()).padStart(2, '0')].join('-');
            return console.log('@' + uid + ' ' + filepath);
        }
        console.log('@pid ' + process.pid + ' (' + [
            new Date().toGMTString(),
            'Node.js: ' + process.version,
            'OS: ' + $os.platform() + ' ' + $os.release()
        ].join('; ') + ')');
        console.log('');
        console.log('mode    : ' + this.mode);
        console.log('name    : ' + this.packageJSON.name || '-');
        console.log('version : ' + this.packageJSON.version || '-');
        console.log('author  : ' + this.packageJSON.author || '-');
        console.log('');
        console.log('http://' + this.config.host + ':' + this.config.port + '/\n');
        /* eslint-enable no-console */
    },
    destroy: function() {
        if (this.server) {
            this.server.close();
        }
        if (this.socket) {
            for (var k in this.socket) {
                if (this.socket.hasOwnProperty(k)) {
                    this.socket[k].destroy();
                }
            }
        }
    }
};
$export('<Server>', Server);
