import $malloc from '../../0_internal/malloc';
import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domOff(sel, k) { // https://stackoverflow.com/a/4386514
    if (!sel) {
        throw new Error('api-sel');
    }
    if (k !== undefined && typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            els[i] = removeListener(el);
        }
    }
    function removeListener(el) {
        var cache = $malloc('__DOM');
        var handler = cache('handler') || {};
        var replacer = el;
        if (k) { // REMOVE BY KEY
            if (handler[el] && handler[el][k]) {
                var fns = handler[el][k];
                for (var i = 0, l = fns.length; i < l; i++) {
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
