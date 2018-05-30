exports.SERVER = function(config) {
    var cache = exports.malloc('__SERVER');
    if (!config) {
        return cache('app') || null;
    }
    function Request() {
    }
    Request.prototype = {
        handle: function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            return res.end('hello');
        }
    };
    function App() {
        var http = require('http'); // eslint-disable-line global-require
        this.request = new Request();
        this.server = http.createServer(this.request.handle).listen(config.port, config.host);
    }
    cache('app', new App());
};
