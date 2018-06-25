function $arrForEach(arr, fn) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        fn(arr[i], i, arr);
    }
}
