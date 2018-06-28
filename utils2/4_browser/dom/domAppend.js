import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domAppend(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (typeof(v) !== 'string') {
        throw new Error('api-v');
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
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                domAppend(el, v);
            }
        }
    }
    function domAppend(el, v) {
        el.insertAdjacentHTML('beforeend', v);
    }
}
window.$domAppend = $domAppend;
