import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domRemoveClass(sel, rm) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!rm || typeof(rm) !== 'string') {
        throw new Error('api-v');
    }
    rm = rm.split(/\s+/);
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            removeClass(el);
        }
    }
    function removeClass(el) { // --------------------------------------------> REMOVES 0..N CLASSES
        var i;
        var l;
        var cls;
        if (el.classList && typeof(el.classList.remove) === 'function') {
            for (i = 0, l = rm.length; i < l; i++) {
                cls = rm[i];
                if (cls) {
                    el.classList.remove(cls);
                }
            }
        }
        else {
            if (el.className && typeof(el.className) === 'string') {
                var curr = el.className.split(/\s+/);
                var arr = [];
                for (i = 0, l = curr.length; i < l; i++) {
                    cls = curr[i];
                    if (cls && rm.indexOf(cls) === -1) {
                        arr.push(cls);
                    }
                }
                el.className = arr.length > 0 ? arr.join(' ') : '';
            }
        }
    }
}
window.$domRemoveClass = $domRemoveClass;
