import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domFadeToggle(sel, t) {
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
        for (var i = 0, len = els.length; i < len; i++) {
            var el = els[i];
            if (el) {
                fadeToggle(el);
            }
        }
    }
    function fadeToggle(el) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        var s = el.ownerDocument.defaultView.getComputedStyle(el, null);
        var o = (!s) ? null : s.opacity;
        if (o === null) {
            return;
        }
        if (o === '1') {
            el.style.opacity = '0';
        }
        else {
            el.style.opacity = '1';
        }
    }
}
window.$domFadeToggle = $domFadeToggle;
