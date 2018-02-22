exports.procSerial = function() {
    var Co = function() {
        var self = this;
        self.queue = [];
        self.ctx = {};
    };
    Co.prototype.push = function(fn/* , ...args */) {
        var self = this;
        var args = (arguments && arguments.length > 0) ? [].slice.call(arguments, 1) : [];
        self.queue.push({
            fn: fn,
            args: args
        });
    };
    Co.prototype.run = function(endFN) {
        var self = this;
        (function loop(i, args) {
            var obj = self.queue[i];
            if (!obj) {
                return endFN && endFN.call(self.ctx, null);
            }
            if (i === 0 || (Array.isArray(obj.args) && obj.args.length > 0)) {
                obj.args.push(next);
                obj.fn.apply(self.ctx, obj.args);
            }
            else {
                args.push(next);
                obj.fn.apply(self.ctx, args);
            }
            function next(/* ...args */) {
                var args = (arguments && arguments.length > 0) ? [].slice.call(arguments) : [];
                var err = args.shift();
                if (err) {
                    return endFN && endFN.call(self.ctx, err);
                }
                if (typeof(setImmediate) === 'function') {
                    setImmediate(function() {
                        return loop(++i, args);
                    });
                }
                else {
                    return loop(++i, args);
                }
            }
        }(0));
    };
    return new Co();
};
