import $global from '../../global';

export default function $arrFirst(arr) {
    return arr[0] || null;
}
$global.$arrFirst = $arrFirst;
