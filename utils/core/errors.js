/**
 * @param {String|Error} problem
 * @param {String} [message]
 * Error passed: Set error.id = problem.message.
 * String passed: Set error.id = problem.
 */
function Error2(problem, message) {
    if (problem) {
        if (problem instanceof Error) {
            this.id = problem.message;
            this.message = message || null;
        }
        else if (typeof(problem) === 'string') {
            this.id = problem;
            this.message = message || null;
        }
        else {
            throw new Error('invalidParameter');
        }
    }
    else {
        throw new Error('invalidParameter');
    }
}
Error2.prototype = {
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
exports.Error = Error2;
function ErrorBuilder(err) {
    if (err) {
        if (typeof(err) === 'string' || err instanceof Error) {
            this.errors = [new exports.Error(err)];
        }
        else if (err instanceof exports.Error) {
            this.errors = [err];
        }
        else if (Array.isArray(err)) {
            var len = err.length;
            var arr = [];
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var v = err[i];
                    if (v) {
                        if (v instanceof exports.Error) {
                            arr.push(v);
                        }
                        else if (v instanceof Error) {
                            arr.push(new exports.Error(v));
                        }
                        else {
                            throw new Error('invalidParameter');
                        }
                    }
                    else {
                        throw new Error('invalidParameter');
                    }
                }
            }
            this.errors = arr;
        }
        else if (typeof(err) === 'object' && Array.isArray(err.errors)) {
            this.errors = err.errors;
        }
        else {
            throw new Error('invalidParameter');
        }
    }
    else {
        this.errors = [];
    }
}
ErrorBuilder.prototype = {
    push: function(err) {
        if (err instanceof Error) {
            this.errors.push(new exports.Error(err.message));
            return this;
        }
        else if (err instanceof exports.Error) {
            this.errors.push(err);
            return this;
        }
        else {
            throw new Error('invalidParameter');
        }
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
exports.ErrorBuilder = ErrorBuilder;
