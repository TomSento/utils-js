export default function $domMatches(el, sel) { // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
        return Array.prototype.indexOf.call(document.querySelectorAll(s), this) !== -1;
    };
    return fn.call(el, sel);
}
window.$domMatches = $domMatches;
