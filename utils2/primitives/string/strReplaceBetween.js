import $global from '../../global';

export default function $strReplaceBetween(str, i, j, part) {
    return str.substring(0, i) + part + str.substring(j);
}
$global.$strReplaceBetween = $strReplaceBetween;
