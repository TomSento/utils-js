function $strToHTMLText(str, leftStartWithNBPS, leftRevResult, rightStartWithNBPS, rightRevResult) {
    var map = {
        '&': 'amp',
        '"': 'quot',
        '<': 'lt',
        '>': 'gt'
    };
    str = str.replace(/(&|"|<|>)/g, function(match, k) {
        return ('&' + map[k] + ';') || k;
    });
    str = replaceMultipleWhitespacesBetweenChars(str);
    str = str.replace(/^\s+/, function(spaces) {
        return generateSpaces(spaces.length, leftStartWithNBPS, leftRevResult);
    });
    str = str.replace(/\s+$/, function(spaces) {
        return generateSpaces(spaces.length, rightStartWithNBPS, rightRevResult);
    });
    return str;
    function replaceMultipleWhitespacesBetweenChars(str) {
        var exp = /[^\s](\s+)[^\s]/g;
        var match = null;
        while (match = exp.exec(str)) {
            if (Array.isArray(match)) {
                exp.lastIndex -= 1; // MATCH OVERLAPS
                var i = match.index + 1;
                var len = match[1].length;
                var part = generateSpaces(len, false, true); // PRESERVE BS ON CHAR LEFT BOUNDARY
                str = str.substring(0, i) + part + str.substring(i + len);
            }
        }
        return str;
    }
    function generateSpaces(len, startWithNBPS, revResult) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            if (i % 2 === 0) {
                arr[i] = startWithNBPS ? '&nbsp;' : ' ';
            }
            else {
                arr[i] = startWithNBPS ? ' ' : '&nbsp;';
            }
        }
        return revResult ? arr.reverse().join('') : arr.join('');
    }
}
