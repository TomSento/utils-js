(function() {
    var els = document.querySelectorAll('[state]');
    var i = els.length;
    var el;
    while (i--) {
        el = els[i];
        try { el.state = JSON.parse(el.getAttribute('state')); }
        catch (e) { el.state = {}; }
    }
}());
