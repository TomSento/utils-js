import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domFadeTo(sel, o, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!o || isNaN(o) || o > 100 || o < 0) {
        throw new Error('api-o');
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
        for (var i = 0, len = els.length; i < len; i++) {
            var el = els[i];
            if (el) {
                fadeTo(el, o, t);
            }
        }
    }
    function fadeTo(el, o, t) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        el.style.opacity = o.toString();
    }
}
window.$domFadeTo = $domFadeTo;
