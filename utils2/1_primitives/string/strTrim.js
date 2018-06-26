import $global from '../../global';

export default function $strTrim(str, ch) {
    ch = ch || '\\s';
    var exp = new RegExp('^' + ch + '+|' + ch + '+$', 'gm');
    return str.replace(exp, '');
}
$global.$strTrim = $strTrim;
