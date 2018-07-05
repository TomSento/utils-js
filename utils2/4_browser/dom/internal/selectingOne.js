import $domIsEl from '../domIsEl';

export default function $selectingOne(sel) {
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
