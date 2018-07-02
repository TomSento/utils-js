import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domFadeIn(sel, t) {
    if (!sel) {
        throw new Error('api-sel');
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
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                fadeIn(el, t);
            }
        }
    }
    function fadeIn(el, t) {
        el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
        el.style.opacity = '1';
    }
}
window.$domFadeIn = $domFadeIn;
