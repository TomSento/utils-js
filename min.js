var Path = require('path');
var Fs = require('fs');
var Rollup = require('rollup');
var Uglify = require('uglify-js');

dist('./src/utils.browser.js', 'iife', './dist/utils.browser.js');
dist('./src/utils.node.js', 'cjs', './dist/utils.node.js');

async function dist(entry, format, out) {
    var result = await bundle(entry, format);
    var code = result.code || '';
    if (process.argv.indexOf('-m') >= 0) {
        var min = Uglify.minify(code);
        if (min.error) {
            kill(min.error);
        }
        code = min.code;
    }
    Fs.writeFileSync(Path.resolve(out), code);
    var size = (Buffer.byteLength(code, 'utf8') / 1000).toFixed(1);
    log(entry, out, size);
}
async function bundle(entry, format) {
    var bundle = await Rollup.rollup({
        input: entry,
        external: format === 'cjs' ? ['fs', 'path'] : []
    });
    return bundle.generate({ format });
}
function kill(err) {
    console.log(err); // eslint-disable-line no-console
    process.exit(1);
}
function log(entry, out, size) {
    console.log(entry + ' \t' + out + '\t ' + size + ' kB'); // eslint-disable-line no-console
}
