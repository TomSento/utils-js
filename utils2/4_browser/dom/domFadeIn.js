import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domFadeIn(sel, t) {
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
                fadeIn(el, t);
            }
        }
    }
    function fadeIn(el, t) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        el.style.opacity = '1';
    }
}
window.$domFadeIn = $domFadeIn;
