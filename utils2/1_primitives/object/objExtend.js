import $global from '../../global';
import $objClone from './objClone';

export default function $objExtend(base, obj, rewrite) {
    if (!base || !obj) {
        return base;
    }
    if (typeof(base) !== 'object' || typeof(obj) !== 'object') {
        return base;
    }
    if (rewrite === undefined) {
        rewrite = true;
    }
    var keys = Object.keys(obj);
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        if (rewrite || base[key] === undefined) {
            base[key] = $objClone(obj[key]);
        }
    }
    return base;
}
$global.$objExtend = $objExtend;
