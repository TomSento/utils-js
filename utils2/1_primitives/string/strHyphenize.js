import $global from '../../global';

export default function $strHyphenize(str) {
    if (typeof(str) !== 'string') {
        return null;
    }
    return str.replace(/\B([A-Z])/g, function(g) {
        return ('-' + g[0]);
    }).toLowerCase();
}
$global.$strHyphenize = $strHyphenize;
