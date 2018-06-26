import $global from '../../global';

export default function $arrFindIndex(arr, fn, v) {
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    for (var i = 0, len = arr.length; i < len; i++) {
        if (isFN) {
            if (fn(arr[i], i)) {
                return i;
            }
            continue;
        }
        if (isV) {
            if (arr[i] && arr[i][fn] === v) {
                return i;
            }
            continue;
        }
        if (arr[i] === fn) {
            return i;
        }
    }
    return -1;
}
$global.$arrFindIndex = $arrFindIndex;
