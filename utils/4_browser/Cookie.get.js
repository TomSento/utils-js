// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_2_Get_a_sample_cookie_named_test2
var Cookie = {
    get: function(k) {
        if (!k || typeof(k) !== 'string') {
            throw new Error('api-k');
        }
        var str = document.cookie;
        var i = 0;
        while (i < str.length) {
            var j = str.indexOf('=', i + 1);
            if (j === -1) {
                return undefined;
            }
            var end = str.indexOf(';', j + 1);
            if (end === -1) {
                end = str.length;
            }
            var key = str.slice(i, j).trim();
            if (key === k) {
                return str.slice(j + 1, end);
            }
            i = end + 1;
        }
        return undefined;
    }
};
$export('<Cookie>', Cookie);
