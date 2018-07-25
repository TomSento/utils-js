import $global from '../../global';

export default function $objKeys(obj) {
    var keys = [];
    var k;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
}
$global.$objKeys = $objKeys;
