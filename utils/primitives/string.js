exports.strPadStart = function(str, len, fill) {
    if (typeof(str) === 'number' && typeof(len) === 'string' && !fill) {
        return ''.padStart(str, len);
    }
    else if (typeof(str) === 'string' && typeof(len) === 'number' && typeof(fill) === 'string') {
        return str.padStart(len, fill);
    }
    throw new Error('invalidParameter');
};
exports.strPadEnd = function(str, len, fill) {
    if (typeof(str) === 'number' && typeof(len) === 'string' && !fill) {
        return ''.padEnd(str, len);
    }
    else if (typeof(str) === 'string' && typeof(len) === 'number' && typeof(fill) === 'string') {
        return str.padEnd(len, fill);
    }
    throw new Error('invalidParameter');
};
exports.strHyphenize = function(str) {
    if (typeof(str) !== 'string') {
        return null;
    }
    return str.replace(/\B([A-Z])/g, function (g) {
        return ('-' + g[0]);
    }).toLowerCase();
};
exports.strFormat = function(str, args) {
    return str.replace(/\{\d+\}/g, function(text) {
        var value = args[+text.substring(1, text.length - 1)];
        return value === null ? '' : value;
    });
};
exports.strHTML = function(tag, obj) {
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
            str += exports.strHyphenize(k) + ':' + obj[k] + ';';
        }
        return (str.length > 0) ? (' style="' + str + '"') : '';
    }
};
exports.strStripHTML = function(str) {
    str = typeof(str) === 'string' ? str.replace(/<\/?[^>]+(>|$)/g, '') : '';
    var map = {
        'nbsp': ' ',
        'amp': '&',
        'quot': '\"',
        'lt': '<',
        'gt': '>'
    };
    return str.replace(/&(nbsp|amp|quot|lt|gt);/g, function(match, k) {
        return map[k] || k;
    });
};
exports.strToHTMLText = function(str, leftStartWithNBPS, leftRevResult, rightStartWithNBPS, rightRevResult) {
    var map = {
        '&': 'amp',
        '\"': 'quot',
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
        while ((match = exp.exec(str)) != null) {
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
            arr[i] = (i % 2 == 0) ? (startWithNBPS ? '&nbsp;' : ' ') : (startWithNBPS ? ' ' : '&nbsp;');
        }
        return revResult ? arr.reverse().join('') : arr.join('');
    };
},
exports.strStripWhitespaces = function(str) {
    return typeof(str) === 'string' ? str.replace(/\s+/, '') : '';
};
exports.strRemoveDiacritics = function(str) {
    var map = {
        '\u00a0': ' ',
        '\u07c0': '0',
        '\u24b6': 'A',
        '\uff21': 'A',
        '\u00c0': 'A',
        '\u00c1': 'A',
        '\u00c2': 'A',
        '\u1ea6': 'A',
        '\u1ea4': 'A',
        '\u1eaa': 'A',
        '\u1ea8': 'A',
        '\u00c3': 'A',
        '\u0100': 'A',
        '\u0102': 'A',
        '\u1eb0': 'A',
        '\u1eae': 'A',
        '\u1eb4': 'A',
        '\u1eb2': 'A',
        '\u0226': 'A',
        '\u01e0': 'A',
        '\u00c4': 'A',
        '\u01de': 'A',
        '\u1ea2': 'A',
        '\u00c5': 'A',
        '\u01fa': 'A',
        '\u01cd': 'A',
        '\u0200': 'A',
        '\u0202': 'A',
        '\u1ea0': 'A',
        '\u1eac': 'A',
        '\u1eb6': 'A',
        '\u1e00': 'A',
        '\u0104': 'A',
        '\u023a': 'A',
        '\u2c6f': 'A',
        '\ua732': 'AA',
        '\u00c6': 'AE',
        '\u01fc': 'AE',
        '\u01e2': 'AE',
        '\ua734': 'AO',
        '\ua736': 'AU',
        '\ua738': 'AV',
        '\ua73a': 'AV',
        '\ua73c': 'AY',
        '\u24b7': 'B',
        '\uff22': 'B',
        '\u1e02': 'B',
        '\u1e04': 'B',
        '\u1e06': 'B',
        '\u0243': 'B',
        '\u0181': 'B',
        '\u24b8': 'C',
        '\uff23': 'C',
        '\ua73e': 'C',
        '\u1e08': 'C',
        '\u0106C': 'C',
        '\u0108': 'C',
        '\u010a': 'C',
        '\u010c': 'C',
        '\u00c7': 'C',
        '\u0187': 'C',
        '\u023b': 'C',
        '\u24b9': 'D',
        '\uff24': 'D',
        '\u1e0a': 'D',
        '\u010e': 'D',
        '\u1e0c': 'D',
        '\u1e10': 'D',
        '\u1e12': 'D',
        '\u1e0e': 'D',
        '\u0110': 'D',
        '\u018a': 'D',
        '\u0189': 'D',
        '\u1d05': 'D',
        '\ua779': 'D',
        '\u00d0': 'Dh',
        '\u01f1': 'DZ',
        '\u01c4': 'DZ',
        '\u01f2': 'Dz',
        '\u01c5': 'Dz',
        '\u025b': 'E',
        '\u24ba': 'E',
        '\uff25': 'E',
        '\u00c8': 'E',
        '\u00c9': 'E',
        '\u00ca': 'E',
        '\u1ec0': 'E',
        '\u1ebe': 'E',
        '\u1ec4': 'E',
        '\u1ec2': 'E',
        '\u1ebc': 'E',
        '\u0112': 'E',
        '\u1e14': 'E',
        '\u1e16': 'E',
        '\u0114': 'E',
        '\u0116': 'E',
        '\u00cb': 'E',
        '\u1eba': 'E',
        '\u011a': 'E',
        '\u0204': 'E',
        '\u0206': 'E',
        '\u1eb8': 'E',
        '\u1ec6': 'E',
        '\u0228': 'E',
        '\u1e1c': 'E',
        '\u0118': 'E',
        '\u1e18': 'E',
        '\u1e1a': 'E',
        '\u0190': 'E',
        '\u018e': 'E',
        '\u1d07': 'E',
        '\ua77c': 'F',
        '\u24bb': 'F',
        '\uff26': 'F',
        '\u1e1e': 'F',
        '\u0191': 'F',
        '\ua77b': 'F',
        '\u24bc': 'G',
        '\uff27': 'G',
        '\u01f4': 'G',
        '\u011c': 'G',
        '\u1e20': 'G',
        '\u011e': 'G',
        '\u0120': 'G',
        '\u01e6': 'G',
        '\u0122': 'G',
        '\u01e4': 'G',
        '\u0193': 'G',
        '\ua7a0': 'G',
        '\ua77d': 'G',
        '\ua77e': 'G',
        '\u0262': 'G',
        '\u24bd': 'H',
        '\uff28': 'H',
        '\u0124': 'H',
        '\u1e22': 'H',
        '\u1e26': 'H',
        '\u021e': 'H',
        '\u1e24': 'H',
        '\u1e28': 'H',
        '\u1e2a': 'H',
        '\u0126': 'H',
        '\u2c67': 'H',
        '\u2c75': 'H',
        '\ua78d': 'H',
        '\u24be': 'I',
        '\uff29': 'I',
        '\u00cc': 'I',
        '\u00cd': 'I',
        '\u00ce': 'I',
        '\u0128': 'I',
        '\u012a': 'I',
        '\u012c': 'I',
        '\u0130': 'I',
        '\u00cf': 'I',
        '\u1e2e': 'I',
        '\u1ec8': 'I',
        '\u01cf': 'I',
        '\u0208': 'I',
        '\u020a': 'I',
        '\u1eca': 'I',
        '\u012e': 'I',
        '\u1e2c': 'I',
        '\u0197': 'I',
        '\u24bf': 'J',
        '\uff2a': 'J',
        '\u0134': 'J',
        '\u0248': 'J',
        '\u0237': 'J',
        '\u24c0': 'K',
        '\uff2b': 'K',
        '\u1e30': 'K',
        '\u01e8': 'K',
        '\u1e32': 'K',
        '\u0136': 'K',
        '\u1e34': 'K',
        '\u0198': 'K',
        '\u2c69': 'K',
        '\ua740': 'K',
        '\ua742': 'K',
        '\ua744': 'K',
        '\ua7a2': 'K',
        '\u24c1': 'L',
        '\uff2c': 'L',
        '\u013f': 'L',
        '\u0139': 'L',
        '\u013d': 'L',
        '\u1e36': 'L',
        '\u1e38': 'L',
        '\u013b': 'L',
        '\u1e3c': 'L',
        '\u1e3a': 'L',
        '\u0141': 'L',
        '\u023d': 'L',
        '\u2c62': 'L',
        '\u2c60': 'L',
        '\ua748': 'L',
        '\ua746': 'L',
        '\ua780': 'L',
        '\u01c7': 'LJ',
        '\u01c8': 'Lj',
        '\u24c2': 'M',
        '\uff2d': 'M',
        '\u1e3e': 'M',
        '\u1e40': 'M',
        '\u1e42': 'M',
        '\u2c6e': 'M',
        '\u019c': 'M',
        '\u03fb': 'M',
        '\ua7a4': 'N',
        '\u0220': 'N',
        '\u24c3': 'N',
        '\uff2e': 'N',
        '\u01f8': 'N',
        '\u0143': 'N',
        '\u00d1': 'N',
        '\u1e44': 'N',
        '\u0147': 'N',
        '\u1e46': 'N',
        '\u0145': 'N',
        '\u1e4a': 'N',
        '\u1e48': 'N',
        '\u019d': 'N',
        '\ua790': 'N',
        '\u1d0e': 'N',
        '\u01ca': 'NJ',
        '\u01cb': 'Nj',
        '\u24c4': 'O',
        '\uff2f': 'O',
        '\u00d2': 'O',
        '\u00d3': 'O',
        '\u00d4': 'O',
        '\u1ed2': 'O',
        '\u1ed0': 'O',
        '\u1ed6': 'O',
        '\u1ed4': 'O',
        '\u00d5': 'O',
        '\u1e4c': 'O',
        '\u022c': 'O',
        '\u1e4e': 'O',
        '\u014c': 'O',
        '\u1e50': 'O',
        '\u1e52': 'O',
        '\u014e': 'O',
        '\u022e': 'O',
        '\u0230': 'O',
        '\u00d6': 'O',
        '\u022a': 'O',
        '\u1ece': 'O',
        '\u0150': 'O',
        '\u01d1': 'O',
        '\u020c': 'O',
        '\u020e': 'O',
        '\u01a0': 'O',
        '\u1edc': 'O',
        '\u1eda': 'O',
        '\u1ee0': 'O',
        '\u1ede': 'O',
        '\u1ee2': 'O',
        '\u1ecc': 'O',
        '\u1ed8': 'O',
        '\u01ea': 'O',
        '\u01ec': 'O',
        '\u00d8': 'O',
        '\u01fe': 'O',
        '\u0186': 'O',
        '\u019f': 'O',
        '\ua74a': 'O',
        '\ua74c': 'O',
        '\u0152': 'OE',
        '\u01a2': 'OI',
        '\ua74e': 'OO',
        '\u0222': 'OU',
        '\u24c5': 'P',
        '\uff30': 'P',
        '\u1e54': 'P',
        '\u1e56': 'P',
        '\u01a4': 'P',
        '\u2c63': 'P',
        '\ua750': 'P',
        '\ua752': 'P',
        '\ua754': 'P',
        '\u24c6': 'Q',
        '\uff31': 'Q',
        '\ua756': 'Q',
        '\ua758': 'Q',
        '\u024a': 'Q',
        '\u24c7': 'R',
        '\uff32': 'R',
        '\u0154': 'R',
        '\u1e58': 'R',
        '\u0158': 'R',
        '\u0210': 'R',
        '\u0212': 'R',
        '\u1e5a': 'R',
        '\u1e5c': 'R',
        '\u0156': 'R',
        '\u1e5e': 'R',
        '\u024c': 'R',
        '\u2c64': 'R',
        '\ua75a': 'R',
        '\ua7a6': 'R',
        '\ua782': 'R',
        '\u24c8': 'S',
        '\uff33': 'S',
        '\u1e9e': 'S',
        '\u015a': 'S',
        '\u1e64': 'S',
        '\u015c': 'S',
        '\u1e60': 'S',
        '\u0160': 'S',
        '\u1e66': 'S',
        '\u1e62': 'S',
        '\u1e68': 'S',
        '\u0218': 'S',
        '\u015e': 'S',
        '\u2c7e': 'S',
        '\ua7a8': 'S',
        '\ua784': 'S',
        '\u24c9': 'T',
        '\uff34': 'T',
        '\u1e6a': 'T',
        '\u0164': 'T',
        '\u1e6c': 'T',
        '\u021a': 'T',
        '\u0162': 'T',
        '\u1e70': 'T',
        '\u1e6e': 'T',
        '\u0166': 'T',
        '\u01ac': 'T',
        '\u01ae': 'T',
        '\u023e': 'T',
        '\ua786': 'T',
        '\u00de': 'Th',
        '\ua728': 'TZ',
        '\u24ca': 'U',
        '\uff35': 'U',
        '\u00d9': 'U',
        '\u00da': 'U',
        '\u00db': 'U',
        '\u0168': 'U',
        '\u1e78': 'U',
        '\u016a': 'U',
        '\u1e7a': 'U',
        '\u016c': 'U',
        '\u00dc': 'U',
        '\u01db': 'U',
        '\u01d7': 'U',
        '\u01d5': 'U',
        '\u01d9': 'U',
        '\u1ee6': 'U',
        '\u016e': 'U',
        '\u0170': 'U',
        '\u01d3': 'U',
        '\u0214': 'U',
        '\u0216': 'U',
        '\u01af': 'U',
        '\u1eea': 'U',
        '\u1ee8': 'U',
        '\u1eee': 'U',
        '\u1eec': 'U',
        '\u1ef0': 'U',
        '\u1ee4': 'U',
        '\u1e72': 'U',
        '\u0172': 'U',
        '\u1e76': 'U',
        '\u1e74': 'U',
        '\u0244': 'U',
        '\u24cb': 'V',
        '\uff36': 'V',
        '\u1e7c': 'V',
        '\u1e7e': 'V',
        '\u01b2': 'V',
        '\ua75e': 'V',
        '\u0245': 'V',
        '\ua760': 'VY',
        '\u24cc': 'W',
        '\uff37': 'W',
        '\u1e80': 'W',
        '\u1e82': 'W',
        '\u0174': 'W',
        '\u1e86': 'W',
        '\u1e84': 'W',
        '\u1e88': 'W',
        '\u2c72': 'W',
        '\u24cd': 'X',
        '\uff38': 'X',
        '\u1e8a': 'X',
        '\u1e8c': 'X',
        '\u24ce': 'Y',
        '\uff39': 'Y',
        '\u1ef2': 'Y',
        '\u00dd': 'Y',
        '\u0176': 'Y',
        '\u1ef8': 'Y',
        '\u0232': 'Y',
        '\u1e8e': 'Y',
        '\u0178': 'Y',
        '\u1ef6': 'Y',
        '\u1ef4': 'Y',
        '\u01b3': 'Y',
        '\u024e': 'Y',
        '\u1efe': 'Y',
        '\u24cf': 'Z',
        '\uff3a': 'Z',
        '\u0179': 'Z',
        '\u1e90': 'Z',
        '\u017b': 'Z',
        '\u017d': 'Z',
        '\u1e92': 'Z',
        '\u1e94': 'Z',
        '\u01b5': 'Z',
        '\u0224': 'Z',
        '\u2c7f': 'Z',
        '\u2c6b': 'Z',
        '\ua762': 'Z',
        '\u24d0': 'a',
        '\uff41': 'a',
        '\u1e9a': 'a',
        '\u00e0': 'a',
        '\u00e1': 'a',
        '\u00e2': 'a',
        '\u1ea7': 'a',
        '\u1ea5': 'a',
        '\u1eab': 'a',
        '\u1ea9': 'a',
        '\u00e3': 'a',
        '\u0101': 'a',
        '\u0103': 'a',
        '\u1eb1': 'a',
        '\u1eaf': 'a',
        '\u1eb5': 'a',
        '\u1eb3': 'a',
        '\u0227': 'a',
        '\u01e1': 'a',
        '\u00e4': 'a',
        '\u01df': 'a',
        '\u1ea3': 'a',
        '\u00e5': 'a',
        '\u01fb': 'a',
        '\u01ce': 'a',
        '\u0201': 'a',
        '\u0203': 'a',
        '\u1ea1': 'a',
        '\u1ead': 'a',
        '\u1eb7': 'a',
        '\u1e01': 'a',
        '\u0105': 'a',
        '\u2c65': 'a',
        '\u0250': 'a',
        '\u0251': 'a',
        '\ua733': 'aa',
        '\u00e6': 'ae',
        '\u01fd': 'ae',
        '\u01e3': 'ae',
        '\ua735': 'ao',
        '\ua737': 'au',
        '\ua739': 'av',
        '\ua73b': 'av',
        '\ua73d': 'ay',
        '\u24d1': 'b',
        '\uff42': 'b',
        '\u1e03': 'b',
        '\u1e05': 'b',
        '\u1e07': 'b',
        '\u0180': 'b',
        '\u0183': 'b',
        '\u0253': 'b',
        '\u0182': 'b',
        '\uff43': 'c',
        '\u24d2': 'c',
        '\u0107': 'c',
        '\u0109': 'c',
        '\u010b': 'c',
        '\u010d': 'c',
        '\u00e7': 'c',
        '\u1e09': 'c',
        '\u0188': 'c',
        '\u023c': 'c',
        '\ua73f': 'c',
        '\u2184': 'c',
        '\u24d3': 'd',
        '\uff44': 'd',
        '\u1e0b': 'd',
        '\u010f': 'd',
        '\u1e0d': 'd',
        '\u1e11': 'd',
        '\u1e13': 'd',
        '\u1e0f': 'd',
        '\u0111': 'd',
        '\u018c': 'd',
        '\u0256': 'd',
        '\u0257': 'd',
        '\u018b': 'd',
        '\u13e7': 'd',
        '\u0501': 'd',
        '\ua7aa': 'd',
        '\u00f0': 'dh',
        '\u01f3': 'dz',
        '\u01c6': 'dz',
        '\u24d4': 'e',
        '\uff45': 'e',
        '\u00e8': 'e',
        '\u00e9': 'e',
        '\u00ea': 'e',
        '\u1ec1': 'e',
        '\u1ebf': 'e',
        '\u1ec5': 'e',
        '\u1ec3': 'e',
        '\u1ebd': 'e',
        '\u0113': 'e',
        '\u1e15': 'e',
        '\u1e17': 'e',
        '\u0115': 'e',
        '\u0117': 'e',
        '\u00eb': 'e',
        '\u1ebb': 'e',
        '\u011b': 'e',
        '\u0205': 'e',
        '\u0207': 'e',
        '\u1eb9': 'e',
        '\u1ec7': 'e',
        '\u0229': 'e',
        '\u1e1d': 'e',
        '\u0119': 'e',
        '\u1e19': 'e',
        '\u1e1b': 'e',
        '\u0247': 'e',
        '\u01dd': 'e',
        '\u24d5': 'f',
        '\uff46': 'f',
        '\u1e1f': 'f',
        '\u0192': 'f',
        '\ufb00': 'ff',
        '\ufb01': 'fi',
        '\ufb02': 'fl',
        '\ufb03': 'ffi',
        '\ufb04': 'ffl',
        '\u24d6': 'g',
        '\uff47': 'g',
        '\u01f5': 'g',
        '\u011d': 'g',
        '\u1e21': 'g',
        '\u011f': 'g',
        '\u0121': 'g',
        '\u01e7': 'g',
        '\u0123': 'g',
        '\u01e5': 'g',
        '\u0260': 'g',
        '\ua7a1': 'g',
        '\ua77f': 'g',
        '\u1d79': 'g',
        '\u24d7': 'h',
        '\uff48': 'h',
        '\u0125': 'h',
        '\u1e23': 'h',
        '\u1e27': 'h',
        '\u021f': 'h',
        '\u1e25': 'h',
        '\u1e29': 'h',
        '\u1e2b': 'h',
        '\u1e96': 'h',
        '\u0127': 'h',
        '\u2c68': 'h',
        '\u2c76': 'h',
        '\u0265': 'h',
        '\u0195': 'hv',
        '\u24d8': 'i',
        '\uff49': 'i',
        '\u00ec': 'i',
        '\u00ed': 'i',
        '\u00ee': 'i',
        '\u0129': 'i',
        '\u012b': 'i',
        '\u012d': 'i',
        '\u00ef': 'i',
        '\u1e2f': 'i',
        '\u1ec9': 'i',
        '\u01d0': 'i',
        '\u0209': 'i',
        '\u020b': 'i',
        '\u1ecb': 'i',
        '\u012f': 'i',
        '\u1e2d': 'i',
        '\u0268': 'i',
        '\u0131': 'i',
        '\u24d9': 'j',
        '\uff4a': 'j',
        '\u0135': 'j',
        '\u01f0': 'j',
        '\u0249': 'j',
        '\u24da': 'k',
        '\uff4b': 'k',
        '\u1e31': 'k',
        '\u01e9': 'k',
        '\u1e33': 'k',
        '\u0137': 'k',
        '\u1e35': 'k',
        '\u0199': 'k',
        '\u2c6a': 'k',
        '\ua741': 'k',
        '\ua743': 'k',
        '\ua745': 'k',
        '\ua7a3': 'k',
        '\u24db': 'l',
        '\uff4c': 'l',
        '\u0140': 'l',
        '\u013a': 'l',
        '\u013e': 'l',
        '\u1e37': 'l',
        '\u1e39': 'l',
        '\u013c': 'l',
        '\u1e3d': 'l',
        '\u1e3b': 'l',
        '\u017f': 'l',
        '\u0142': 'l',
        '\u019a': 'l',
        '\u026b': 'l',
        '\u2c61': 'l',
        '\ua749': 'l',
        '\ua781': 'l',
        '\ua747': 'l',
        '\u026d': 'l',
        '\u01c9': 'lj',
        '\u24dc': 'm',
        '\uff4d': 'm',
        '\u1e3f': 'm',
        '\u1e41': 'm',
        '\u1e43': 'm',
        '\u0271': 'm',
        '\u026f': 'm',
        '\u24dd': 'n',
        '\uff4e': 'n',
        '\u01f9': 'n',
        '\u0144': 'n',
        '\u00f1': 'n',
        '\u1e45': 'n',
        '\u0148': 'n',
        '\u1e47': 'n',
        '\u0146': 'n',
        '\u1e4b': 'n',
        '\u1e49': 'n',
        '\u019e': 'n',
        '\u0272': 'n',
        '\u0149': 'n',
        '\ua791': 'n',
        '\ua7a5': 'n',
        '\u043b': 'n',
        '\u0509': 'n',
        '\u01cc': 'nj',
        '\u24de': 'o',
        '\uff4f': 'o',
        '\u00f2': 'o',
        '\u00f3': 'o',
        '\u00f4': 'o',
        '\u1ed3': 'o',
        '\u1ed1': 'o',
        '\u1ed7': 'o',
        '\u1ed5': 'o',
        '\u00f5': 'o',
        '\u1e4d': 'o',
        '\u022d': 'o',
        '\u1e4f': 'o',
        '\u014d': 'o',
        '\u1e51': 'o',
        '\u1e53': 'o',
        '\u014f': 'o',
        '\u022f': 'o',
        '\u0231': 'o',
        '\u00f6': 'o',
        '\u022b': 'o',
        '\u1ecf': 'o',
        '\u0151': 'o',
        '\u01d2': 'o',
        '\u020d': 'o',
        '\u020f': 'o',
        '\u01a1': 'o',
        '\u1edd': 'o',
        '\u1edb': 'o',
        '\u1ee1': 'o',
        '\u1edf': 'o',
        '\u1ee3': 'o',
        '\u1ecd': 'o',
        '\u1ed9': 'o',
        '\u01eb': 'o',
        '\u01ed': 'o',
        '\u00f8': 'o',
        '\u01ff': 'o',
        '\ua74b': 'o',
        '\ua74d': 'o',
        '\u0275': 'o',
        '\u0254': 'o',
        '\u1d11': 'o',
        '\u0153': 'oe',
        '\u01a3': 'oi',
        '\ua74f': 'oo',
        '\u0223': 'ou',
        '\u24df': 'p',
        '\uff50': 'p',
        '\u1e55': 'p',
        '\u1e57': 'p',
        '\u01a5': 'p',
        '\u1d7d': 'p',
        '\ua751': 'p',
        '\ua753': 'p',
        '\ua755': 'p',
        '\u03c1': 'p',
        '\u24e0': 'q',
        '\uff51': 'q',
        '\u024b': 'q',
        '\ua757': 'q',
        '\ua759': 'q',
        '\u24e1': 'r',
        '\uff52': 'r',
        '\u0155': 'r',
        '\u1e59': 'r',
        '\u0159': 'r',
        '\u0211': 'r',
        '\u0213': 'r',
        '\u1e5b': 'r',
        '\u1e5d': 'r',
        '\u0157': 'r',
        '\u1e5f': 'r',
        '\u024d': 'r',
        '\u027d': 'r',
        '\ua75b': 'r',
        '\ua7a7': 'r',
        '\ua783': 'r',
        '\u24e2': 's',
        '\uff53': 's',
        '\u015b': 's',
        '\u1e65': 's',
        '\u015d': 's',
        '\u1e61': 's',
        '\u0161': 's',
        '\u1e67': 's',
        '\u1e63': 's',
        '\u1e69': 's',
        '\u0219': 's',
        '\u015f': 's',
        '\u023f': 's',
        '\ua7a9': 's',
        '\ua785': 's',
        '\u1e9b': 's',
        '\u0282': 's',
        '\u00df': 'ss',
        '\u24e3': 't',
        '\uff54': 't',
        '\u1e6b': 't',
        '\u1e97': 't',
        '\u0165': 't',
        '\u1e6d': 't',
        '\u021b': 't',
        '\u0163': 't',
        '\u1e71': 't',
        '\u1e6f': 't',
        '\u0167': 't',
        '\u01ad': 't',
        '\u0288': 't',
        '\u2c66': 't',
        '\ua787': 't',
        '\u00fe': 'th',
        '\ua729': 'tz',
        '\u24e4': 'u',
        '\uff55': 'u',
        '\u00f9': 'u',
        '\u00fa': 'u',
        '\u00fb': 'u',
        '\u0169': 'u',
        '\u1e79': 'u',
        '\u016b': 'u',
        '\u1e7b': 'u',
        '\u016d': 'u',
        '\u00fc': 'u',
        '\u01dc': 'u',
        '\u01d8': 'u',
        '\u01d6': 'u',
        '\u01da': 'u',
        '\u1ee7': 'u',
        '\u016f': 'u',
        '\u0171': 'u',
        '\u01d4': 'u',
        '\u0215': 'u',
        '\u0217': 'u',
        '\u01b0': 'u',
        '\u1eeb': 'u',
        '\u1ee9': 'u',
        '\u1eef': 'u',
        '\u1eed': 'u',
        '\u1ef1': 'u',
        '\u1ee5': 'u',
        '\u1e73': 'u',
        '\u0173': 'u',
        '\u1e77': 'u',
        '\u1e75': 'u',
        '\u0289': 'u',
        '\u24e5': 'v',
        '\uff56': 'v',
        '\u1e7d': 'v',
        '\u1e7f': 'v',
        '\u028b': 'v',
        '\ua75f': 'v',
        '\u028c': 'v',
        '\ua761': 'vy',
        '\u24e6': 'w',
        '\uff57': 'w',
        '\u1e81': 'w',
        '\u1e83': 'w',
        '\u0175': 'w',
        '\u1e87': 'w',
        '\u1e85': 'w',
        '\u1e98': 'w',
        '\u1e89': 'w',
        '\u2c73': 'w',
        '\u24e7': 'x',
        '\uff58': 'x',
        '\u1e8b': 'x',
        '\u1e8d': 'x',
        '\u24e8': 'y',
        '\uff59': 'y',
        '\u1ef3': 'y',
        '\u00fd': 'y',
        '\u0177': 'y',
        '\u1ef9': 'y',
        '\u0233': 'y',
        '\u1e8f': 'y',
        '\u00ff': 'y',
        '\u1ef7': 'y',
        '\u1e99': 'y',
        '\u1ef5': 'y',
        '\u01b4': 'y',
        '\u024f': 'y',
        '\u1eff': 'y',
        '\u24e9': 'z',
        '\uff5a': 'z',
        '\u017a': 'z',
        '\u1e91': 'z',
        '\u017c': 'z',
        '\u017e': 'z',
        '\u1e93': 'z',
        '\u1e95': 'z',
        '\u01b6': 'z',
        '\u0225': 'z',
        '\u0240': 'z',
        '\u2c6c': 'z',
        '\ua763': 'z',
    };
    var expDiacritics = /[^\u0000-\u007e]/g;
    return str.replace(expDiacritics, function(ch) {
        return map[ch] || ch;
    });
};
exports.strSlug = function(str, max) {
    max = max || 60;
    var self = exports.strRemoveDiacritics(str.trim().toLowerCase());
    var builder = '';
    var length = self.length;
    for (var i = 0; i < length; i++) {
        var c = self[i];
        var code = self.charCodeAt(i);
        if (builder.length >= max) {
            break;
        }
        if (code > 31 && code < 48) {
            if (builder[builder.length - 1] !== '-') {
                builder += '-';
            }
            continue;
        }
        if ((code > 47 && code < 58) || (code > 94 && code < 123)) {
            builder += c;
        }
    }
    var l = builder.length - 1;
    return builder[l] === '-' ? builder.substring(0, l) : builder;
};
exports.strReplaceBetween = function(str, i, j, part) {
    return str.substring(0, i) + part + str.substring(j);
};
exports.strReplaceCharAt = function(str, i, ch) {
    return str.substr(0, i) + ch + str.substr(i + ch.length);
};
exports.strReverse = function(str) {
    var rev = '';
    for (var i = str.length - 1; i >= 0; i--) {
        rev += str[i];
    }
    return rev;
};
exports.strHas = function(str, v) {
    return str.includes(v);
};
exports.strUntil = function(str, exp) {
    var arr = str.split(exp);
    return (Array.isArray(arr) && arr[0]) ? arr[0] : '';
};
exports.strFromUntil = function(str, leftIndex, exp) {
    str = str.substring(leftIndex);
    var arr = str.split(exp);
    return (Array.isArray(arr) && arr[0]) ? arr[0] : '';
};
exports.strReverseUntil = function(str, exp) {
    var rev = '';
    for (var i = str.length - 1; i >= 0; i--) {
        rev += str[i];
    }
    var arr = rev.split(exp);
    return (Array.isArray(arr) && arr[0]) ? arr[0] : '';
};
exports.strReverseFromUntil = function(str, leftIndex, exp) {
    str = str.substring(0, leftIndex);
    var rev = '';
    for (var i = str.length - 1; i >= 0; i--) {
        rev += str[i];
    }
    var arr = rev.split(exp);
    return (Array.isArray(arr) && arr[0]) ? arr[0] : '';
};
exports.strMatchLen = function(str, regex, i) {
    var matches = str.match(regex);
    i = parseInt(i);
    i = isNaN(i) ? 0 : i;
    return (Array.isArray(matches) && matches[i]) ? matches[i].length : 0;
};
