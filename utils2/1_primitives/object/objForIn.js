import $global from '../../global';

export default function $objForIn(obj, fn) {
    var i = 0;
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            fn(k, obj[k], i);
            i++;
        }
    }
}
$global.$objForIn = $objForIn;
