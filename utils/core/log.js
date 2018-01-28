/* eslint-disable no-console */
exports.logPrefix = function(str) {
    var c = exports.malloc('__LOG');
    c('prefix', str);
};
exports.logDebug = function(/* ...args */) {
    var cache = exports.malloc('__LOG');
    var args = [].slice.call(arguments);
    var log = exports.toDebugStr.apply(this, args);
    var prefix = cache('prefix') ? (cache('prefix') + ': ') : '';
    console.log(prefix + log);
};
exports.logWarn = function(/* ...args */) {
    var cache = exports.malloc('__LOG');
    var args = [].slice.call(arguments);
    if (cache('prefix')) {
        args.unshift(cache('prefix') + ':');
    }
    console.warn.apply(null, args);
};
exports.log = function(/* ...args */) {
    var cache = exports.malloc('__LOG');
    var args = [].slice.call(arguments);
    if (cache('prefix')) {
        args.unshift(cache('prefix') + ':');
    }
    console.log.apply(null, args);
};
