String.prototype.$reverse = function() {
    var rev = '';
    for (var i = this.length - 1; i >= 0; i--) {
        rev += this[i];
    }
    return rev;
};
