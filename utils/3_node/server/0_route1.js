import $global from '../../global';
import $malloc from '../../0_internal/malloc';

export default function $route1(matcher, fn, flags) {
    if (typeof(matcher) !== 'string' || (matcher[0] !== '/' && ['#public', '#error'].indexOf(matcher) === -1)) {
        throw new Error('api-matcher');
    }
    if (!fn || typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    if (matcher === '#error') {
        if (flags !== undefined) {
            throw new Error('api-flags');
        }
    }
    else {
        if (typeof(flags) !== 'string') {
            throw new Error('api-flags');
        }
    }
    var cache = $malloc('__SERVER');
    var v = parseRoute();
    if (['#public', '#error'].indexOf(matcher) === -1) {
        var matchers = cache('matchers') || {};
        var routes = cache('routes') || {};
        matchers[v.matcher] = v.exp; // --------------------------------------> FOR FINDING ROUTE MATCHER BY URL
        routes[v.matcher + '?' + v.method + '?' + (v.xhr ? 'xhr?' : 'def?') + (v.mfd ? 'mfd' : 'def')] = v;
        cache('matchers', matchers);
        cache('routes', routes);
    }
    if (matcher === '#error') {
        return cache('errorRoute', v);
    }
    else if (matcher === '#public') {
        return cache('publicRoute', v);
    }
    function parseRoute() {
        var m;
        if (matcher !== '#error') {
            var exp = /^-m\s(GET|PUT|POST|DELETE)\s+-s\s(\d+)(GB|MB|kB)\s+-t\s(\d+)s(?:(?=\s+-xhr)(?:\s+-(xhr))|)(?:(?=\s+-mfd)(?:\s+-(mfd))|)$/; // https://regex101.com/r/Rq520Q/6/
            m = flags.match(exp);
            if (!m) {
                throw new Error('Route "flags" must follow "-m <Value> -s <Value><Unit> -t <Value><Unit> -xhr? -mfd?" syntax.');
            }
        }
        var o = {};
        if (['#public', '#error'].indexOf(matcher) === -1) {
            o.matcher = (matcher !== '/' && matcher[matcher.length - 1] === '/') ? matcher.slice(0, -1) : matcher;
            o.exp = new RegExp('^' + o.matcher.replace(/\[(\w+)\]/g, '(\\w+)') + '$');
        }
        else {
            o.matcher = matcher;
            o.exp = null;
        }
        o.fn = fn;
        if (matcher !== '#error') {
            o.method = m[1];
            o.maxSize = parseMaxSize(m[2], m[3]);
            o.maxTimeout = parseMaxTimeout(m[4]);
            o.xhr = !!m[5];
            o.mfd = !!m[6];
            return o;
        }
        else {
            o.method = null;
            o.maxSize = 0;
            o.maxTimeout = 0;
            o.xhr = false;
            o.mfd = false;
            return o;
        }
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
$global.$route1 = $route1;
