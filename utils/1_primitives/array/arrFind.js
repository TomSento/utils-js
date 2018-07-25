import $global from '../../global';

export default function $arrFind(arr, fn, v) {
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    for (var i = 0, len = arr.length; i < len; i++) {
        if (isFN) {
            if (fn(arr[i], i)) {
                return arr[i];
            }
            continue;
        }
        if (isV) {
            if (arr[i] && arr[i][fn] === v) {
                return arr[i];
            }
            continue;
        }
        if (arr[i] === fn) {
            return arr[i];
        }
    }
    return null;
}
$global.$arrFind = $arrFind;
