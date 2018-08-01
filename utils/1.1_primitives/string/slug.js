String.prototype.$slug = function(max) {
    max = max || 60;
    var self = this.trim().toLowerCase().$removeDiacritics();
    var builder = '';
    var length = self.length;
    for (var i = 0; i < length; i++) {
        var c = self[i];
        var code = self.charCodeAt(i);
        if (builder.length >= max) {
            break;
        }
        if (code > 31 && code < 48) {
            if (builder[builder.length - 1] !== '-') {
                builder += '-';
            }
            continue;
        }
        if ((code > 47 && code < 58) || (code > 94 && code < 123)) {
            builder += c;
        }
    }
    var l = builder.length - 1;
    return builder[l] === '-' ? builder.substring(0, l) : builder;
};
