// I CAN'T USE PUSHSTATE IN OFFLINE MODE:
// pushState() WORKS ONLY ON WEB SERVER: https://github.com/cferdinandi/smooth-scroll/issues/195
// ERROR: DOMException: Failed to execute 'pushState' on 'History': A history state object with URL 'file:///Users/tomas/Desktop/web-development/3rd-pathparser/users' cannot be created in a document with origin 'null'
// ROUTE0 WORKS SERVERLESS
// NICE ROUTES LIKE /user/new ARE NOT POSSIBLE (REQUIRES pushState() HTML5 FEATURE), AND ONLY HASH ROUTES WITH QUERY PARAMETERS CAN BE USED
// E.G. #faq~howto1?page=1
// E.G. #search~groupname-anchorid STRING AFTER ~ IS ANCHOR
// window.location KEEPS YOU AT THE SAME DOCUMENT ONLY IF YOU MODIFY ONLY THE HASH: https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
// NO SUPPORT FOR BASEURL - DEVELOPER MUST ALWAYS PROVIDE FULL URL
// SUPPORTS ONLY GET METHOD
// LOCAL STORAGE VS. COOKIE - https://stackoverflow.com/a/3220802/6135126
// REGEX TO MATCH ROUTE TAKEN FROM: https://github.com/garygreen/lightrouter
// DOMContentLoaded VS. load - https://stackoverflow.com/a/36096571/6135126
exports.SETROUTE0 = function(route, fn) {
    var cache = exports.malloc('_ROUTE0');
    if (!route || typeof(route) !== 'string' || route[0] !== '#') {
        throw new Error('invalidParameter');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('invalidParameter');
    }
    var routes = cache('routes');
    if (!routes) {
        routes = [];
        domReady(function() { // WHEN ALL ROUTES ARE SETTED
            exports.ROUTE0();
        });
    }
    routes.push(composeRoute(route, fn));
    if (!isErrorRoute(route)) {
        routes.push(composeRoute(route + '~{anchor}', fn));
    }
    cache('routes', routes);
    function composeRoute(route, fn) {
        return {
            route: route,
            exp: new RegExp('^' + route.replace(/\//g, '\\/').replace(/{(\w+)}/g, '(\\w+)') + '$'),
            hasAnchor: route.split('~').length === 2,
            fn: fn
        };
    }
    function isErrorRoute(v) {
        return /^#(400|404|408|500)/.test(v);
    }
    function domReady(fn) {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
exports.ROUTE0 = function(url, err) {
    var cache = exports.malloc('_ROUTE0');
    var routes = cache('routes');
    if (!Array.isArray(routes) || routes.length === 0) {
        throw new Error('missingRoute');
    }
    if (url !== undefined && typeof(url) !== 'string') {
        throw new Error('invalidParameter');
    }
    if (typeof(url) === 'string' && url[0] !== '#') {
        throw new Error('invalidParameter');
    }
    if (!url && err) {
        throw new Error('invalidParameter');
    }
    var hash = [null, locationHash()];
    if (!window.onhashchange) {
        window.onhashchange = function() {
            hash[0] = hash[1];
            hash[1] = locationHash();
            onHashChange(hash);
        };
    }
    if (!url && !err) { // WHEN PAGE IS LOADED - REGISTERED IN SETROUTE0
        err = localStorage['ROUTE0_ERR'];
        err = isErrorRoute(location.hash)
            ? new exports.ErrorBuilder(err ? JSON.parse(err) : null)
            : null;
        var search = location.hash.split(/\?+/)[0] || '#';
        var query = getQueryObj(location.hash);
        return findAndInvokeRoute(routes, search, query, err);
    }
    else {
        if (isErrorRoute(url)) {
            localStorage['ROUTE0_ERR'] = err ? JSON.stringify(new exports.ErrorBuilder(err)) : '';
            location.replace(url); // FORGET HISTORY
        }
        else {
            location.assign(url === '#' ? '' : url); // REMEMBER HISTORY
        }
    }
    function findAndInvokeRoute(routes, search, query, err) {
        var is = false;
        for (var i = 0; i < routes.length; i++) {
            var v = routes[i];
            if (v.exp.test(search)) {
                is = true;
                var args = search.match(v.exp).slice(1);
                var anchor = v.hasAnchor ? (args.pop() || null) : null; // FORCE TO NULL IF URL IS #users~
                var controller = new exports.Controller0(v.route, query, args, anchor, err);
                return invokeRoute(v.fn, controller, args);
            }
        }
        if (!is) {
            exports.ROUTE0('#404');
        }
    }
    function invokeRoute(fn, controller, args) {
        controller.startInterval();
        return processFlags(function() {
            fn.apply(controller, args);
        });
    }
    function processFlags(next) {
        return processMiddlewares(function() {
            return next();
        });
    }
    function processMiddlewares(next) {
        return next();
    }
    function getQueryObj(url) {
        url = url.replace(/\+/g, ' ');
        var exp = /[?&]([^=#]+)=([^&#]*)/g;
        var o = {};
        var m = null;
        while (m = exp.exec(url)) {
            var k = decodeURIComponent(m[1]);
            var v = decodeURIComponent(m[2]);
            o[k] = v;
        }
        return o;
    }
    function locationHash() { // IF ONLY # IS IN ADDRESS BAR RETURNS #. location.hash RETURNS ''
        var hash = location.href.split(location.pathname)[1];
        return typeof(hash) === 'string' ? hash : '';
    }
    function onHashChange(hash) {
        var part = [
            hash[0].split('~'),
            hash[1].split('~')
        ];
        if (part[0][0] === part[1][0]) {
            if (part[0][1] && !part[1][1]) { // ANCHOR WAS PRESENT BUT USER REMOVED ANCHOR AND HITTED ENTER IN ADDRESSBAR
                location.reload();
            }
            else if (part[1][1] && part[0][1] !== part[1][1]) { // ANCHOR WAS AND IS PRESENT, BUT VALUE WAS CHANGED
                return scrollToID(part[1][1]);
            }
        }
        else {
            if (part[1][0] === '#') {
                location.replace(''); // PREVENT DOUBLE RELOAD WHEN REDIRECTING FROM # TO ''. FORGET '#' HISTORY.
            }
            else {
                return location.reload();
            }
        }
    }
    function scrollToID(elementID) {
        var el = document.getElementById(elementID);
        if (el) {
            el.scrollIntoView();
        }
    }
    function isErrorRoute(v) {
        return /^#(400|404|408|500)/.test(v);
    }
};
function Controller0(route, query, args, anchor, err) {
    var self = this;
    self.route = route;
    self.query = query;
    self.args = Array.isArray(args) ? args : [];
    self.anchor = anchor || null;
    self.err = err || null;
    self.viewCalled = false;
    self.execTime = 0;
    self.startInterval = function() {
        self.interval = setInterval(function() {
            self.execTime += 1000;
            if (self.execTime >= 10000) {
                clearInterval(self.interval);
                return self.throw408();
            }
        }, 1000);
    };
}
Controller0.prototype = {
    view: function(html) { // SETS PAGE HTML
        var self = this;
        if (self.execTime >= 10000) {
            return;
        }
        if (html !== 'string') {
            throw new Error('invalidParameter');
        }
        if (self.viewCalled) {
            throw new Error('invocationCount');
        }
        self.viewCalled = true;
        var el = document.getElementById('page');
        if (el) {
            el.innerHTML = html;
        }
        else {
            throw new Error('Element #page was not found.');
        }
    },
    throw400: function(err) {
        exports.ROUTE0('#400', err);
    },
    throw404: function(err) {
        exports.ROUTE0('#404', err);
    },
    throw408: function(err) {
        exports.ROUTE0('#408', err);
    },
    throw500: function(err) {
        exports.ROUTE0('#500', err);
    }
};
exports.Controller0 = Controller0;
