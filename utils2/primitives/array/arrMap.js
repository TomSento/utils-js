function $arrMap(arr, fn) {
    var acc = [];
    for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (typeof(fn) === 'function') {
            acc.push(fn(v, i, arr));
        }
        else {
            acc.push(v && typeof(v) === 'object' ? v[fn] : undefined);
        }
    }
    return acc;
}
