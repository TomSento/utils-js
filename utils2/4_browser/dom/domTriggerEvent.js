import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domTriggerEvent(sel, k, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            triggerEvent(el);
        }
    }
    function triggerEvent(el) { // -------------------------------------------> http://youmightnotneedjquery.com/#trigger_custom
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
