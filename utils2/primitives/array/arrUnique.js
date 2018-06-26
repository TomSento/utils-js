import $global from '../../global';

export default function $arrUnique(arr, k) {
    var result = [];
    var sublen = 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        var v = arr[i];
        if (!k) {
            if (result.indexOf(v) === -1) {
                result.push(v);
            }
            continue;
        }
        if (sublen === 0) {
            result.push(v);
            sublen++;
            continue;
        }
        var is = true;
        for (var j = 0; j < sublen; j++) {
            if (result[j][k] === v[k]) {
                is = false;
                break;
            }
        }
        if (is) {
            result.push(v);
            sublen++;
        }
    }
    return result;
}
$global.$arrUnique = $arrUnique;
