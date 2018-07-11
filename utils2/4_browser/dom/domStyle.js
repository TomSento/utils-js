import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';

export default function $domStyle(sel, k, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    v = typeof(v) === 'number' ? ('' + v) : v;
    if (v !== undefined) {
        if (typeof(v) !== 'string' || v.length === 0) { // -------------------> REQUIRED ALSO WHEN RESETING STYLE, E.G. "background-color": "transparent"
            throw new Error('api-v');
        }
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            if (v === undefined) {
                arr.push(getStyle(el));
            }
            else {
                setStyle(el);
            }
        }
    }
    if (v === undefined) {
        return $selectingOne(sel) ? arr[0] : arr;
    }
    function getStyle(el) {
        var style = el.ownerDocument.defaultView.getComputedStyle(el, null) || {};
        return style[k] || undefined;
    }
    function setStyle(el) {
        el.style[k] = v;
    }
}
window.$domStyle = $domStyle;
