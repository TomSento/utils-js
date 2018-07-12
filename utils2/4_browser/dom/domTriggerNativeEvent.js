import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domTriggerNativeEvent(sel, k) {
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
    function triggerEvent(el) { // -------------------------------------------> http://youmightnotneedjquery.com/#trigger_native
        var e = document.createEvent('HTMLEvents');
        e.initEvent(k, true, false);
        el.dispatchEvent(e);
    }
}
window.$domTriggerNativeEvent = $domTriggerNativeEvent;
