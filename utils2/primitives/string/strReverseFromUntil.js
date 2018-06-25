function $strReverseFromUntil(str, leftIndex, exp) {
    str = str.substring(0, leftIndex);
    var rev = '';
    for (var i = str.length - 1; i >= 0; i--) {
        rev += str[i];
    }
    var arr = rev.split(exp);
    if (Array.isArray(arr)) {
        return arr[0] === str ? null : arr[0];
    }
    return null;
}
