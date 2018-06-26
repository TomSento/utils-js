import $global from '../../global';
import $Error from './Error';

export default function $ErrorBuilder(err) {
    if (err) {
        if (typeof(err) === 'string' || err instanceof Error) {
            this.errors = [new $Error(err)];
        }
        else if (err instanceof $Error) {
            this.errors = [err];
        }
        else if (Array.isArray(err)) {
            var len = err.length;
            var arr = [];
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var v = err[i];
                    if (v) {
                        if (v instanceof $Error) {
                            arr.push(v);
                        }
                        else if (v instanceof Error) {
                            arr.push(new $Error(v));
                        }
                        else {
                            throw new Error('api-err');
                        }
                    }
                    else {
                        throw new Error('api-err');
                    }
                }
            }
            this.errors = arr;
        }
        else if (typeof(err) === 'object' && Array.isArray(err.errors)) {
            this.errors = err.errors;
        }
        else {
            throw new Error('api-err');
        }
    }
    else {
        this.errors = [];
    }
}
$ErrorBuilder.prototype = {
    push: function(err) {
        if (err instanceof Error) {
            this.errors.push(new $Error(err.message));
            return this;
        }
        else if (err instanceof $Error) {
            this.errors.push(err);
            return this;
        }
        else {
            throw new Error('api-err');
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
$global.$ErrorBuilder = $ErrorBuilder;
