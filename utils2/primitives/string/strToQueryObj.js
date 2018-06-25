function $strToQueryObj(url) { // BASED ON: https://stackoverflow.com/a/32354921/6135126
    url = url.replace(/\+/g, ' ');
    var exp = /[?&]([^=]+)=([^&]*)/g;
    var o = {};
    var m = null;
    while (m = exp.exec(url)) {
        var k = m[1] ? decodeURIComponent(m[1]) : '';
        var v = m[2] ? decodeURIComponent(m[2]) : '';
        if (k) {
            o[k] = v;
        }
    }
    return o;
}
