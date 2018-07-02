import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domFadeTo(sel, o, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    o = parseFloat(o);
    if (isNaN(o) || o < 0 || o > 1) {
        throw new Error('api-o');
    }
    t = parseInt(t);
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
        el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
        el.style.opacity = o.toString();
    }
}
window.$domFadeTo = $domFadeTo;
