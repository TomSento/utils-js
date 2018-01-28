exports.genUID = function() {
    var d = new Date();
    var mo = twoPlaces(d.getMonth() + 1);
    var day = twoPlaces(d.getDate());
    var h = twoPlaces(d.getHours());
    var min = twoPlaces(d.getMinutes());
    var arr = [
        d.getFullYear(),
        mo,
        day,
        h,
        min,
        exports.SID(3)
    ];
    return arr.join('-');
    function twoPlaces(v) {
        return v < 10 ? ('0' + v) : v;
    }
};
exports.genSID = function(len) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    len = parseInt(len);
    len = isNaN(len) ? 5 : len;
    if (len < 0) {
        throw new Error('invalidParameter');
    }
    var str = '';
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    var cache = exports.malloc('__GEN');
    var c = cache('SID');
    c = c === undefined ? 0 : (++c % 2);
    c = '' + c;
    cache('SID', c);
    return (str.length > 0) ? (str + '-' + c) : c;
};
exports.genIID = function(len) {
    var c = exports.malloc('__GEN');
    len = parseInt(len);
    len = isNaN(len) ? 3 : len;
    if (len <= 0) {
        throw new Error('invalidParameter');
    }
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var num = chars.length;
    var prefix = 'SID_' + len;
    var i = 0;
    var arr = [];
    if (c(prefix)) {
        arr = c(prefix).arr;
        var b = '';
        for (i; i < len; i++) {
            b += chars[arr[i]];
        }
        i = len - 1;
        if (arr[len - 1] == (num - 1)) { // JUMP
            while (arr[i] == (num - 1)) {
                arr[i] = 0;
                i--;
            }
            if (i != -1) {
                arr[i] = (arr[i] + 1) % num;
            }
            i = len - 1;
        }
        else {
            arr[i] = (arr[i] + 1) % num;
        }
        c(prefix).arr = arr;
        return b;
    }
    else {
        for (i; i < len; i++) {
            arr[i] = 0;
        }
        c(prefix, {
            arr: arr
        });
        return exports.IID(len);
    }
};
