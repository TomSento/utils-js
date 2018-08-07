var ENCODE_HTML_CHARACTERS = {
    '&': 'amp',
    '"': 'quot',
    '<': 'lt',
    '>': 'gt'
};

String.prototype.escape = function(lspace, lrev, rspace) {
    lspace = lspace || '&nbsp;';
    rspace = rspace || '&nbsp;';
    var str = this.replace(/(&|"|<|>)/g, function(match, k) {
        return ('&' + ENCODE_HTML_CHARACTERS[k] + ';') || k;
    });
    str = replaceMultipleWhitespacesBetweenChars(str);
    str = str.replace(/^\s+/, function(m) {
        return spaces(m.length, lspace, lrev);
    });
    str = str.replace(/\s+$/, function(m) {
        return spaces(m.length, rspace, true);
    });
    return str;
    function replaceMultipleWhitespacesBetweenChars(str) {
        var exp = /[^\s](\s+)[^\s]/g;
        var match = null;
        while (match = exp.exec(str)) {
            if (Array.isArray(match)) {
                exp.lastIndex -= 1;
                var i = match.index + 1;
                var len = match[1].length;
                var part = spaces(len, ' ', true); // ------------------------> PRESERVE BS ON LEFT BOUNDARY
                str = str.substring(0, i) + part + str.substring(i + len);
            }
        }
        return str;
    }
    function spaces(len, space1st, reverse) {
        var space2nd = space1st === ' ' ? '&nbsp;' : ' ';
        var arr = [];
        while (len--) {
            arr[len] = (len % 2 === 0) ? space1st : space2nd;
        }
        return reverse ? arr.reverse().join('') : arr.join('');
    }
};
