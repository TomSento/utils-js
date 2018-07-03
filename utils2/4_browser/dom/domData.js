import { $toArrayOfElements, $selectingOne } from './_utils';

export default function $domData(sel, k, v) { // NO ACTION FOR "document"
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    var els = $toArrayOfElements(sel);
    var arr = [];
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            if (v === undefined) {
                arr.push(getData(el, k));
            }
            else {
                setData(el, k, v);
            }
        }
    }
    if (v === undefined) {
        return $selectingOne(sel) ? arr[0] : arr;
    }
    function getData(el, k) {
        if (el.$data && el.$data[k] !== undefined) {
            return el.$data[k];
        }
        return el.dataset ? el.dataset[k] : undefined; // --------------------> "document" DOES NOT HAVE "dataset"
    }
    function setData(el, k, v) {
        if (el.dataset) {
            if (typeof(v) === 'string') {
                el.dataset[k] = v;
            }
            else {
                if (!el.$data) {
                    el.$data = {};
                }
                el.$data[k] = v;
            }
        }
    }
}
window.$domData = $domData;
