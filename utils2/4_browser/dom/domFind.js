import $selectingOne from './internal/selectingOne';

export default function $domFind(sel, parent) {
    if (!sel || typeof(sel) !== 'string') {
        throw new Error('api-sel');
    }
    var list = (parent ? parent : document).querySelectorAll(sel) || [];
    var arr = [];
    for (var i = 0, l = list.length; i < l; i++) {
        var el = list[i];
        if (el) {
            arr[i] = el;
        }
    }
    return $selectingOne(sel) ? (arr[0] || null) : arr;
}
window.$domFind = $domFind;
