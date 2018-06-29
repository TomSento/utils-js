import $domIsEl from './domIsEl';

export default function $domScrollTo(sel) {
    if (typeof(sel) === 'string') {
        if (sel[0] !== '#' && sel[0] !== '.') {
            sel = '#' + sel;
        }
        else {
            throw new Error('api-sel');
        }
    }
    else if (sel && !$domIsEl(sel)) {
        throw new Error('api-sel');
    }
    else if (!sel) {
        return;
    }
    var el = typeof(sel) === 'string' ? document.getElementById(sel.slice(1)) : sel;
    if (el) {
        el.scrollIntoView();
    }
}
window.$domScrollTo = $domScrollTo;
