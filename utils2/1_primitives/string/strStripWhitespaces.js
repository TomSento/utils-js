import $global from '../../global';

export default function $strStripWhitespaces(str) {
    return typeof(str) === 'string' ? str.replace(/\s+/, '') : '';
}
$global.$strStripWhitespaces = $strStripWhitespaces;
