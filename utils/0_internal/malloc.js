import $global from '../global';

export default function malloc(scope) {
    if (!scope || typeof(scope) !== 'string') {
        throw new Error('api-scope');
    }
    if (!$global.$cache) {
        $global.$cache = {};
    }
    if (!$global.$cache[scope]) {
        $global.$cache[scope] = {};
    }
    var obj = $global.$cache[scope];
    return function(k, v) {
        if (typeof(k) !== 'string') {
            throw new Error('api-k');
        }
        if (v === undefined) {
            return obj[k];
        }
        obj[k] = v;
    };
}
$global.malloc = malloc;
