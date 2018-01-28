exports.objClone = function(obj, skip, skipFunctions) {
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
            o[i] = exports.objClone(obj[i], skip, skipFunctions);
        }
        return o;
    }
    o = {};
    for (var m in obj) {
        if (skip && skip[m]) {
            continue;
        }
        var val = obj[m];
        var typ = typeof(val);
        if (typ !== 'object' || val instanceof Date) {
            if (skipFunctions && typ === 'function') {
                continue;
            }
            o[m] = val;
            continue;
        }
        o[m] = exports.objClone(obj[m], skip, skipFunctions);
    }
    return o;
};
exports.objExtend = function(base, obj, rewrite) {
    if (!base || !obj) {
        return base;
    }
    if (typeof(base) !== 'object' || typeof(obj) !== 'object') {
        return base;
    }
    if (rewrite === undefined) {
        rewrite = true;
    }
    var keys = Object.keys(obj);
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        if (rewrite || base[key] === undefined) {
            base[key] = exports.objClone(obj[key]);
        }
    }
    return base;
};
exports.objKeys = function(obj) {
    var keys = [];
    var k;
    for (k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            keys.push(k);
        }
    }
    return keys;
};
exports.objForIn = function(obj, fn) {
    var i = 0;
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            fn(k, obj[k], i);
            i++;
        }
    }
};
exports.objToQueryStr = function(obj) {
    var arr = [];
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            var v = encodeVal(obj[k]);
            k = encodeURIComponent(k);
            if (k && v) {
                arr.push(k + '=' + v);
            }
        }
    }
    var len = arr.length;
    return len > 0 ? ('?' + arr.join('&')) : '';
    function encodeVal(any) {
        var typ = Object.prototype.toString.call(any);
        switch (typ) {
            case '[object Number]':
                return encodeURIComponent(any);
            case '[object String]':
                return strEncode(any);
            case '[object Array]':
                return arrEncode(any);
            case '[object Boolean]':
                return any ? '1' : '0';
        }
        return null;
    }
    function strEncode(str) {
        var len = str.replace(/\s*/g, '').length;
        if (len == 0) {
            return null;
        }
        var map = {
            ' ': '%20',
            '\t': '%09',
            '\n': '%0A',
            '\r': '%0D'
        };
        str = str.replace(/( |\t|\n|\r)/g, function(match, k) {
            return map[k] || k;
        });
        return str || null;
    }
    function arrEncode(arr) {
        var acc = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var v = encodeVal(arr[i]);
            if (v) {
                acc.push(v);
            }
        }
        len = acc.length;
        return len > 0 ? acc.join(',') : null;
    }
};
