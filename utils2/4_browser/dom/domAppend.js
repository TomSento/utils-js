import { $toArrayOfElements } from './_utils';

export default function $domAppend(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (typeof(v) !== 'string') {
        throw new Error('api-v');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            domAppend(el, v);
        }
    }
    function domAppend(el, v) {
        el.insertAdjacentHTML('beforeend', v);
    }
}
window.$domAppend = $domAppend;
