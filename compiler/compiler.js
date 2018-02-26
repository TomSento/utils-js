var fs = require('fs');
var path = require('path');
var v = require('../package.json').version;

exports.compileUtils = function(version, filePaths, accessVariable, keys, out) {
    if (version && v !== version) {
        throw new Error('versionMismatch');
    }
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
        throw new Error('invalidParameter');
    }
    if (!accessVariable || typeof(accessVariable) !== 'string') {
        throw new Error('invalidParameter');
    }
    if (keys && !Array.isArray(keys)) {
        throw new Error('invalidParameter');
    }
    if (!out || typeof(out) !== 'string') {
        throw new Error('invalidParameter');
    }
    var start = Date.now();
    filePaths = normalizePaths(filePaths);
    var o = toSingleObj(filePaths);
    var accKeys = [];
    var b = toBundleStr(o, keys, accessVariable, accKeys);
    var code = fs.readFileSync(path.join(__dirname, 'template.js'), 'utf8');
    code = code.replace(/ACCESS_VAR/g, accessVariable);
    code = replaceUtils(code, b);
    code = code.replace(/\{0\}/, v);
    code = code.replace(/\{1\}/, accKeys.join(','));
    fs.writeFileSync(out, code);
    endLog(out, start, code);
};
function replaceUtils(code, utils) { // CODE CAN CONTAIN SPECIAL CHARS LIKE $ WHICH HAVE TO BE REPLACED WITH $$, THEREFORE SAFER AND SIMPLER SPLIT METHOD IS USED.
    var arr = code.split(/^\s*UTILS/m);
    if (!Array.isArray(arr) || arr.length !== 2) {
        throw new Error("Missing 'UTILS' in template.");
    }
    return [arr[0], utils, arr[1]].join('');
}
function normalizePaths(filePaths) {
    return filePaths.map(function(filePath) {
        return path.resolve(filePath);
    });
}
function endLog(out, start, code) {
    var s = Buffer.byteLength(code, 'utf8');
    s = (s / 1000).toFixed(1);
    var t = (Date.now() - start);
    console.log(out + ' \t' + s + 'kB\t ' + t + 'ms'); // eslint-disable-line no-console
}
function toSingleObj(filePaths) {
    var o = {};
    filePaths.forEach(function(filePath) {
        var utils = require(filePath);
        for (var k in utils) {
            if (Object.hasOwnProperty.call(utils, k)) {
                if (o[k]) {
                    throw new Error("Duplicate implementation: '" + k + "'.");
                }
                var v = utils[k];
                if (v) {
                    o[k] = v;
                }
                else {
                    throw new Error("Implementation for: '" + k + "' doesn't exist.");
                }
            }
        }
    });
    return o;
}
function toBundleStr(obj, keys, accessVariable, accKeys) {
    var b = '';
    var dup = {};
    if (Array.isArray(keys) && keys.length > 0) {
        keys.forEach(function(k) {
            if (!obj[k]) {
                throw new Error("Implementation for: '" + k + "' doesn't exist.");
            }
            if (dup[k]) {
                throw new Error("Duplicate key in command: '" + k + "'.");
            }
            dup[k] = true;
        });
    }
    for (var k in obj) {
        if (Object.hasOwnProperty.call(obj, k)) {
            if (Array.isArray(keys) && keys.indexOf(k) === -1) {
                continue;
            }
            accKeys.push(k);
            var v = obj[k];
            b += accessVariable + '.' + k + ' = ' + compileModuleValue(k, v, accessVariable) + ';\n';
        }
    }
    return b ? b.slice(0, -1) : '';
}
function compileModuleValue(key, value, accessVariable) {
    if (!value) {
        return value;
    }
    if (typeof(value) === 'function') {
        return stringifyScript(fnToStr(key, value, accessVariable), accessVariable);
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
        if (obj.hasOwnProperty(k)) {
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
function fnToStr(key, fn, accessVariable) {
    var b = fn.toString();
    var len = Object.keys(fn.prototype).length;
    if (len > 0) {
        var proto = '';
        for (var k in fn.prototype) {
            if (fn.prototype.hasOwnProperty(k)) {
                var v = fn.prototype[k];
                proto += k + ':' + v + ',';
            }
        }
        if (proto) {
            proto = proto.slice(0, -1);
            b += ';' + accessVariable + '.' + key + '.prototype={' + proto + '}';
        }
    }
    return b;
}
