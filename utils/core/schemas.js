exports.SETSCHEMA = function(k, fn) {
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    function Schema(fn) {
        this.rule = {};
        this.prefix = '';
        this.currentKey = null;
        fn.apply(null, [
            attr.bind(this),
            attrError.bind(this),
            attrPrepare.bind(this),
            attrValidate.bind(this),
            setPrefix.bind(this)
        ]);
    }
    Schema.prototype = {
        prepareAndValidate: function(obj, lan) { // Can be called without normalize.
            if (!obj || typeof(obj) !== 'object') {
                throw new Error('api-obj');
            }
            if (lan && typeof(lan) !== 'string') {
                throw new Error('api-lan');
            }
            var eb = new exports.ErrorBuilder();
            for (var k in this.rule) {
                if (this.rule.hasOwnProperty(k)) {
                    var v = obj[k];
                    var rule = this.rule[k];
                    var typeMatch = false;
                    if (rule.prepare) {
                        typeMatch = (Object.prototype.toString.call(v) === rule.type);
                        v = rule.prepare(v, typeMatch, obj);
                        obj[k] = v;
                    }
                    typeMatch = (Object.prototype.toString.call(v) === rule.type);
                    if (rule.validate && !rule.validate(v, typeMatch, obj)) {
                        var mes = lan
                            ? (rule.message[lan.toUpperCase()] || rule.message['default'])
                            : rule.message['default'];
                        eb.push(new exports.Error(this.prefix + k, mes));
                    }
                }
            }
            return eb;
        },
        clean: function(obj) {
            if (!obj || typeof(obj) !== 'object') {
                throw new Error('api-obj');
            }
            var tmp = {};
            for (var k in this.rule) {
                if (this.rule.hasOwnProperty(k)) {
                    tmp[k] = obj[k];
                }
            }
            return tmp;
        },
        makeError: function(name, lan) {
            if (!name || typeof(name) !== 'string') {
                throw new Error('api-name');
            }
            if (lan && typeof(lan) !== 'string') {
                throw new Error('api-lan');
            }
            var rule = this.rule[name];
            if (!rule || !rule.message) {
                throw new Error('Missing field "' + name + '" in schema definition.');
            }
            var msg = lan
                ? (rule.message[lan.toUpperCase()] || rule.message['default'])
                : rule.message['default'];
            return new exports.Error(this.prefix + name, msg);
        }
    };
    function attr(name, type) { // Starts attribute definition
        if (!name || typeof(name) !== 'string') {
            throw new Error('api-name');
        }
        type = strType(type);
        if (!type) {
            throw new Error('api-type');
        }
        this.currentKey = name;
        this.rule[this.currentKey] = {
            type: type,
            message: {
                default: 'Invalid attribute "' + name + '".'
            }
        };
    }
    function attrError(a, b) { // Sets default or localized error message.
        if (!a || typeof(a) !== 'string') {
            throw new Error('api-a');
        }
        if (b && typeof(b) !== 'string') {
            throw new Error('api-b');
        }
        var lan = (a && b) ? a.toUpperCase() : 'default';
        var mes = (a && b) ? b : a;
        if (!this.rule[this.currentKey]) {
            throw new Error('invalidOrder');
        }
        if (!this.rule[this.currentKey].message) {
            this.rule[this.currentKey].message = {};
        }
        this.rule[this.currentKey].message[lan] = mes;
    }
    function attrPrepare(fn) {
        if (!fn || typeof(fn) !== 'function') {
            throw new Error('api-fn');
        }
        if (!this.rule[this.currentKey]) {
            throw new Error('invalidOrder');
        }
        this.rule[this.currentKey].prepare = fn;
    }
    function attrValidate(fn) {
        if (!fn || typeof(fn) !== 'function') {
            throw new Error('api-fn');
        }
        if (!this.rule[this.currentKey]) {
            throw new Error('invalidOrder');
        }
        this.rule[this.currentKey].validate = fn;
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
        else if (type === Function) {
            return '[object Function]';
        }
        else {
            return null;
        }
    }
    function setPrefix(prefix) {
        this.prefix = prefix;
    }
    var cache = exports.malloc('__SCHEMA');
    if (cache(k)) {
        throw new Error('Duplicate schema: "' + k + '".');
    }
    cache(k, new Schema(fn));
};
exports.SCHEMA = function(k) {
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    var cache = exports.malloc('__SCHEMA');
    return cache(k) || null;
};
