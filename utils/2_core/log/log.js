import $global from '../../global';

$global.$log = function(/* ...args */) {
    var b = '';
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) {
            if (typeof(arg) === 'object' || Array.isArray(arg)) {
                if (Array.isArray(arg)) {
                    b += 'Array(' + arg.length + '): \n';
                }
                else if (typeof(arg) === 'object') {
                    b += 'Object: \n';
                }
                b += JSON.stringify(arg, null, '    ');
                b += '\n';
            }
            else {
                b += (i > 0 ? ' ' : '') + arg;
            }
        }
        else {
            b += (i > 0 ? ' ' : '') + arg;
        }
    }
    console.log(b); // eslint-disable-line no-console
};
