import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domFadeToggle(sel, t) {
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
        for (var i = 0, len = els.length; i < len; i++) {
            var el = els[i];
            if (el) {
                fadeToggle(el);
            }
        }
    }
    function fadeToggle(el) {
        var s = el.ownerDocument.defaultView.getComputedStyle(el, null);
        if (s) {
            el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
            el.style.opacity = s.opacity === '1' ? '0' : '1';
        }
    }
}
window.$domFadeToggle = $domFadeToggle;
