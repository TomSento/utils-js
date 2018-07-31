import $malloc from '../../0_internal/malloc';

export default function $Controller0() {
    var cache = $malloc('__ROUTE');
    this.statusCode = 200;
    this.error = null;
    this.args = [];
    this.query = null;
    this.run = function() {
        var v = this.findRoute();
        if (!v) {
            return this.routeError(404);
        }
        this.route = v;
        this.args = this.parseArgs();
        this.query = this.parseQuery();
        this.invokeRoute();
    };
    this.findRoute = function() {
        var routes = cache('routes') || {};
        var hash = this.parseURL().hash;
        var matcher = null;
        for (var k in routes) {
            if (routes.hasOwnProperty(k)) {
                if (routes[k].exp.test(hash)) {
                    matcher = k;
                }
            }
        }
        return matcher ? (routes[matcher] || null) : null;
    };
    this.parseURL = function() {
        var tmp = location.href.split(location.origin + location.pathname)[1] || '';
        var exp = /^(#[^?$]*|)(?:(?=\?)(\?[^$]*)|)(?:(?=\$)\$(.*)|)$/; // https://regex101.com/r/w4nq0U/7
        var m = tmp.match(exp) || [];
        return {
            hash: !m[1] ? '#' : m[1],
            query: m[2] || null
        };
    };
    this.parseArgs = function() {
        var m = this.parseURL().hash.match(this.route.exp);
        return (m || []).length > 1 ? m.slice(1) : [];
    };
    this.parseQuery = function() {
        var str = this.parseURL().query;
        if (!str) {
            return null;
        }
        str = str.replace(/\+/g, ' '); // ------------------------------------> "decodeURIComponent()" DOES NOT DECODE SPACES ENCODED AS "+"
        var exp = /[?&]([^=]+)=([^&]*)/g;
        var o = {};
        var m = null;
        while (m = exp.exec(str)) {
            var k = m[1] ? decodeURIComponent(m[1]) : '';
            var v = m[2] ? decodeURIComponent(m[2]) : '';
            if (k) {
                o[k] = v;
            }
        }
        return o;
    };
    this.invokeRoute = function() {
        this.route.fn.apply(this, this.args);
    };
}
$Controller0.prototype = {
    routeError: function(statusCode, err) {
        var v = parseInt(statusCode);
        this.statusCode = (isNaN(v) || v < 400 || v >= 600) ? 500 : v;
        if (err) {
            this.error = err;
        }
        var cache = $malloc('__ROUTE');
        this.route = cache('errorRoute');
        this.invokeRoute();
    }
};
window.$Controller0 = $Controller0;
