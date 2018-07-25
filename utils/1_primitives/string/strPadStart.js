import $global from '../../global';

export default function $strPadStart(str, len, fill) {
    if (typeof(str) === 'number' && typeof(len) === 'string' && !fill) {
        return padStart('', str, len);
    }
    else if (typeof(str) === 'string' && typeof(len) === 'number' && typeof(fill) === 'string') {
        return padStart(str, len, fill);
    }
    else {
        throw new Error('invalidArguments');
    }
    function padStart(s, l, f) {
        l -= s.length;
        if (l < 0) {
            return s;
        }
        if (f === undefined) {
            f = ' ';
        }
        while (l--) {
            s = f + s;
        }
        return s;
    }
}
$global.$strPadStart = $strPadStart;
