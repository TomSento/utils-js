import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domTriggerNativeEvent(sel, k) {
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
                triggerEvent(el, k);
            }
        }
    }
    function triggerEvent(el, k) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(k, true, false);
        el.dispatchEvent(e);
    }
}
window.$domTriggerNativeEvent = $domTriggerNativeEvent;
