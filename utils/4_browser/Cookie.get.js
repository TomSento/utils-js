// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_2_Get_a_sample_cookie_named_test2
var Cookie = {
    get: function(k) {
        if (!k || typeof(k) !== 'string') {
            throw new Error('api-k');
        }
        var i = document.cookie.lastIndexOf('; ' + k + '=');
        if (i === -1 && !document.cookie.startsWith(k + '=')) {
            return undefined;
        }
        var exp = new RegExp('(?:(?:^|.*;\\s*)' + k + '\\s*=\\s*([^;]*).*$)|^.*$');
        return document.cookie.replace(exp, '$1');
    }
};
$export('<Cookie>', Cookie);
