String.prototype.fmt = function(/* ...args */) {
    var args = arguments;
    return this.replace(/\{\d+\}/g, function(text) {
        var value = args[+text.substring(1, text.length - 1)];
        return value === null ? '' : value;
    });
};
