var type = Object.prototype.toString;
var EXP_CMD = /^-m\s(GET|PUT|POST|DELETE)$/; // ----------------------------> https://regex101.com/r/Gn3KrT/1/

function xhr(cmd, a, b, c, d) {
    cmd = parseCMD();
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
    else if (canBeBody(a) && type.call(b) === '[object Object]' && typeof(c) === 'function') {
        body = a;
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
    var k;
    if (headers) {
        for (k in headers) {
            if (headers.hasOwnProperty(k)) {
                headers[k.toLowerCase()] = headers[k];
            }
        }
    }
    if (type.call(body) === '[object Object]' || Array.isArray(body) || typeof(body) === 'string') {
        var tmp = headers['content-type'];
        if (!tmp) {
            throw new Error('Missing content type.');
        }
        if (typeof(body) !== 'string') {
            if (tmp !== 'application/json') {
                throw new Error('Invalid content type.');
            }
            body = JSON.stringify(body);
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.onerror = function() {
        console.error('Unexpected XHR error.'); // eslint-disable-line no-console
        next(new Error('xhr'));
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
            res = prepareResponse(xhr.responseText || '');
            var statusCode = xhr.status;
            if (statusCode !== 200) {
                return next(new Error('' + statusCode), res);
            }
            next(null, res);
        }
    };
    xhr.open(cmd.method, cmd.url, true);
    if (headers) {
        for (k in headers) {
            if (headers.hasOwnProperty(k)) {
                xhr.setRequestHeader(k, headers[k]);
            }
        }
    }
    xhr.send(body); // -------------------------------------------------------> String || FormData
    function parseCMD() {
        var m = cmd.match(EXP_CMD);
        if (!m) {
            throw new Error('Request must follow "<Method> <Url>" syntax.');
        }
        return {
            method: m[1],
            url: m[2]
        };
    }
    function canBeBody(v) {
        return type.call(v) === '[object Object]' || Array.isArray(v) || typeof(v) === 'string' || v instanceof FormData;
    }
    function prepareResponse(str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return str;
        }
    }
}
$export('<xhr>', xhr);
