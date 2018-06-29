import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domTriggerEvent(sel, k, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
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
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (el) {
                triggerEvent(el, k, v);
            }
        }
    }
    function triggerEvent(el, k, v) {
        var e = null;
        if (window.CustomEvent) {
            e = new CustomEvent(k, {
                detail: v
            });
        }
        else {
            e = document.createEvent('CustomEvent');
            e.initCustomEvent(k, true, true, v);
        }
        el.dispatchEvent(e);
    }
}
window.$domTriggerEvent = $domTriggerEvent;
