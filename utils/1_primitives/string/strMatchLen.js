import $global from '../../global';

export default function $strMatchLen(str, exp, i) {
    var matches = str.match(exp);
    i = parseInt(i);
    i = isNaN(i) ? 0 : i;
    return (Array.isArray(matches) && matches[i]) ? matches[i].length : 0;
}
$global.$strMatchLen = $strMatchLen;
