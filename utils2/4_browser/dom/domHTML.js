import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';

export default function $domHTML(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (v !== undefined && typeof(v) !== 'string') {
        throw new Error('api-v');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            if (v === undefined) {
                arr.push(getHtml(el));
            }
            else {
                setHtml(el);
            }
        }
    }
    if (v === undefined) {
        return $selectingOne(sel) ? arr[0] : arr;
    }
    function getHtml(el) {
        return el.innerHTML || null;
    }
    function setHtml(el) {
        el.innerHTML = v;
    }
}
window.$domHTML = $domHTML;
