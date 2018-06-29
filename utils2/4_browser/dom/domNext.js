import $domIsEl from './domIsEl';
import $domFind from './domFind';
import $domMatches from './domMatches';

export default function $domNext(sel, nsel) {
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
                arr.push(getNext(el, nsel));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getNext(el, nsel) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var brk = false;
        for (var i = 0; i < els.length; i++) {
            var sib = els[i];
            if (sib === el) {
                brk = true;
                continue;
            }
            if (brk && sib && ($domMatches(sib, nsel) || !nsel)) {
                return sib;
            }
            else {
                continue;
            }
        }
        return null;
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
window.$domNext = $domNext;
