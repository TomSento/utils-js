import $global from '../global';

$global.$import = function(k) {
    return $global.$exports[k] || null;
};
