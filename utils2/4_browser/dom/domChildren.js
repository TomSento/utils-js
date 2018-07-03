import { $toArrayOfElements, $selectingOne } from './_utils';

export default function $domChildren(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            arr.push(getChildren(el));
        }
    }
    return $selectingOne(sel) ? arr[0] : arr;
    function getChildren(el) {
        var els = el.children || [];
        var arr = [];
        for (var i = 0; i < els.length; i++) {
            arr[i] = els[i];
        }
        return arr;
    }
}
window.$domChildren = $domChildren;
