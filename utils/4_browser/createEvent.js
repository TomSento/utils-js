document.$createEvent = function(k, v) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(k, true, true, v);
    return e;
};
