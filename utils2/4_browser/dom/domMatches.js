import $domIsEl from './domIsEl';

export default function $domMatches(el, sel) { // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    if (!el || !$domIsEl(el)) {
        throw new Error('api-el');
    }
    if (!sel || typeof(sel) !== 'string') {
        throw new Error('api-sel');
    }
    if (typeof(el.matches) === 'function') {
        return el.matches(sel);
    }
    else if (typeof(el.msMatchesSelector) === 'function') { // IE9+
        return el.msMatchesSelector(sel);
    }
    else {
        return false;
    }
}
window.$domMatches = $domMatches;
