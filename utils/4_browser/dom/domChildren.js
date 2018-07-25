import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domChildren(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            var children = getChildren(el);
            if (Array.isArray(children) && children.length > 0) {
                arr = arr.concat(children);
            }
        }
    }
    return arr;
    function getChildren(el) {
        var els = el.children || [];
        var arr = [];
        for (var i = 0, l = els.length; i < l; i++) {
            arr[i] = els[i];
        }
        return arr;
    }
}
window.$domChildren = $domChildren;
