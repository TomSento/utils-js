Array.prototype.$remove = function(fn, v) { // -------------------------------> FROM TOTAL.JS
    var self = this;
    var isFN = typeof(fn) === 'function';
    var isV = v !== undefined;
    var arr = [];
    for (var i = 0, l = self.length; i < l; i++) {
        if (isFN) {
            if (!fn.call(self, self[i], i)) {
                arr.push(self[i]);
            }
            continue;
        }
        if (isV) {
            if (self[i] && self[i][fn] !== v) {
                arr.push(self[i]);
            }
            continue;
        }
        if (self[i] !== fn) {
            arr.push(self[i]);
        }
    }
    return arr;
};
