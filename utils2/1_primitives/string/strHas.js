import $global from '../../global';

export default function $strHas(str, v) {
    return str.includes(v);
}
$global.$strHas = $strHas;
