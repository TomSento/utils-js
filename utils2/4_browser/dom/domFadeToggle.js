import { $toArrayOfElements } from './_utils';

export default function $domFadeToggle(sel, t) {
    if (!sel) {
        throw new Error('api-sel');
    }
    t = parseInt(t);
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            fadeToggle(el);
        }
    }
    function fadeToggle(el) {
        var s = el.ownerDocument.defaultView.getComputedStyle(el, null);
        if (s) {
            el.style.transition = 'opacity ' + (isNaN(t) || t < 0 ? 250 : t) + 'ms';
            el.style.opacity = s.opacity === '1' ? '0' : '1';
        }
    }
}
window.$domFadeToggle = $domFadeToggle;
