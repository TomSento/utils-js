import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';
import $domMatches from './domMatches';

export default function $domPrev(sel, psel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (psel !== undefined && typeof(psel) !== 'string') {
        throw new Error('api-psel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            var pel = getPrev(el);
            if (pel && arr.indexOf(pel) === -1) {
                arr.push(pel);
            }
        }
    }
    return $selectingOne(sel) ? (arr[0] || null) : arr;
    function getPrev(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var brk = false;
        for (var i = els.length - 1; i >= 0; i--) {
            var sib = els[i];
            if (sib && brk) {
                if (psel === undefined || $domMatches(sib, psel)) {
                    return sib;
                }
            }
            if (sib === el) {
                brk = true;
            }
        }
        return null;
    }
}
window.$domPrev = $domPrev;
