import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domRemove(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            domRemove(el);
        }
    }
    function domRemove(el) {
        el.parentNode.removeChild(el);
    }
}
window.$domRemove = $domRemove;
