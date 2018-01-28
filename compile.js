var compiler = require('./compiler/compiler.js');

var keys = null;
if (process.env.KEYS) {
    keys = process.env.KEYS.split(/\s*,\s*/);
}
var files = [
    'utils/meta.js',
    'utils/_internal.js',
    'utils/core/log.js',
    'utils/core/generators.js',
    'utils/primitives/object.js',
    'utils/primitives/array.js',
    'utils/primitives/string.js',
    'utils/primitives/number.js',
    'utils/core/errors.js',
    'utils/core/schemas.js',
    'utils/core/proc.js',
    'utils/browser/ajax.js',
    'utils/browser/dom.js'
];
compiler.compileUtils(files, 'U', keys, './dist/utils.js');
compiler.compileUtils(files, 'U', null, './dist/utils.git.js', [
    'v',
    'utilsCompileCMD'
]);
