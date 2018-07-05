import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';

export default function $domAttr(sel, k, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    if (v !== undefined) {
        try {
            v = '' + JSON.stringify(v);
        }
        catch (err) {
            throw new Error('api-v');
        }
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            if (v === undefined) {
                arr.push(getAttr(el));
            }
            else {
                setAttr(el);
            }
        }
    }
    if (v === undefined) {
        return $selectingOne(sel) ? arr[0] : arr;
    }
    function getAttr(el) {
        if (['checked', 'disabled', 'readonly'].indexOf(k) >= 0) {
            return el.hasAttribute(k);
        }
        else {
            return el.getAttribute(k);
        }
    }
    function setAttr(el) {
        el.setAttribute(k, v);
    }
}
window.$domAttr = $domAttr;
