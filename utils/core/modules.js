exports.SETMODULE = function(k, fn) {
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    var Co = function() {
        var self = this;
        self.fns = {};
        self.registerFN = function(kk, func) {
            if (!kk || typeof(kk) !== 'string') {
                throw new Error('api-kk');
            }
            if (typeof(func) !== 'function') {
                throw new Error('api-func');
            }
            if (self.fns[kk]) {
                throw new Error('Duplicate function: "' + kk + '" in "' + k + '" module.');
            }
            self.fns[kk] = func;
        };
        fn(self.registerFN);
    };
    Co.prototype = {
        func: function(/* ...args */) {
            var self = this;
            var args = [].slice.call(arguments);
            var kk = args.shift();
            if (!kk || typeof(kk) !== 'string') {
                throw new Error('api-kk');
            }
            var func = self.fns[kk];
            if (!func) {
                throw new Error('Function: "' + kk + '" in "' + k + '" module was not found.');
            }
            return func.apply(null, args);
        }
    };
    var cache = exports.malloc('__MODULE');
    if (cache(k)) {
        throw new Error('Duplicate module: "' + k + '".');
    }
    cache(k, new Co());
};
exports.MODULE = function(k) {
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    var cache = exports.malloc('__MODULE');
    return cache(k) || null;
};
