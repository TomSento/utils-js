import $global from '../../global';

export default function $strFormat(str, args) {
    return str.replace(/\{\d+\}/g, function(text) {
        var value = args[+text.substring(1, text.length - 1)];
        return value === null ? '' : value;
    });
}
$global.$strFormat = $strFormat;
