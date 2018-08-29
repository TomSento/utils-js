var $path = require('path');
var $fs = require('fs');
var $rollup = require('rollup');
var $uglify = require('uglify-js');

dist('./src/utils.browser.js', 'iife', './dist/out.browser.js');
dist('./src/utils.node.js', 'cjs', './dist/out.node.js');

async function dist(entry, format, out) {
    var result = await bundle(entry, format);
    var code = result.code || '';
    if (process.argv.indexOf('-m') >= 0) {
        var min = $uglify.minify(code);
        if (min.error) {
            kill(min.error);
        }
        code = min.code;
    }
    $fs.writeFileSync($path.resolve(out), code);
    var size = (Buffer.byteLength(code, 'utf8') / 1000).toFixed(1);
    log(entry, out, size);
}
async function bundle(entry, format) {
    var bundle = await $rollup.rollup({
        input: entry,
        external: format === 'cjs' ? ['path', 'fs', 'stream', 'url', 'querystring', 'https', 'http', 'os'] : []
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
