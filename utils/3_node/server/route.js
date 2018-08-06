import $malloc from '../../0_internal/malloc';

function route(matcher, fn, flags) {
    if (typeof(matcher) !== 'string' || matcher[0] !== '/') {
        throw new Error('api-matcher');
    }
    if (!fn || typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    if (!flags || typeof(flags) !== 'string') {
        throw new Error('api-flags');
    }
    var cache = $malloc('__SERVER');
    var v = parseRoute();
    var matchers = cache('matchers') || {};
    var routes = cache('routes') || {};
    matchers[v.matcher] = v.exp; // ------------------------------------------> FOR FINDING ROUTE MATCHER BY URL
    routes[v.matcher + '?' + v.method + '?' + (v.xhr ? 'xhr?' : 'def?') + (v.mfd ? 'mfd' : 'def')] = v;
    cache('matchers', matchers);
    cache('routes', routes);
    function parseRoute() {
        var m;
        var exp = /^-m\s(GET|PUT|POST|DELETE)\s+-s\s(\d+)(GB|MB|kB)\s+-t\s(\d+)s(?:(?=\s+-xhr)(?:\s+-(xhr))|)(?:(?=\s+-mfd)(?:\s+-(mfd))|)$/; // https://regex101.com/r/Rq520Q/6/
        m = flags.match(exp);
        if (!m) {
            throw new Error('Route "flags" must follow "-m <Value> -s <Value><Unit> -t <Value><Unit> -xhr? -mfd?" syntax.');
        }
        var tmp = (matcher !== '/' && matcher[matcher.length - 1] === '/') ? matcher.slice(0, -1) : matcher;
        return {
            matcher: tmp,
            exp: new RegExp('^' + tmp.replace(/\[(\w+)\]/g, '(\\w+)') + '$'),
            fn: fn,
            method: m[1],
            maxSize: parseMaxSize(m[2], m[3]),
            maxTimeout: parseMaxTimeout(m[4]),
            xhr: !!m[5],
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
$export('<route>', route);
