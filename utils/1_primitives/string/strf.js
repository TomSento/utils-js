import $global from '../../global';

export default function $strf(str, args) { // --------------------------------> FORMAT STRING
    return str.replace(/\{\d+\}/g, function(text) {
        var value = args[+text.substring(1, text.length - 1)];
        return value === null ? '' : value;
    });
}
$global.$strf = $strf;
