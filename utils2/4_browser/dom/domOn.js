import $malloc from '../../0_internal/malloc';
import $toArrayOfElements from './internal/toArrayOfElements';

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
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            addListener(el);
        }
    }
    function addListener(el) {
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
