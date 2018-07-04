import { $toArrayOfElements } from './_utils';

export default function $domFadeTo(sel, o, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    o = parseFloat(o);
    if (isNaN(o) || o < 0 || o > 1) {
        throw new Error('api-o');
    }
    t = parseInt(t);
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            fadeTo(el);
        }
    }
    function fadeTo(el) {
        el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
        el.style.opacity = o.toString();
    }
}
window.$domFadeTo = $domFadeTo;
