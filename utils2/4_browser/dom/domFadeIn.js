import { $toArrayOfElements } from './_utils';

export default function $domFadeIn(sel, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    t = parseInt(t);
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            fadeIn(el);
        }
    }
    function fadeIn(el) {
        el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
        el.style.opacity = '1';
    }
}
window.$domFadeIn = $domFadeIn;
