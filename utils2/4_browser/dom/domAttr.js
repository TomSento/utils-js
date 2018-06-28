import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domAttr(sel, k, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    if (v !== undefined) {
        try {
            v = '' + JSON.stringify(v);
        }
        catch (err) {
            throw new Error('api-v');
        }
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
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getAttr(el, k));
            }
            else {
                setAttr(el, k, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getAttr(el, k) {
        var v = el.getAttribute(k) || null;
        if (v) {
            return v;
        }
        else {
            return el.hasAttribute(k);
        }
    }
    function setAttr(el, k, v) {
        el.setAttribute(k, v);
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
window.$domAttr = $domAttr;
