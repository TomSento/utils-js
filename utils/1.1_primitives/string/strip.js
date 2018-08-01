var DECODE_HTML_CHARACTERS = {
    'nbsp': ' ',
    'amp': '&',
    'quot': '"',
    'lt': '<',
    'gt': '>'
};

String.prototype.$strip = function() {
    var self = this.replace(/<\/?[^>]+(>|$)/g, '');
    return self.replace(/&(nbsp|amp|quot|lt|gt);/g, function(match, k) {
        return DECODE_HTML_CHARACTERS[k] || k;
    });
};
