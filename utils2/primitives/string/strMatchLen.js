import $global from '../../global';

export default function $strMatchLen(str, regex, i) {
    var matches = str.match(regex);
    i = parseInt(i);
    i = isNaN(i) ? 0 : i;
    return (Array.isArray(matches) && matches[i]) ? matches[i].length : 0;
}
$global.$strMatchLen = $strMatchLen;
