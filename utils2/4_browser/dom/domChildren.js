import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domChildren(sel) {
    if (!sel) {
        throw new Error('api-sel');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if ($domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = $domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getChildren(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getChildren(el) {
        var els = el.children || [];
        var arr = [];
        for (var i = 0; i < els.length; i++) {
            arr[i] = els[i];
        }
        return arr;
    }
    function selectingOne(sel) {
        if ($domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
}
window.$domChildren = $domChildren;
