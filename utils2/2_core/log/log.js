import $global from '../../global';
import $malloc from '../../0_internal/malloc';

export default function $log(/* ...args */) {
    var cache = $malloc('__LOG');
    var args = [].slice.call(arguments);
    if (cache('prefix')) {
        args.unshift(cache('prefix') + ':');
    }
    console.log.apply(null, args); // eslint-disable-line no-console
}
$global.$log = $log;
