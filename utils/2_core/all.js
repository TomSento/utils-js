function all(arr, fn, next) { // ---------------------------------------------> BASED ON: https://github.com/paulmillr/async-each
    if (!Array.isArray(arr)) {
        throw new Error('api-arr');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    if (next === undefined) {
        next = Function.prototype; // ----------------------------------------> NOOP
    }
    if (typeof(next) !== 'function') {
        throw new Error('api-next');
    }
    var l = arr.length;
    if (l === 0) {
        return next(null, arr); // -------------------------------------------> RETURN EMPTY ARRAY
    }
    var failed = false;
    var results = new Array(l);
    var pending = l;
    arr.forEach(function(arg, i) {
        fn(arg, function(err, result) {
            if (failed) {
                return;
            }
            if (err) {
                failed = true;
                return next(err);
            }
            results[i] = result;
            pending--;
            if (pending === 0) {
                return next(null, results);
            }
        });
    });
}
if (window) {
    if (!window.Cor) window.Cor = {};
    window.Cor.all = all;
}
