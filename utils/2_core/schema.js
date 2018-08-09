function Schema(defaultLanguage, obj) {
    if (!defaultLanguage || typeof(defaultLanguage) !== 'string') {
        throw new Error('api-defaultLanguage');
    }
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        throw new Error('api-obj');
    }
    this.defaultLanguage = defaultLanguage.toUpperCase();
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
    prepareValidate: function(o, lan) {
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
        var err = {};
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
                    err[k] = rule.msg[lan || this.defaultLanguage] || ('Invalid "' + k + '".');
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
    error: function(k, lan) {
        if (!k || typeof(k) !== 'string') {
            throw new Error('api-k');
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
        return rule.msg[lan || this.defaultLanguage] || ('Invalid "' + k + '".');
    }
};
$export('<Schema>', Schema);
