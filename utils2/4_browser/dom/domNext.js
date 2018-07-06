import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';
import $domMatches from './domMatches';

export default function $domNext(sel, nsel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (nsel !== undefined && typeof(nsel) !== 'string') {
        throw new Error('api-nsel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            arr.push(getNext(el));
        }
    }
    return $selectingOne(sel) ? arr[0] : arr;
    function getNext(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var brk = false;
        for (var i = 0, l = els.length; i < l; i++) {
            var sib = els[i];
            if (sib && brk) {
                if (nsel === undefined || $domMatches(sib, nsel)) {
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
window.$domNext = $domNext;
