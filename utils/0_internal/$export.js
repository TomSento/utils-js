import $global from '../global';

$global.$export = function(k, v) {
    if (!$global.$exports) {
        $global.$exports = {};
    }
    $global.$exports[k] = v;
};
