// I CAN'T USE PUSHSTATE IN OFFLINE MODE:
// pushState() WORKS ONLY ON WEB SERVER: https://github.com/cferdinandi/smooth-scroll/issues/195
// ERROR: DOMException: Failed to execute 'pushState' on 'History': A history state object with URL 'file:///Users/tomas/Desktop/web-development/3rd-pathparser/users' cannot be created in a document with origin 'null'
// ROUTE2 WORKS SERVERLESS
// NICE ROUTES LIKE /user/new ARE NOT POSSIBLE (REQUIRES pushState() HTML5 FEATURE), AND ONLY HASH ROUTES WITH QUERY PARAMETERS CAN BE USED
// E.G. #faq~howto1?page=1
// E.G. #search~groupname-anchorid STRING AFTER ~ IS ANCHOR
// window.location KEEPS YOU AT THE SAME DOCUMENT IF YOU MODIFY ONLY THE HASH: https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
// NO SUPPORT FOR BASEURL - DEVELOPER MUST ALWAYS PROVIDE FULL URL
// SUPPORTS ONLY GET METHOD
// LOCAL STORAGE VS. COOKIE - https://stackoverflow.com/a/3220802/6135126
// REGEX TO MATCH ROUTE TAKEN FROM: https://github.com/garygreen/lightrouter
// DOMContentLoaded VS. load - https://stackoverflow.com/a/36096571/6135126
exports.$route2 = function(matcher, fn) {
    if (matcher !== undefined || fn !== undefined) {
        if (typeof(matcher) !== 'string' || (matcher[0] !== '#' && matcher !== '$error')) {
            throw new Error('api-matcher');
        }
        if (typeof(fn) !== 'function') {
            throw new Error('api-fn');
        }
        set();
    }
    else {
        load();
    }
    var cache = exports.$malloc('__ROUTE');
    var routes = cache('routes') || {};
    function set() {
        var v = parseRoute();
        if (matcher !== '$error') {
            routes[matcher] = v;
            cache('routes', routes);
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
    }
    function load() {
    }
};
function $Controller2() {
    this.error = null;
}
$Controller2.prototype = {
};
exports.$Controller2 = $Controller2;
