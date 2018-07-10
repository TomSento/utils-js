import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domRemoveClass(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!v || typeof(v) !== 'string') {
        throw new Error('api-v');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            removeClass(el);
        }
    }
    function removeClass(el) { // --------------------------------------------> REMOVES 0..N CLASSES
        if (el.classList && typeof(el.classList.remove) === 'function') {
            el.classList.remove(v);
        }
        else {
            if (el.className && typeof(el.className) === 'string') {
                var curr = el.className.split(/\s+/);
                var rm = v.split(/\s+/);
                var arr = [];
                for (var i = 0, l = curr.length; i < l; i++) {
                    var cls = curr[i];
                    if (cls && rm.indexOf(cls) === -1) {
                        arr.push(cls);
                    }
                }
                el.className = arr.join(' ');
            }
        }
    }
}
window.$domRemoveClass = $domRemoveClass;
