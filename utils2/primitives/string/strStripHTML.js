function $strStripHTML(str) {
    str = typeof(str) === 'string' ? str.replace(/<\/?[^>]+(>|$)/g, '') : '';
    var map = {
        'nbsp': ' ',
        'amp': '&',
        'quot': '"',
        'lt': '<',
        'gt': '>'
    };
    return str.replace(/&(nbsp|amp|quot|lt|gt);/g, function(match, k) {
        return map[k] || k;
    });
}
