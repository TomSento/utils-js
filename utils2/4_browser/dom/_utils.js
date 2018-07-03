import $domIsEl from './domIsEl';
import $domFind from './domFind';

export function $toArrayOfElements(sel) {
    if (Array.isArray(sel)) {
        return sel;
    }
    else if ($domIsEl(sel)) {
        return [sel];
    }
    else {
        var els = $domFind(sel);
        return Array.isArray(els) ? els : [els];
    }
}

export function $selectingOne(sel) {
    if ($domIsEl(sel)) {
        return true;
    }
    else if (typeof(sel) === 'string') {
        var arr = sel.split(/\s+/);
        var last = arr[arr.length - 1];
        return last && last[0] === '#';
    }
    return false;
}
