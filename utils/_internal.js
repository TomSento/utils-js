exports.malloc = function(prefix) {
    if (!exports.__cache) {
        exports.__cache = {};
    }
    if (!exports.__cache[prefix]) {
        exports.__cache[prefix] = {};
    }
    var obj = exports.__cache[prefix];
    return function(k, v) {
        if (typeof(k) === 'object' && v === undefined) {
            return obj = k;
        }
        if (k === undefined && v === undefined) {
            return obj;
        }
        if (typeof(k) !== 'string') {
            throw new Error('invalidParameter');
        }
        if (v === undefined) {
            return obj[k];
        }
        else {
            obj[k] = v;
        }
    }
};
exports.toDebugStr = function(args) {
    var str = '';
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) {
            if (typeof(arg) === 'object' || Array.isArray(arg)) {
                if (Array.isArray(arg)) {
                    str += 'Array(' + arg.length + '): \n';
                }
                else if (typeof(arg) === 'object') {
                    str += 'Object: \n';
                }
                str += JSON.stringify(arg, null, '    ');
                str += '\n';
            }
            else {
                str += (i > 0 ? ' ' : '') + arg;
            }
        }
        else {
            str += (i > 0 ? ' ' : '') + arg;
        }
    }
    return str;
};
