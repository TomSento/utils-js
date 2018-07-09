import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';

export default function $domParent(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            var pel = getParent(el);
            if (pel && arr.indexOf(pel) === -1) {
                arr.push(pel);
            }
        }
    }
    return $selectingOne(sel) ? (arr[0] || null) : arr;
    function getParent(el) {
        return el.parentNode || null;
    }
}
window.$domParent = $domParent;
