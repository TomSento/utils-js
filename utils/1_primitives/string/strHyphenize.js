import $global from '../../global';

export default function $strHyphenize(str) {
    if (typeof(str) !== 'string') {
        throw new Error('api-str');
    }
    return str.replace(/\B([A-Z])/g, function(g) {
        return ('-' + g[0]);
    }).toLowerCase();
}
$global.$strHyphenize = $strHyphenize;
