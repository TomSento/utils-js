Array.prototype.findIndex = function(fn, v) {
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    for (var i = 0, len = this.length; i < len; i++) {
        if (isFN) {
            if (fn(this[i], i)) {
                return i;
            }
            continue;
        }
        if (isV) {
            if (this[i] && this[i][fn] === v) {
                return i;
            }
            continue;
        }
        if (this[i] === fn) {
            return i;
        }
    }
    return -1;
};
