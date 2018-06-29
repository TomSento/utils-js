import $malloc from '../../0_internal/malloc';
import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domOn(sel, k, fn) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if ($domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = $domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (el) {
                addListener(el, k, fn);
            }
        }
    }
    function addListener(el, k, fn) {
        var cache = $malloc('__DOM');
        var handler = cache('handler') || {};
        if (!handler[el]) {
            handler[el] = {};
        }
        if (!handler[el][k]) {
            handler[el][k] = []; // ONE ELEMENT CAN HAVE MULTIPLE EVENT HANDLERS
        }
        handler[el][k].push(fn);
        el.addEventListener(k, fn, false);
        cache('handler', handler);
    }
}
window.$domOn = $domOn;
