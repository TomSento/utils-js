import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domRemoveClass(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!v || typeof(v) !== 'string') {
        throw new Error('api-v');
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
            if (!el) {
                continue;
            }
            var clas = v.split(/\s+/);
            var lenlen = clas.length;
            for (var j = 0; j < lenlen; j++) {
                var cla = clas[j];
                removeClass(el, cla);
            }
        }
    }
    function removeClass(el, v) {
        if (el.classList) {
            el.classList.remove(v);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + v.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
}
window.$domRemoveClass = $domRemoveClass;
