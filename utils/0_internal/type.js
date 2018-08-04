import $global from '../global';

$global.$type = function(v) {
    return Object.prototype.toString.call(v).replace(/^\[object\s(.+)\]$/, '$1').toLowerCase();
};
