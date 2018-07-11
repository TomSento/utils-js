import $toArrayOfElements from './internal/toArrayOfElements';
import $selectingOne from './internal/selectingOne';

export default function $domText(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (v !== undefined && typeof(v) !== 'string') {
        throw new Error('api-v');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els; i < l; i++) {
        var el = els[i];
        if (el) {
            if (v === undefined) {
                arr.push(getText(el));
            }
            else {
                setText(el);
            }
        }
    }
    if (v === undefined) {
        return $selectingOne(sel) ? (arr[0] || '') : arr;
    }
    function getText(el) {
        return el.textContent || '';
    }
    function setText(el) {
        el.textContent = v;
    }
}
window.$domText = $domText;
