exports.arrForEach = function(arr, fn) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        fn(arr[i], i, arr);
    }
};
exports.arrMap = function(arr, fn) {
    var acc = [];
    for (var i = 0; i < arr.length; i++) {
        acc.push(fn(arr[i], i, arr));
    }
    return acc;
};
exports.arrFilter = function(arr, fn) {
    var acc = [];
    for (var i = 0; i < arr.length; i++) {
        if (fn.call(null, arr[i], i, arr)) {
            acc.push(arr[i]);
        }
    }
    return acc;
};
exports.arrFind = function(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        if (fn.call(null, arr[i], i, arr)) {
            return arr[i];
        }
    }
    return null;
};
exports.arrRemove = function(arr, fn, v) { // FROM TOTAL.JS
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    var tmp = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (isFN) {
            !fn.call(arr, arr[i], i) && tmp.push(arr[i]);
            continue;
        }
        if (isV) {
            arr[i] && arr[i][fn] !== v && tmp.push(arr[i]);
            continue;
        }
        arr[i] !== fn && tmp.push(arr[i]);
    }
    return tmp;
};
exports.arrFirst = function(arr) {
    return arr[0] || null;
};
exports.arrLast = function(arr) {
    return arr[arr.length - 1] || null;
};
exports.arrOrderBy = function(arr, name, asc, maxlength) { // FROM TOTAL.JS EXCEPT JSON DATE COMPARISION
    var length = arr.length;
    if (!length || length === 1) {
        return arr;
    }
    if (typeof(name) === 'boolean') {
        asc = name;
        name = undefined;
    }
    if (maxlength === undefined) {
        maxlength = 3;
    }
    if (asc === undefined) {
        asc = true;
    }
    var type = 0;
    var field = name ? arr[0][name] : arr[0];
    switch (typeof(field)) {
        case 'string':
            type = 1;
            break;
        case 'number':
            type = 2;
            break;
        case 'boolean':
            type = 3;
            break;
        default:
            if (!field instanceof Date && !isNaN(field.getTime())) {
                return arr;
            }
            type = 4;
            break;
    }
    function _shellInsertionSort(list, length, gapSize, fn) {
        var temp, i, j;
        for (i = gapSize; i < length; i += gapSize ) {
            j = i;
            while(j > 0 && fn(list[j - gapSize], list[j]) === 1) {
                temp = list[j];
                list[j] = list[j - gapSize];
                list[j - gapSize] = temp;
                j -= gapSize;
            }
        }
    };
    function shellsort(arr, fn) {
        var length = arr.length;
        var gapSize = Math.floor(length / 2);
        while(gapSize) {
            _shellInsertionSort(arr, length, gapSize, fn);
            gapSize = Math.floor(gapSize / 2);
        }
        return arr;
    };
    shellsort(arr, function(a, b) {
        var va = name ? a[name] : a;
        var vb = name ? b[name] : b;
        if (type === 1) {
            return (va && vb) ? (asc ? exports.strRemoveDiacritics(va.substring(0, maxlength)).localeCompare(exports.strRemoveDiacritics(vb.substring(0, maxlength))) : exports.strRemoveDiacritics(vb.substring(0, maxlength)).localeCompare(exports.strRemoveDiacritics(va.substring(0, maxlength)))) : 0;
        }
        else if (type === 2) {
            return va > vb ? (asc ? 1 : -1) : va < vb ? (asc ? -1 : 1) : 0;
        }
        else if (type === 3) {
            return va === true && vb === false ? (asc ? 1 : -1) : va === false && vb === true ? (asc ? -1 : 1) : 0;
        }
        else if (type === 4) {
            if (!va || !vb) {
                return 0;
            }
            if (!va.getTime) {
                va = new Date(va);
            }
            if (!vb.getTime) {
                vb = new Date(vb);
            }
            var at = va.getTime();
            var bt = vb.getTime();
            return at > bt ? (asc ? 1 : -1) : at < bt ? (asc ? -1 : 1) : 0;
        }
        return 0;
    });
    return arr;
};
exports.arrHas = function(arr, v) {
    return arr.indexOf(v) >= 0;
};
exports.arrUnique = function(arr, k) {
    var result = [];
    var sublen = 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        var v = arr[i];
        if (!k) {
            result.indexOf(v) === -1 && result.push(v);
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
};
