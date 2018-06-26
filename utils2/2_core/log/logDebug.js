import $global from '../../global';
import $malloc from '../../0_internal/malloc';
import $toDebugStr from '../../0_internal/toDebugStr';

export default function $logDebug(/* ...args */) {
    var cache = $malloc('__LOG');
    var args = [].slice.call(arguments);
    var log = $toDebugStr.apply(this, args);
    var prefix = cache('prefix') ? (cache('prefix') + ': ') : '';
    console.log(prefix + log); // eslint-disable-line no-console
}
$global.$logDebug = $logDebug;
