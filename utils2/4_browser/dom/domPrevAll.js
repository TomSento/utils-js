import $toArrayOfElements from './internal/toArrayOfElements';
import $arrUnique from '../../1_primitives/array/arrUnique';
import $domMatches from './domMatches';

export default function $domPrevAll(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            var pels = getPrevAll(el);
            if (Array.isArray(pels) && pels.length > 0) {
                arr = arr.concat(pels);
            }
        }
    }
    return $arrUnique(arr);
    function getPrevAll(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        for (var i = 0, l = els.length; i < l; i++) {
            var sib = els[i];
            if (sib) {
                if (sib === el) {
                    return arr;
                }
                if (!$domMatches(sib, sel)) {
                    arr.push(sib);
                }
            }
        }
        return [];
    }
}
window.$domPrevAll = $domPrevAll;
