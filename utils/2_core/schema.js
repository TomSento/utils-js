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
                msg: {}
            };
            var rule = obj[k];
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
        var err = {};
        for (var k in this.rule) {
            if (this.rule.hasOwnProperty(k)) {
                var rule = this.rule[k];
                var v = o[k];
                if (typeof(rule.prepare) === 'function') {
                    v = rule.prepare(v, o);
                    o[k] = v;
                }
                if (rule.validate && !rule.validate(v, o)) {
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
