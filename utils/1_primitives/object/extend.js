import world from '../../world';
import clone from './clone';

export default function extend(objA, objB, rewrite) {
    if (!objA || typeof(objA) !== 'object') {
        throw new Error('api-objA');
    }
    if (!objB || typeof(objB) !== 'object') {
        throw new Error('api-objB');
    }
    if (rewrite === undefined) {
        rewrite = true;
    }
    var keys = Object.keys(objB);
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        if (rewrite || objA[key] === undefined) {
            objA[key] = clone(objB[key]);
        }
    }
    return objA;
}
if (!world.Cor) world.Cor = {};
world.Cor.extend = extend;
