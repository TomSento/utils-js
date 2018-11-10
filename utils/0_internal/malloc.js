import world from '../world';

export default function malloc(scope) {
    if (!scope || typeof(scope) !== 'string') {
        throw new Error('api-scope');
    }
    if (!world.$cache) {
        world.$cache = {};
    }
    if (!world.$cache[scope]) {
        world.$cache[scope] = {};
    }
    var obj = world.$cache[scope];
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
world.malloc = malloc;
