import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domRemove(sel) {
    if (!sel) {
        throw new Error('api-sel');
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
                domRemove(el);
            }
        }
    }
    function domRemove(el) {
        el.parentNode.removeChild(el);
    }
}
window.$domRemove = $domRemove;
