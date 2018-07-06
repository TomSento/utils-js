export default function $domMatches(el, sel) { // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    if (typeof(Element.prototype.matches) === 'function') {
        return el.matches(sel);
    }
    else if (typeof(Element.prototype.msMatchesSelector) === 'function') { // IE9+
        return el.msMatchesSelector(sel);
    }
    else {
        return false;
    }
}
window.$domMatches = $domMatches;
