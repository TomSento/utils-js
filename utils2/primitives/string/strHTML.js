function $strHTML(tag, obj) {
    if (!tag || typeof(tag) !== 'string') {
        return '';
    }
    var pairables = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    var str = '<' + tag;
    if (!obj) { // Allow empty elements <p></p>
        obj = {};
    }
    if (obj.id) {
        str += ' id="' + obj.id + '"';
    }
    if (Array.isArray(obj.classes)) {
        str += classesAsStr(obj);
    }
    if (obj.style && typeof(obj.style) === 'object') {
        str += stylesAsStr(obj.style);
    }
    str += attrsAsStr(obj);
    if (obj.data && typeof(obj.data) === 'object') {
        str += dataAttrsAsStr(obj.data);
    }
    if (pairables.indexOf(tag) >= 0) {
        return str + '/>';
    }
    str += '>';
    str += obj.html;
    str += '</' + tag + '>';
    return str;
    function classesAsStr(obj) {
        var arr = obj.classes;
        var str = '';
        for (var i = 0; i < arr.length; i++) {
            var v = arr[i];
            if (v) {
                v = '.' + v;
            }
        }
        str = obj.classes.join(' ');
        return str.length > 0 ? (' class="' + str + '"') : '';
    }
    function attrsAsStr(obj) {
        obj = typeof(obj) === 'object' ? obj : {};
        var str = '';
        for (var k in obj) {
            if (['id', 'classes', 'style', 'data', 'html'].indexOf(k) >= 0) {
                continue;
            }
            var attr = k + '="' + obj[k] + '"';
            str += str.length > 0 ? (' ' + attr) : attr;
        }
        return str.length > 0 ? (' ' + str) : '';
    }
    function dataAttrsAsStr(obj) {
        var str = '';
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                var attr = 'data-' + k + '="' + obj[k] + '"';
                str += str.length > 0 ? (' ' + attr) : attr;
            }
        }
        return str.length > 0 ? (' ' + str) : '';
    }
    function stylesAsStr(obj) {
        var str = '';
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                str += exports.$strHyphenize(k) + ':' + obj[k] + ';';
            }
        }
        return (str.length > 0) ? (' style="' + str + '"') : '';
    }
}
