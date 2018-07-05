import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domFadeOut(sel, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    t = parseInt(t);
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            fadeOut(el);
        }
    }
    function fadeOut(el) {
        el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
        el.style.opacity = '0';
    }
}
window.$domFadeOut = $domFadeOut;
