exports.Schema = function(fn) {
    var Co = function(fn) {
        this.rule = {};
        this.prefix = '';
        this.__control = null;
        fn.apply(null, [
            attr.bind(this),
            attrError.bind(this),
            attrPrepare.bind(this),
            attrValidate.bind(this),
            func.bind(this),
            funcError.bind(this),
            setPrefix.bind(this)
        ]);
    };
    Co.prototype = {
        prepareAndValidate: function(obj, lan) { // Can be called without normalize.
            if (!obj || typeof(obj) !== 'object') {
                throw new Error('invalidParameter');
            }
            var eb = new exports.ErrorBuilder();
            for (var k in this.rule) {
                if (this.rule.hasOwnProperty(k)) {
                    var v = obj[k];
                    var rule = this.rule[k];
                    var mes = rule.message[lan] || rule.message['default'] || ('Invalid property "' + k + '".');
                    if (rule.prepare) {
                        v = rule.prepare(v, obj);
                        obj[k] = v;
                    }
                    var act = Object.prototype.toString.call(v);
                    var mat = (act === rule.type);
                    if (rule.validate && !rule.validate(v, mat, obj, act, rule.type)) {
                        eb.push(exports.error(this.prefix + k, mes));
                    }
                }
            }
            return eb;
        },
        /**
         * Does not validates.
         * In case of type missmatch assigns empty value.
         * In case of empty value use normalized empty value.
         *
         * - (nonExisting|typeMissmatch) attr {String|Object|Date|Number} -> null
         * - (nonExisting|typeMissmatch) attr {Array} -> []
         * - (nonExisting|typeMissmatch) func -> function() {}
         */
        normalize: function(obj) {
            var norm = {};
            for (var k in this.rule) {
                if (this.rule.hasOwnProperty(k)) {
                    var rule = this.rule[k];
                    var val = obj[k];
                    var typ = Object.prototype.toString.call(val);
                    if (!val || typ !== rule.type) {
                        if (rule.type === '[object Array]') {
                            norm[k] = [];
                        }
                        else if (rule.type == '[object Function]') {
                            norm[k] = function() {};
                        }
                        else {
                            norm[k] = null;
                        }
                    }
                    else {
                        norm[k] = val;
                    }
                }
            }
            return norm;
        }
    };
    function attr(name, type) { // Starts attribute definition
        if (!name || typeof(name) !== 'string') {
            throw new Error('invalidParameter');
        }
        type = strType(type);
        if (!type) {
            throw new Error('invalidParameter');
        }
        this.__control = name;
        this.rule[this.__control] = {
            type: type,
            message: {
                default: 'Invalid attribute "' + name + '".'
            }
        };
    }
    function func(name) { // Starts function definition
        if (!name || typeof(name) !== 'string') {
            throw new Error('invalidParameter');
        }
        this.__control = name;
        this.rule[this.__control] = {
            type: '[object Function]',
            message: {
                default: 'Invalid function "' + name + '".'
            }
        };
    }
    var attrError = funcError = function(a, b) { // Sets default or localized error message.
        if (!a || typeof(a) !== 'string') {
            throw new Error('invalidParameter');
        }
        if (b && typeof(b) !== 'string') {
            throw new Error('invalidParameter');
        }
        var lan = (a && b) ? a : 'default';
        var mes = (a && b) ? b : a;
        if (!this.rule[this.__control]) {
            throw new Error('invalidOrder');
        }
        if (!this.rule[this.__control].message) {
            this.rule[this.__control].message = {};
        }
        this.rule[this.__control].message[lan] = mes;
    };
    function attrPrepare(fn) {
        if (!fn || typeof(fn) !== 'function') {
            throw new Error('invalidParameter');
        }
        if (!this.rule[this.__control]) {
            throw new Error('invalidOrder');
        }
        this.rule[this.__control].prepare = fn;
    }
    function attrValidate(fn) {
        if (!fn || typeof(fn) !== 'function') {
            throw new Error('invalidParameter');
        }
        if (!this.rule[this.__control]) {
            throw new Error('invalidOrder');
        }
        this.rule[this.__control].validate = fn;
    }
    function strType(type) {
        if (type === Number) {
            return '[object Number]';
        }
        else if (type === String) {
            return '[object String]';
        }
        else if (type === Array) {
            return '[object Array]';
        }
        else if (type === Date) {
            return '[object Date]';
        }
        else if (type === Object) {
            return '[object Object]';
        }
        else if (type === Boolean) {
            return '[object Boolean]';
        }
        else {
            null;
        }
    }
    function setPrefix(prefix) {
        this.prefix = prefix;
    }
    return new Co(fn);
};
