import $domIsEl from './domIsEl';

export default function $domScrollTo(sel) { // -------------------------------> '' || null || undefined - NO ACTION
    if (sel === '' || sel == null) {
        return;
    }
    if (typeof(sel) !== 'string') {
        if (!sel || !$domIsEl(sel)) {
            throw new Error('api-sel');
        }
    }
    var el = typeof(sel) === 'string' ? document.getElementById(sel) : sel;
    if (el) {
        el.scrollIntoView();
    }
}
window.$domScrollTo = $domScrollTo;
