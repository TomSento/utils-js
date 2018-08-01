String.prototype.$hyphenize = function() {
    return this.replace(/\B([A-Z])/g, function(match) {
        return ('-' + match[0]);
    }).toLowerCase();
};
