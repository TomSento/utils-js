import $global from '../../global';
import $malloc from '../../0_internal/malloc';

export default function $logPrefix(str) {
    var c = $malloc('__LOG');
    c('prefix', str);
}
$global.$logPrefix = $logPrefix;
