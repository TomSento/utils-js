import $toArrayOfElements from './internal/toArrayOfElements';
import $arrUnique from '../../1_primitives/array/arrUnique';
import $domMatches from './domMatches';

export default function $domSiblings(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            var sibs = getSiblings(el);
            if (Array.isArray(sibs) && sibs.length > 0) {
                arr = arr.concat(sibs);
            }
        }
    }
    return $arrUnique(arr);
    function getSiblings(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        for (var i = 0, l = els.length; i < l; i++) {
            var sib = els[i];
            if (sib && !$domMatches(sib, sel)) {
                arr.push(sib);
            }
        }
        return arr;
    }
}
window.$domSiblings = $domSiblings;
