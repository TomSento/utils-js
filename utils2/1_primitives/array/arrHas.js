import $global from '../../global';

export default function $arrHas(arr, v) {
    return arr.indexOf(v) >= 0;
}
$global.$arrHas = $arrHas;
