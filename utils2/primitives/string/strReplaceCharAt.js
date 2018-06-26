import $global from '../../global';

export default function $strReplaceCharAt(str, i, ch) {
    return str.substr(0, i) + ch + str.substr(i + ch.length);
}
$global.$strReplaceCharAt = $strReplaceCharAt;
