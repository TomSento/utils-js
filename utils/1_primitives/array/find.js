Array.prototype.$find = function(fn, v) {
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    for (var i = 0, len = this.length; i < len; i++) {
        if (isFN) {
            if (fn(this[i], i)) {
                return this[i];
            }
            continue;
        }
        if (isV) {
            if (this[i] && this[i][fn] === v) {
                return this[i];
            }
            continue;
        }
        if (this[i] === fn) {
            return this[i];
        }
    }
    return null;
};
