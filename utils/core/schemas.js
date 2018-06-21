exports.SCHEMA = function(name, defaultLanguage, obj) {
    if (typeof(name) !== 'string') {
        throw new Error('api-name');
    }
    if (defaultLanguage !== undefined && typeof(defaultLanguage) !== 'string') {
        throw new Error('api-defaultLanguage');
    }
    if (obj !== undefined && typeof(obj) !== 'object') {
        throw new Error('api-obj');
    }
    var cache = exports.malloc('__SCHEMA');
    if (defaultLanguage === undefined && obj === undefined) {
        return cache(name) || null;
    }
    else {
        defaultLanguage = defaultLanguage.toUpperCase();
    }
    function Schema() {
        this.name = name;
        this.rule = {};
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                var tmp = {
                    type: strType(obj[k][0]),
                    msg: {}
                };
                var rule = obj[k][1];
                for (var kk in rule) {
                    if (rule.hasOwnProperty(kk)) {
                        if (['prepare', 'validate'].indexOf(kk) >= 0) {
                            tmp[kk] = rule[kk];
                        }
                        else {
                            tmp.msg[kk] = rule[kk];
                        }
                    }
                }
                this.rule[k] = tmp;
            }
        }
        function strType(type) {
            switch (type) {
                case Number:
                    return '[object Number]';
                case String:
                    return '[object String]';
                case Array:
                    return '[object Array]';
                case Date:
                    return '[object Date]';
                case Object:
                    return '[object Object]';
                case Boolean:
                    return '[object Boolean]';
                case Function:
                    return '[object Function]';
            }
            return null;
        }
    }
    Schema.prototype = {
        prepareAndValidate: function(o, lan) {
            if (!o || typeof(o) !== 'object') {
                throw new Error('api-o');
            }
            if (lan) {
                if (typeof(lan) !== 'string') {
                    throw new Error('api-lan');
                }
                lan = lan.toUpperCase();
            }
            var typeMatch;
            var err = new exports.ErrorBuilder();
            for (var k in this.rule) {
                if (this.rule.hasOwnProperty(k)) {
                    var rule = this.rule[k];
                    var v = o[k];
                    if (typeof(rule.prepare) === 'function') {
                        typeMatch = (Object.prototype.toString.call(v) === rule.type);
                        v = rule.prepare(v, typeMatch, o);
                        o[k] = v;
                    }
                    typeMatch = (Object.prototype.toString.call(v) === rule.type);
                    if (rule.validate && !rule.validate(v, typeMatch, o)) {
                        err.push(new exports.Error(name + '.' + k, (rule.msg[lan || defaultLanguage] || ('Invalid "' + k + '".'))));
                    }
                }
            }
            return err;
        },
        clean: function(o) {
            if (!o || typeof(o) !== 'object') {
                throw new Error('api-o');
            }
            var tmp = {};
            for (var k in this.rule) {
                if (this.rule.hasOwnProperty(k)) {
                    tmp[k] = o[k];
                }
            }
            return tmp;
        },
        makeError: function(k, lan) {
            if (!k || typeof(k) !== 'string') {
                throw new Error('api-name');
            }
            if (lan) {
                if (typeof(lan) !== 'string') {
                    throw new Error('api-lan');
                }
                lan = lan.toUpperCase();
            }
            var rule = this.rule[k];
            if (!rule || !rule.msg) {
                throw new Error('Property "' + k + '" not found.');
            }
            return new exports.Error(name + '.' + k, (rule.msg[lan || defaultLanguage] || ('Invalid "' + k + '".')));
        }
    };
    cache(name, new Schema());
};
