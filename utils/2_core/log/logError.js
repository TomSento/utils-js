import $global from '../../global';
import $malloc from '../../0_internal/malloc';

export default function $logError(/* ...args */) {
    var cache = $malloc('__LOG');
    var args = [].slice.call(arguments);
    if (cache('prefix')) {
        args.unshift(cache('prefix') + ':');
    }
    console.error.apply(null, args); // eslint-disable-line no-console
}
$global.$logError = $logError;
