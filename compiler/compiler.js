var fs = require('fs');
var path = require('path');

var KEYS = [];
exports.compileUtils = function(filePaths, accessVariable, keys, out, exceptKeys) {
    if (Array.isArray(keys)) {
        keys = unique(keys);
        KEYS = keys;
    }
    var start = Date.now();
    if (!Array.isArray(filePaths) || filePaths.length == 0) {
        return;
    }
    filePaths = filePaths.map(function(str) {
        return path.resolve(str);
    });
    var fileStats = getFileStatsWithAtLeastOneKey(filePaths, keys);
    var str = '';
    fileStats.forEach(function(fileStat, fileIndex) {
        var lastFile = (fileStats.length === fileIndex + 1);
        str += compileUtilsFromFile(fileStat.filePath, fileStat.keyCount, accessVariable, lastFile, keys, exceptKeys);
    });
    var code = fs.readFileSync(path.join(__dirname, 'template.js'), 'utf8');
    code = code.replace(/ACCESS_VAR/g, accessVariable);
    code = code.replace(/^\s*UTILS/m, str);
    fs.writeFileSync(out, code);
    endLog(out, start, code);
};
function endLog(out, start, code) {
    var s = Buffer.byteLength(code, 'utf8');
    s = (s / 1000).toFixed(1);
    var t = (Date.now() - start);
    console.log(out + ' \t' + s + 'kB\t ' + t + 'ms'); // eslint-disable-line no-console
}
function getFileStatsWithAtLeastOneKey(filePaths, keys) {
    var arr = [];
    filePaths.forEach(function(path) {
        var utils = require(path); // eslint-disable-line global-require,import/no-dynamic-require
        var len = Array.isArray(keys) ? Object.keys(utils).filter(function(k) {
            return (keys.indexOf(k) >= 0);
        }).length : Object.keys(utils).length;
        if (len > 0) {
            arr.push({
                filePath: path,
                keyCount: len
            });
        }
    });
    return arr;
}
function compileUtilsFromFile(filePath, keyCount, accessVariable, lastFile, keys, exceptKeys) {
    var temp = '';
    var utils = require(filePath); // eslint-disable-line global-require,import/no-dynamic-require
    var i = 1;
    for (var k in utils) {
        if (!Object.prototype.hasOwnProperty.call(utils, k)) {
            continue;
        }
        if (Array.isArray(keys) && keys.indexOf(k) < 0) {
            continue;
        }
        if (Array.isArray(exceptKeys) && exceptKeys.indexOf(k) >= 0) {
            continue;
        }
        var v = utils[k];
        temp += '    ' + k + ': ' + compileModuleValue(k, v, accessVariable) + ((i === keyCount && lastFile) ? '' : ',\n');
        i++;
    }
    return temp;
}
function isSpecialProperty(key) {
    return process.env[key] || ['utilsCompileCMD'].indexOf(key) >= 0;
}
function getSpecialProperty(key) {
    var v = '';
    if (key == 'utilsCompileCMD') {
        v = composeCMD();
    }
    else {
        v = process.env[key] || '';
    }
    return v ? ("'" + v + "'") : "''";
}
function composeCMD() {
    var arr = [];
    KEYS.forEach(function(key) {
        var v = process.env[key];
        if (v) {
            arr.push(key + '=' + v);
        }
    });
    if (process.env.KEYS) {
        arr.push('KEYS=' + unique(process.env.KEYS.split(/\s*,\s*/)).join(','));
    }
    arr.push('node compile');
    return arr.join(' ');
}
function compileModuleValue(key, value, accessVariable) {
    if (isSpecialProperty(key)) {
        return getSpecialProperty(key);
    }
    if (!value) {
        return value;
    }
    if (typeof(value) === 'function') {
        return stringifyScript(value.toString(), accessVariable);
    }
    else if (typeof(value) === 'object') {
        return compileModuleObjectValue(value);
    }
    else if (typeof(value) === 'string') {
        return "'" + value + "'";
    }
    else if (typeof(value.toString) === 'function') {
        return '"' + value.toString() + '"';
    }
    return value;
}
function compileModuleObjectValue(obj, accessVariable) { // REKURZIA
    if (obj instanceof Date) {
        return obj.getTime();
    }
    var line = '{';
    var len = Object.keys(obj).length;
    var i = 0;
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            i++;
            var v = obj[k];
            v = compileModuleValue(k, v, accessVariable);
            line += k + ':' + v + (i == len ? '' : ',');
        }
    }
    return line + '}';
}
function stringifyScript(input, accessVariable) {
    var last = '';
    return ('\n' + input + '\n').replace(/(?:(^|[-+([{}=,:;!%^&*|?~]|\/(?![/*])|return|throw)(?:\s|\/\/[^\n]*\n|\/\*(?:[^*]|\*(?!\/))*\*\/)*(\/(?![/*])(?:\\[^\n]|[^[\n/\\]|\[(?:\\[^\n]|[^\]])+)+\/)|(^|'(?:\\[\s\S]|[^\n'\\])*'|"(?:\\[\s\S]|[^\n"\\])*"|([0-9A-Za-z_$]+)|([-+]+)|.))(?:\s|\/\/[^\n]*\n|\/\*(?:[^*]|\*(?!\/))*\*\/)*/g, function(str, context, exp, result, word, operator) {
        if (word) {
            if (accessVariable && word == 'exports') {
                result = accessVariable;
            }
            result = (last == 'word' || last == 'return' ? ' ' : '') + result;
            last = (word == 'return' || word == 'throw' || word == 'break') ? 'return' : 'word';
        }
        else if (operator) {
            result = (last == operator.charAt(0) ? '\n' : '') + result;
            last = operator.charAt(0);
        }
        else {
            if (exp) {
                result = context + (context == '/' ? '\n' : '') + exp;
            }
            last = '';
        }
        return result;
    });
}
function unique(arr) {
    var temp = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var v = arr[i];
        if (temp.indexOf(v) === -1) {
            temp.push(v);
        }
    }
    return temp;
}
