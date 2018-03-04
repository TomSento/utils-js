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
    function isErrorRoute(route) {
        return ['#400', '#404', '#408', '#500'].indexOf(route) >= 0;
    }
    function domReady(fn) {
        if (document.attachEvent ? (document.readyState === 'complete') : (document.readyState !== 'loading')) {
            fn();
        }
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
};
exports.ROUTE0 = function(url, err) {
    var cache = exports.malloc('_ROUTE0');
    var routes = cache('routes');
    if (!Array.isArray(routes) || routes.length === 0) {
        throw new Error('missingRoute');
    }
    if (typeof(url) === 'string' && url[0] !== '#') {
        throw new Error('invalidParameter');
    }
    var hash = locationHash();
    console.log('HASH: ', hash);
    console.log('ROUTES: ', cache('routes'));
    if (!window.onhashchange) {
        window.onhashchange = function() {
            onHashChange(hash);
            hash = locationHash();
        };
    }
    var route = parseRoute(url);
    console.log('FINDROUTE: ', route);
    var found = false;
    for (var i = 0; i < routes.length; i++) {
        var v = routes[i];
        if (v.exp.test(route.path)) {
            found = true;
            console.log('URL_FOUND');
            var args = route.path.match(v.exp).slice(1);
            var anchor = v.hasAnchor ? (args.pop() || null) : null; // FORCE TO NULL IF URL IS LIKE #users~
            err = isErrorRoute(route.path) ? getErrorBuilder(err) : null;
            console.log('ERR: ', err);
            console.log('ARGS: ', args);
            console.log('ANCHOR: ', anchor);
            var controller = new exports.Controller0(v.route, route.query, args, anchor, err);
            console.log('FN: ', v.fn.toString());
            invokeRoute(v.fn, controller, args);
            if (url || (hash.length === 1 && hash[0] === '#')) {
                console.log('REPLACE:', route.url);
                location.replace(route.url); // UPDATE ADDRESSBAR URL TO #ERR_ROUTE. UPDATE ADDRESSBAR FROM # TO ''
            }
        }
    }
    if (!found) {
        console.log('URL_NOTFOUND');
        exports.ROUTE0('#404');
    }
    function invokeRoute(fn, controller, args) {
        controller.startInterval();
        return processFlags(function() {
            fn.apply(controller, args);
        });
    }
    function getErrorBuilder(err) {
        err = [err, localStorage['ROUTE0_ERR']];
        if (err[0]) {
            console.log('OK1');
            return new exports.ErrorBuilder(err[0]);
        }
        else if (err[1]) {
            console.log('OK2: ', err[1]);
            return new exports.ErrorBuilder(JSON.parse(err[1]));
        }
        else {
            console.log('OK3');
            return new exports.ErrorBuilder();
        }
    }
    function processFlags(next) {
        return processMiddlewares(function() {
            return next();
        });
    }
    function processMiddlewares(next) {
        return next();
    }
    function parseRoute(url) {
        var path = url ? url.split(/\?+/g)[0] : locationHash().split(/\?+/g)[0];
        url = url ? url : location.hash;
        url = url === '#' ? '' : url;
        return {
            url: url, // FOR ADDRESSBAR
            path: path || '#', // ONLY PATH WITHOUT QUERY STRING
            query: getQueryObj(url)
        };
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
        console.log('HASH:', hash);
        console.log('LASH:', locationHash());
        var url = [
            hash.split('~'),
            locationHash().split('~')
        ];
        // if (isErrorRoute(url[1][0])) {
        //     if (url[1][1] && url[0][1] !== url[1][1]) { // ANCHOR WAS AND IS SETTED, BUT VALUE WAS CHANGED
        //         return scrollToID(url[1][1]);
        //     }
        // }
        // else {

        // if (url[0][0] === url[1][0]) {
        //     if (url[0][1] && !url[1][1]) { // ANCHOR WAS PRESENT BUT USER REMOVED ANCHOR AND HITTED ENTER IN ADDRESSBAR
        //         return replaceAndReload(locationHash());
        //     }
        //     else if (url[1][1] && url[0][1] !== url[1][1]) { // ANCHOR WAS AND IS SETTED, BUT VALUE WAS CHANGED
        //         return scrollToID(url[1][1]);
        //     }
        // }
        // else {
        //     return replaceAndReload(locationHash()); // WE MUST TO RELOAD WHOLE PAGE OTHERWISE ASYNC SCRIPTS CAN INSERT DATA TO PAGE FOR WHICH THEY WERE NOT INTENDED.
        // }

        // }
    }
    function replaceAndReload(url) {
        console.log('REPLACE_RELOAD');
        location.replace(url);
        return location.reload();
    }
    function scrollToID(elementID) {
        var el = document.getElementById(elementID);
        if (el) {
            el.scrollIntoView();
        }
    }
    function isErrorRoute(route) {
        return ['#400', '#404', '#408', '#500'].indexOf(route) >= 0;
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
            self.execTime += 500;
            if (self.execTime >= 10000) {
                clearInterval(self.interval);
                return self.throw408();
            }
        }, 500);
    };
}
Controller0.prototype = {
    view: function(html) { // SETS PAGE HTML
        var self = this;
        if (self.viewCalled) {
            throw new Error("Multiple 'view()' invocations.");
        }
        self.viewCalled = true;
        clearInterval(self.interval);
        if (self.execTime >= 10000) {
            return self.throw408();
        }
        var el = document.getElementById('page');
        if (el) {
            el.innerHTML = html || '';
        }
        else {
            throw new Error('Element #page was not found.');
        }
    },
    throw400: function(err) {
        localStorage['ROUTE0_ERR'] = err ? JSON.stringify(new exports.ErrorBuilder(err)) : '';
        exports.ROUTE0('#400');
    },
    throw404: function(err) {
        localStorage['ROUTE0_ERR'] = err ? JSON.stringify(new exports.ErrorBuilder(err)) : '';
        exports.ROUTE0('#404');
    },
    throw408: function(err) {
        localStorage['ROUTE0_ERR'] = err ? JSON.stringify(new exports.ErrorBuilder(err)) : '';
        exports.ROUTE0('#408');
    },
    throw500: function(err) {
        localStorage['ROUTE0_ERR'] = err ? JSON.stringify(new exports.ErrorBuilder(err)) : '';
        exports.ROUTE0('#500');
    }
};
exports.Controller0 = Controller0;
