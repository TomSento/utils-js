import $global from '../../global';

/**
 * @param {String|Error} problem
 * @param {String} [message]
 * Error passed: Set error.id = problem.message.
 * String passed: Set error.id = problem.
 */
export default function $Error(problem, message) {
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
            throw new Error('api-problem');
        }
    }
    else {
        throw new Error('api-problem');
    }
}
$Error.prototype = {
    log: function() {
        var msg = this.message ? (this.id + ' - ' + this.message) : this.id;
        console.warn(msg); // eslint-disable-line no-console
    },
    throw: function() {
        throw new Error(this.id);
    },
    logAndThrow: function() {
        this.log();
        this.throw();
    },
    toNative: function() {
        var msg = this.message ? (this.id + ' - ' + this.message) : this.id;
        return new Error(msg);
    },
    toString: function() {
        return JSON.stringify(this, null, '    ');
    }
};
$global.$Error = $Error;
