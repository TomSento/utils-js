import $global from '../../global';

export default function $q(obj) { // -----------------------------------------> STRINGIFY OBJECT TO QUERY STRING
    var arr = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
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
}
$global.$q = $q;
