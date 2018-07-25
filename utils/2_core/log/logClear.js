import $global from '../../global';

export default function $logClear() {
    console.clear(); // eslint-disable-line no-console
}
$global.$logClear = $logClear;
