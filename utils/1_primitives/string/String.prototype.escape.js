var ENCODE_HTML_CHARACTERS = {
    '&': 'amp',
    '\'': '#039',
    '"': 'quot',
    '<': 'lt',
    '>': 'gt'
};

String.prototype.escape = function() {
    return this.replace(/(&|'|"|<|>)/g, function(m, k) {
        return ('&' + ENCODE_HTML_CHARACTERS[k] + ';') || k;
    });
};
