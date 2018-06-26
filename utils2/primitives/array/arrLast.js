import $global from '../../global';

export default function $arrLast(arr) {
    return arr[arr.length - 1] || null;
}
$global.$arrLast = $arrLast;
