import $global from '../../global';

export default function $objClone(obj, skip, skipFunctions) {
    if (!obj) {
        return obj;
    }
    var typ = typeof(obj);
    if (typ !== 'object' || obj instanceof Date) {
        return obj;
    }
    var len;
    var o;
    if (obj instanceof Array) {
        len = obj.length;
        o = new Array(len);
        for (var i = 0; i < len; i++) {
            typ = typeof(obj[i]);
            if (typ !== 'object' || obj[i] instanceof Date) {
                if (skipFunctions && typ === 'function') {
                    continue;
                }
                o[i] = obj[i];
                continue;
            }
            o[i] = $objClone(obj[i], skip, skipFunctions);
        }
        return o;
    }
    o = {};
    for (var m in obj) {
        if (skip && skip[m]) {
            continue;
        }
        var val = obj[m];
        typ = typeof(val);
        if (typ !== 'object' || val instanceof Date) {
            if (skipFunctions && typ === 'function') {
                continue;
            }
            o[m] = val;
            continue;
        }
        o[m] = $objClone(obj[m], skip, skipFunctions);
    }
    return o;
}
$global.$objClone = $objClone;
