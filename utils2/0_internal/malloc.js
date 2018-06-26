import $global from '../global';

export default function $malloc(prefix) {
    if (!$global.$$cache) {
        $global.$$cache = {};
    }
    if (!$global.$$cache[prefix]) {
        $global.$$cache[prefix] = {};
    }
    var obj = $global.$$cache[prefix];
    return function(k, v) {
        if (typeof(k) === 'object' && v === undefined) {
            obj = k;
            return;
        }
        if (k === undefined && v === undefined) {
            return obj;
        }
        if (typeof(k) !== 'string') {
            throw new Error('api-k');
        }
        if (v === undefined) {
            return obj[k];
        }
        else {
            obj[k] = v;
        }
    };
}
$global.$malloc = $malloc;
