var $global = require('../global')();

function $toDebugStr(/* ...args */) {
    var str = '';
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) {
            if (typeof(arg) === 'object' || Array.isArray(arg)) {
                if (Array.isArray(arg)) {
                    str += 'Array(' + arg.length + '): \n';
                }
                else if (typeof(arg) === 'object') {
                    str += 'Object: \n';
                }
                str += JSON.stringify(arg, null, '    ');
                str += '\n';
            }
            else {
                str += (i > 0 ? ' ' : '') + arg;
            }
        }
        else {
            str += (i > 0 ? ' ' : '') + arg;
        }
    }
    return str;
}

module.exports = $toDebugStr;
$global.$toDebugStr = $toDebugStr;
