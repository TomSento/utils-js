exports.browserSupportsEvent = function(sel, eventName) { // https://stackoverflow.com/a/26124697/6135126
    var el = null;
    if (sel instanceof Node || sel instanceof Element || sel instanceof HTMLDocument) {
        el = sel;
    }
    else if (typeof(sel) === 'string') {
        el = createElementWithAttributes(sel);
    }
    else {
        return false;
    }
    if (el) {
        eventName = 'on' + eventName;
        if (el[eventName] !== undefined) {
            return true;
        }
        else if (el instanceof Element) {
            el.setAttribute(eventName, 'return;');
            return (typeof(el[eventName]) === 'function');
        }
        return false;
    }
    else {
        throw new Error('missingElement');
    }
    function createElementWithAttributes(selector) {
        var exp = /^<(\S+)[^>]/;
        var m = selector.match(exp);
        if (!Array.isArray(m) || m.length === 0) {
            return null;
        }
        var el = document.createElement(m[1]);
        exp = /(\S+)="(\S+)"/g;
        m = null;
        while (m = exp.exec(selector)) {
            if (Array.isArray(m) && m.length > 0) {
                el.setAttribute(m[1], m[2]);
            }
        }
        return el;
    }
};
