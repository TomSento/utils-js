var type = Object.prototype.toString;

function xhr(url, method, a, b, c, d) {
    var body;
    var headers;
    var progressFN;
    var next;
    if (a instanceof FormData && type.call(b) === '[object Object]' && typeof(c) === 'function' && typeof(d) === 'function') {
        body = a;
        headers = b;
        progressFN = c;
        next = d;
    }
    else if (a instanceof FormData && typeof(b) === 'function' && typeof(c) === 'function') {
        body = a;
        progressFN = b;
        next = c;
    }
    else if (a instanceof FormData && typeof(b) === 'function') {
        body = a;
        next = b;
    }
    else if (a && typeof(a) === 'object' && type.call(b) === '[object Object]' && typeof(c) === 'function') {
        body = a; // ---------------------------------------------------------> Object || FormData - ALSO Array BUT SERVER INTENTIONALLY DOES NOT SUPPORT Array BODY
        headers = b;
        next = c;
    }
    else if (type.call(a) === '[object Object]' && typeof(b) === 'function') {
        headers = a; // ------------------------------------------------------> E.G. { 'Accept': ... }
        next = b;
    }
    else if (typeof(a) === 'function') {
        next = a;
    }
    else {
        throw new Error('Invalid arguments at tail.');
    }
    var xhr = new XMLHttpRequest();
    xhr.onerror = function() {
        console.error('Unexpected XHR error.'); // eslint-disable-line no-console
    };
    if (progressFN) {
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var progress = (e.loaded / e.total) * 100;
                progressFN(progress.toFixed(0));
            }
        };
    }
    var res;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            try {
                res = (headers && headers['Accept'] === 'application/json') ? JSON.parse(xhr.responseText) : xhr.responseText; // eslint-disable-line dot-notation
                next(xhr.status, res);
            }
            catch (e) {
                console.error('Unable to parse server response to JSON.'); // eslint-disable-line no-console
            }
        }
    };
    xhr.open(method, url, true);
    if (headers) {
        for (var k in headers) {
            if (headers.hasOwnProperty(k)) {
                var v = headers[k];
                xhr.setRequestHeader(k, v);
            }
        }
    }
    xhr.send(body); // -------------------------------------------------------> Object || FormData - ALSO Array BUT SERVER INTENTIONALLY DOES NOT SUPPORT Array BODY
}
$export('<xhr>', xhr);
