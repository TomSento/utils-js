var CONTENT_TYPE_TO_EXT = {
    'text/plain': '.txt',
    'text/markdown': '.md',

    'text/html': '.html',
    'application/xml': '.xml',
    'text/xml': '.xml',
    'application/json': '.json',

    'font/woff': '.woff',
    'font/woff2': '.woff2',
    'font/otf': '.otf',
    'font/ttf': '.ttf',
    'application/vnd.ms-fontobject': '.eot',

    'application/javascript': '.js',
    'text/css': '.css',

    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',

    'video/mp4': '.mp4',
    'audio/mp3': '.mp3', // NO "audio/mpeg" SUPPORT
    'application/x-shockwave-flash': '.swf',

    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/msword': '.doc',
    'application/vnd.ms-excel': '.xls',

    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar'
};

function extension(k) {
    return CONTENT_TYPE_TO_EXT[k] || null;
}
$export('<extension>', extension);
