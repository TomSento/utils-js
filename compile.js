var atomizerjs = require('atomizerjs');

var keys = process.env.keys ? process.env.keys.split(/\s*,\s*/) : null;
var v = process.env.v ? process.env.v : null;
var files = [
    'utils/_internal.js',
    'utils/core/log.js',
    'utils/core/test.js',
    'utils/core/userAgent.js',
    'utils/core/uid.js',
    'utils/primitives/object.js',
    'utils/primitives/array.js',
    'utils/primitives/string.js',
    'utils/primitives/number.js',
    'utils/core/errors.js',
    'utils/core/schemas.js',
    'utils/core/h.js',
    'utils/browser/browser.js',
    'utils/browser/ajax.js',
    'utils/browser/dom.js',
    'utils/browser/route0.js',
    'utils/node/fs.js',
    'utils/node/server.js'
];
atomizerjs.compileUtils(v, files, keys, './dist/utils.js');
atomizerjs.compileUtils(v, files, null, './dist/utils.all.js');
