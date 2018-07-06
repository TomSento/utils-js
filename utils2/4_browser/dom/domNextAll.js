import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';

export default function $domNextAll(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            arr.push(getNextAll(el));
        }
    }
    return $selectingOne(sel) ? arr[0] : arr;
    function getNextAll(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        var brk = false;
        for (var i = 0, l = els.length; i < l; i++) {
            var sib = els[i];
            if (sib && brk) {
                arr.push(sib);
            }
            if (sib === el) {
                brk = true;
            }
        }
        return arr;
    }
}
window.$domNextAll = $domNextAll;
