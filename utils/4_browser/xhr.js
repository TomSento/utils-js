export default function $ajax(obj) {
    var xhr = new XMLHttpRequest();
    var res = null;
    var json = 'application/json';
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (obj.header['Accept'] === json) { // eslint-disable-line dot-notation
                try {
                    res = JSON.parse(xhr.responseText);
                }
                catch (err) {
                    console.warn('Unable to parse server response to JSON.'); // eslint-disable-line no-console
                    obj.error(null, xhr);
                }
            }
            else {
                res = xhr.responseText;
            }
            if (xhr.status === 200) {
                obj.success(res, xhr);
            }
            else {
                obj.error(res, xhr);
            }
            obj.always(res, xhr);
        }
    };
    xhr.upload.onprogress = function(state) {
        if (state.lengthComputable) {
            var percentage = (state.loaded / state.total) * 100;
            obj.progress(percentage.toFixed(0));
        }
    };
    xhr.onerror = function() {
        console.warn('Unexpected AJAX error.'); // eslint-disable-line no-console
    };
    xhr.open(obj.method, obj.url, true);
    for (var k in obj.header) {
        if (obj.hasOwnProperty(k)) {
            var v = obj.header[k];
            xhr.setRequestHeader(k, v);
        }
    }
    xhr.send(obj.data);
}
window.$ajax = $ajax;
