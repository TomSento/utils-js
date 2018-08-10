function Schema(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        throw new Error('api-obj');
    }
    this.rule = {};
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            var tmp = obj[k][1];
            this.rule[k] = {
                msg: obj[k][0],
                prepare: tmp.prepare,
                validate: tmp.validate
            };
        }
    }
}
Schema.prototype = {
    prepareValidate: function(o) {
        if (Object.prototype.toString.call(o) !== '[object Object]') {
            throw new Error('api-o');
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
                    err[k] = rule.msg;
                }
            }
        }
        return err;
    },
    clean: function(o) {
        if (Object.prototype.toString.call(o) !== '[object Object]') {
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
    error: function(k) {
        if (!k || typeof(k) !== 'string') {
            throw new Error('api-k');
        }
        var rule = this.rule[k];
        if (!rule) {
            throw new Error('Property "' + k + '" not found.');
        }
        return rule.msg;
    }
};
$export('<Schema>', Schema);
