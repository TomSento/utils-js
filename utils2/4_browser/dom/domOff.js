import $malloc from '../../0_internal/malloc';
import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domOff(sel, k) { // https://stackoverflow.com/a/4386514
    if (!sel) {
        throw new Error('api-sel');
    }
    if (k && typeof(k) !== 'string') {
        throw new Error('api-k');
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
                els[i] = removeListener(el, k || null);
            }
        }
    }
    function removeListener(el, k) {
        var cache = $malloc('__DOM');
        var handler = cache('handler') || {};
        var replacer = el;
        if (k) { // REMOVE BY KEY
            if (handler[el] && handler[el][k]) {
                var fns = handler[el][k];
                for (var i = 0; i < fns.length; i++) {
                    var fn = fns[i];
                    el.removeEventListener(k, fn, false);
                }
                handler[el][k] = null;
            }
        }
        else { // REMOVE ALL
            var copy = el.cloneNode(true);
            el.parentNode.replaceChild(copy, el);
            handler[el] = null;
            replacer = copy;
        }
        cache('handler', handler);
        return replacer;
    }
}
window.$domOff = $domOff;
