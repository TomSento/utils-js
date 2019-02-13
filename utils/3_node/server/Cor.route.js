if (!global.$router) global.$router = { matchers: {}, routes: {} };

export default function route(/* ...args */) {
    var matcher;
    var fn;
    var middlewares = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        if (i === 0) {
            matcher = arguments[0];
        }
        else if (i === l - 1) {
            fn = arguments[l - 1];
        }
        else {
            middlewares.push(arguments[i]);
        }
    }
    if (!matcher || typeof(matcher) !== 'string') {
        throw new Error('api-matcher');
    }
    if (!fn || typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    var v = parseRoute();
    global.$router.matchers[v.matcher] = v.exp; // ————————————————————————————— FOR FINDING ROUTE MATCHER BY URL
    global.$router.routes[v.matcher + '?' + v.method + '?' + (v.mfd ? 'mfd' : 'def')] = v;
    function parseRoute() {
        var m;
        var exp = /^([\w-/[\]@]+)\s+-m\s(GET|PUT|POST|DELETE)\s+-s\s(\d+)(GB|MB|kB)\s+-t\s(\d+)s(?:(?=\s+-mfd)(?:\s+-(mfd))|)$/; // https://regex101.com/r/Rq520Q/17
        m = matcher.match(exp);
        if (!m) {
            throw new Error('Route "matcher" must follow "<Url> -m <Value> -s <Value><Unit> -t <Value><Unit> -mfd?" syntax.');
        }
        var tmp = m[1];
        tmp = (tmp !== '/' && tmp[tmp.length - 1] === '/') ? tmp.slice(0, -1) : tmp;
        return {
            matcher: tmp,
            exp: new RegExp('^' + tmp.replace(/\[(\w+)\]/g, '([-\\w.@]+)') + '$'),
            middlewares: middlewares,
            fn: fn,
            method: m[2],
            maxSize: parseMaxSize(m[3], m[4]),
            maxTimeout: parseMaxTimeout(m[5]),
            mfd: !!m[6]
        };
    }
    function parseMaxSize(v, unit) {
        v = parseInt(v);
        if (isNaN(v) || v < 0) {
            throw new Error('invalidMaxSize');
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
}
if (!global.Cor) global.Cor = {};
global.Cor.route = route;
