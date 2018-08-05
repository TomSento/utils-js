import $global from '../global';

export default function $uid2() {
    return [Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8)].join('-');
}
$global.$uid2 = $uid2;
