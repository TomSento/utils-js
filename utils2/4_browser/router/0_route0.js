import $malloc from '../../0_internal/malloc';
import $Controller0 from './1_Controller0';

// FRONTEND ROUTER
// NO PUSHSTATE - DOES NOT WORK OFFLINE - https://github.com/cferdinandi/smooth-scroll/issues/195
// NO BASEURL SUPPORT
// SUPPORTS ONLY GET METHOD
// ROUTES LIKE "/user/new" ARE NOT POSSIBLE - "pushState()" REQUIRED => ONLY HASH ROUTES SUPPORTED
// #faq?p=1$one
//   |   |   |
// hash  |   |
//     query |
//         anchor
// "DOMContentLoaded" VS. "load" - https://stackoverflow.com/a/36096571/6135126
// MATCH ROUTE EXP: https://github.com/garygreen/lightrouter
export default function $route0(matcher, fn) {
    if (typeof(matcher) !== 'string' || (matcher[0] !== '#' && matcher !== '$error')) {
        throw new Error('api-matcher');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    var cache = $malloc('__ROUTE');
    var routes = cache('routes') || {};
    var v = parseRoute();
    var url;
    if (matcher !== '$error') {
        routes[matcher] = v;
        cache('routes', routes);
        if (routesLength() === 1) {
            document.addEventListener('DOMContentLoaded', function() {
                new $Controller0().run();
            });
            url = [null, parseURL()];
            window.onhashchange = function() {
                url = [url[1], parseURL()];
                onHashChange();
            };
        }
    }
    else {
        cache('errorRoute', v);
    }
    function parseRoute() {
        var o = {
            matcher: matcher
        };
        if (matcher !== '$error') {
            o.exp = new RegExp('^' + matcher.replace(/\[(\w+)\]/g, '(\\w+)') + '$');
        }
        else {
            o.exp = null;
        }
        o.fn = fn;
        return o;
    }
    function routesLength() {
        var l = 0;
        for (var k in routes) {
            if (routes.hasOwnProperty(k)) {
                l++;
            }
        }
        return l;
    }
    function parseURL() {
        var tmp = location.href.split(location.origin + location.pathname)[1] || '';
        var exp = /^(#[^?$]*|)(?:(?=\?)(\?[^$]*)|)(?:(?=\$)\$(.*)|)$/; // https://regex101.com/r/w4nq0U/7
        var m = tmp.match(exp) || [];
        return {
            location: (!m[1] || m[1] === '#') ? '' : m[1],
            anchor: m[3]
        };
    }
    function onHashChange() {
        if (url[0].location === url[1].location) {
            if (!url[1].anchor) {
                location.reload();
            }
            else {
                scroll(url[1].anchor);
            }
        }
        else {
            location.reload();
        }
    }
    function scroll(elementID) {
        var el = document.getElementById(elementID);
        if (el) {
            el.scrollIntoView();
        }
    }
}
window.$route0 = $route0;
