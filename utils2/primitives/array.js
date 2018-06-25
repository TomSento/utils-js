exports.$arrForEach = function(arr, fn) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        fn(arr[i], i, arr);
    }
};
exports.$arrMap = function(arr, fn) {
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
};
exports.$arrFilter = function(arr, fn) {
    var acc = [];
    for (var i = 0; i < arr.length; i++) {
        if (fn.call(null, arr[i], i, arr)) {
            acc.push(arr[i]);
        }
    }
    return acc;
};
exports.$arrFind = function(arr, fn, v) {
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
};
exports.$arrFindIndex = function(arr, fn, v) {
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
};
exports.$arrRemove = function(arr, fn, v) { // FROM TOTAL.JS
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
};
exports.$arrFirst = function(arr) {
    return arr[0] || null;
};
exports.$arrLast = function(arr) {
    return arr[arr.length - 1] || null;
};
exports.$arrOrderBy = function(arr, name, asc, maxlength) { // FROM TOTAL.JS EXCEPT JSON DATE COMPARISION
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
            if (!(field instanceof Date) && !isNaN(field.getTime())) {
                return arr;
            }
            type = 4;
            break;
    }
    function shellInsertionSort(list, length, gapSize, fn) {
        var i = 0;
        var j = 0;
        var temp = null;
        for (i = gapSize; i < length; i += gapSize) {
            j = i;
            while (j > 0 && fn(list[j - gapSize], list[j]) === 1) {
                temp = list[j];
                list[j] = list[j - gapSize];
                list[j - gapSize] = temp;
                j -= gapSize;
            }
        }
    }
    function shellsort(arr, fn) {
        var length = arr.length;
        var gapSize = Math.floor(length / 2);
        while (gapSize) {
            shellInsertionSort(arr, length, gapSize, fn);
            gapSize = Math.floor(gapSize / 2);
        }
        return arr;
    }
    shellsort(arr, function(a, b) {
        var va = name ? a[name] : a;
        var vb = name ? b[name] : b;
        if (type === 1) {
            if (va && vb) {
                if (asc) {
                    return exports.$strRemoveDiacritics(va.substring(0, maxlength)).localeCompare(exports.$strRemoveDiacritics(vb.substring(0, maxlength)));
                }
                else {
                    return exports.$strRemoveDiacritics(vb.substring(0, maxlength)).localeCompare(exports.$strRemoveDiacritics(va.substring(0, maxlength)));
                }
            }
            else {
                return 0;
            }
        }
        else if (type === 2) {
            if (va > vb) {
                return asc ? 1 : -1;
            }
            else if (va < vb) {
                return asc ? -1 : 1;
            }
            else {
                return 0;
            }
        }
        else if (type === 3) {
            if (va === true && vb === false) {
                return asc ? 1 : -1;
            }
            else if (va === false && vb === true) {
                return asc ? -1 : 1;
            }
            else {
                return 0;
            }
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
            if (at > bt) {
                return asc ? 1 : -1;
            }
            else if (at < bt) {
                return asc ? -1 : 1;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    });
    return arr;
};
exports.$arrHas = function(arr, v) {
    return arr.indexOf(v) >= 0;
};
exports.$arrUnique = function(arr, k) {
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
};
