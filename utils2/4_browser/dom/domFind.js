import $selectingOne from './internal/selectingOne';

export default function $domFind(sel, el) {
    if (!sel || typeof(sel) !== 'string') {
        throw new Error('api-sel');
    }
    var list = (el ? el : document).querySelectorAll(sel);
    if (list) {
        if ($selectingOne(sel)) {
            return list[0] || null;
        }
        else {
            var arr = [];
            var l = list.length;
            arr.length = l;
            for (var i = 0; i < l; i++) {
                if (list[i]) {
                    arr[i] = list[i];
                }
            }
            return arr;
        }
    }
    else {
        return $selectingOne(sel) ? null : [];
    }
}
window.$domFind = $domFind;
