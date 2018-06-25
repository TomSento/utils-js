function $strFromUntil(str, leftIndex, exp) {
    str = str.substring(leftIndex);
    var arr = str.split(exp);
    if (Array.isArray(arr)) {
        return arr[0] === str ? null : arr[0];
    }
    return null;
}
