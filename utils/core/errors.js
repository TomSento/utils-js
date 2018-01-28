/**
 * @param {String|Error} problem
 * @param {String} [message]
 * Error passed: Set error.id = problem.message.
 * String passed: Set error.id = problem.
 */
exports.error = function(problem, message) {
    var Co = function(problem, message) {
        if (!problem) {
            throw new Error('invalidParameter');
        }
        if (problem instanceof Error) {
            this.id = problem.message;
        }
        else if (typeof(problem) == 'string') {
            this.id = problem;
        }
        else {
            throw new Error('invalidParameter');
        }
        this.message = message || null;
    };
    Co.prototype = {
        log: function() {
            var str = this.id;
            if (this.message) {
                str += ': ' + this.message;
            }
            exports.logWarn(str);
        },
        throw: function() {
            throw new Error(this.id);
        },
        logAndThrow: function() {
            this.log();
            this.throw();
        },
        toString: function() {
            return JSON.stringify(this, null, '    ');
        }
    };
    return new Co(problem, message);
};
exports.ErrorBuilder = function(errors) {
    var Co = function(errors) {
        if (errors) {
            if (!Array.isArray(errors)) {
                throw new Error('invalidParameter');
            }
            for (var i = 0; i < errors.length; i++) {
                if (!errors[i] || !errors[i].id) {
                    throw new Error('invalidParameter');
                }
            }
        }
        this.errors = errors || [];
    };
    Co.prototype = {
        push: function(err) {
            if (err instanceof Error) {
                err = new exports.error(err.message);
            }
            this.errors.push(err);
        },
        remove: function(id) {
            var arr = this.errors;
            var i = -1;
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].id == id) {
                    i = j;
                }
            }
            if (i >= 0) {
                arr.splice(i, 1);
            }
        },
        clear: function() {
            this.errors = [];
        },
        first: function() {
            return this.errors[0] || null;
        },
        last: function() {
            return this.errors[this.errors.length - 1] || null;
        },
        toString: function() {
            return JSON.stringify(this, null, '    ');
        },
        hasError: function(id) {
            var arr = this.errors;
            if (id) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] && arr[i].id == id) {
                        return true;
                    }
                }
                return false;
            }
            return arr.length > 0;
        },
        throwFirst: function() {
            var len = this.errors.length;
            if (len == 0) {
                throw new Error('emptyErrorBuilder');
            }
            this.errors[0].throw();
        },
        logFirst: function() {
            var len = this.errors.length;
            if (len == 0) {
                throw new Error('emptyErrorBuilder');
            }
            this.errors[0].log();
        },
        logAndThrowFirst: function() {
            var len = this.errors.length;
            if (len == 0) {
                throw new Error('emptyErrorBuilder');
            }
            this.errors[0].logAndThrow();
        }
    };
    return new Co(errors);
};
