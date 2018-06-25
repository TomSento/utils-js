function $arrRemove(arr, fn, v) { // FROM TOTAL.JS
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    var tmp = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (isFN) {
            if (!fn.call(arr, arr[i], i)) {
                tmp.push(arr[i]);
            }
            continue;
        }
        if (isV) {
            if (arr[i] && arr[i][fn] !== v) {
                tmp.push(arr[i]);
            }
            continue;
        }
        if (arr[i] !== fn) {
            tmp.push(arr[i]);
        }
    }
    return tmp;
}
