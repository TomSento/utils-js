import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domNextAll(sel) {
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
                arr.push(getNextAll(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getNextAll(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        var brk = false;
        for (var i = 0; i < els.length; i++) {
            var ch = els[i];
            if (brk) {
                arr.push(ch);
            }
            if (ch === el) {
                brk = true;
            }
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
window.$domNextAll = $domNextAll;
