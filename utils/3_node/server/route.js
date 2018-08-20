import $malloc from '../../0_internal/malloc';

function route(matcher, fn) {
    if (!matcher || typeof(matcher) !== 'string') {
        throw new Error('api-matcher');
    }
    if (!fn || typeof(fn) !== 'function') {
        throw new Error('api-fn');
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
        var exp = /^([\w-/[\]@]+)\s+-m\s(GET|PUT|POST|DELETE)\s+-s\s(\d+)(GB|MB|kB)\s+-t\s(\d+)s(?:(?=\s+-xhr)(?:\s+-(xhr))|)(?:(?=\s+-mfd)(?:\s+-(mfd))|)$/; // https://regex101.com/r/Rq520Q/15
        m = matcher.match(exp);
        if (!m) {
            throw new Error('Route "matcher" must follow "<Url> -m <Value> -s <Value><Unit> -t <Value><Unit> -xhr? -mfd?" syntax.');
        }
        var tmp = m[1];
        tmp = (tmp !== '/' && tmp[tmp.length - 1] === '/') ? tmp.slice(0, -1) : tmp;
        return {
            matcher: tmp,
            exp: new RegExp('^' + tmp.replace(/\[(\w+)\]/g, '(\\w+)') + '$'),
            fn: fn,
            method: m[2],
            maxSize: parseMaxSize(m[3], m[4]),
            maxTimeout: parseMaxTimeout(m[5]),
            xhr: !!m[6],
            mfd: !!m[7]
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
