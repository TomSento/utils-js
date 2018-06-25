function $strPadEnd(str, len, fill) {
    if (typeof(str) === 'number' && typeof(len) === 'string' && !fill) {
        return padEnd('', str, len);
    }
    else if (typeof(str) === 'string' && typeof(len) === 'number' && typeof(fill) === 'string') {
        return padEnd(str, len, fill);
    }
    else {
        throw new Error('invalidArguments');
    }
    function padEnd(s, l, f) {
        l -= s.length;
        if (l < 0) {
            return s;
        }
        if (f === undefined) {
            f = ' ';
        }
        while (l--) {
            s += f;
        }
        return s;
    }
}
