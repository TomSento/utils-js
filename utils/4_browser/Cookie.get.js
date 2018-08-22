// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_2_Get_a_sample_cookie_named_test2
var Cookie = {
    get: function(k) {
        var exp = new RegExp('(?:(?:^|.*;\\s*)' + k + '\\s*=\\s*([^;]*).*$)|^.*$');
        return document.cookie.replace(exp, '$1');
    }
};
$export('<Cookie>', Cookie);
