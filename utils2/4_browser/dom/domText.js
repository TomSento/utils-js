import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domText(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (v && typeof(v) !== 'string') {
        return new Error('api-v');
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
                arr.push(getText(el));
            }
            else {
                setText(el, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getText(el) {
        return el.textContent || null;
    }
    function setText(el, v) {
        el.textContent = v;
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
window.$domText = $domText;
