import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domFadeTo(sel, o, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!o || typeof(o) !== 'string') {
        throw new Error('api-o');
    }
    o = parseFloat(o);
    if (isNaN(o) || o < 0 || o > 1) {
        throw new Error('api-o');
    }
    if (t !== undefined && (typeof(t) !== 'number' || t < 0)) {
        throw new Error('api-t');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            fadeTo(el);
        }
    }
    function fadeTo(el) {
        el.style.transition = 'opacity ' + (t === undefined ? 250 : t) + 'ms';
        el.style.opacity = '' + o;
    }
}
window.$domFadeTo = $domFadeTo;
