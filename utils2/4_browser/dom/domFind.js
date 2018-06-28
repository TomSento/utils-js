import $domIsEl from './domIsEl';

export default function $domFind(sel, el) {
    var list = null;
    if (!sel || typeof(sel) !== 'string') {
        throw new Error('api-sel');
    }
    if (el && $domIsEl(el)) {
        list = el.querySelectorAll(sel);
    }
    else {
        list = document.querySelectorAll(sel);
    }
    if (list) {
        if (selectingOne(sel)) {
            return list[0] || null;
        }
        else {
            var arr = [];
            var len = list.length;
            arr.length = len;
            for (var i = 0; i < len; i++) {
                if (list[i]) {
                    arr[i] = list[i];
                }
            }
            return arr;
        }
    }
    else {
        if (selectingOne(sel)) {
            return null;
        }
        return [];
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
window.$domFind = $domFind;
