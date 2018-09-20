String.prototype.slug = function(max) {
    max = max || 60;
    var self = this.trim().toLowerCase().removeDiacritics();
    var b = '';
    var length = self.length;
    for (var i = 0; i < length; i++) {
        var c = self[i];
        var code = self.charCodeAt(i);
        if (b.length >= max) {
            break;
        }
        if (code > 31 && code < 48) {
            if (b.length > 0 && b[b.length - 1] !== '-') {
                b += '-';
            }
            continue;
        }
        if ((code > 47 && code < 58) || (code > 94 && code < 123)) {
            b += c;
        }
    }
    var l = b.length - 1;
    return b[l] === '-' ? b.substring(0, l) : b;
};
