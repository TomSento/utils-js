var Path = require('path');
var Fs = require('fs');
var Rollup = require('rollup');
var RollupConfig = require('./.rollupconfig.js');
var Uglify = require('uglify-js');

dist('./dist/utils.js');

async function dist(out) {
    var result = await bundle();
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
    log(out, size);
}
async function bundle() {
    var bundle = await Rollup.rollup(RollupConfig.inputOptions);
    return bundle.generate(RollupConfig.outputOptions);
}
function kill(err) {
    console.log(err); // eslint-disable-line no-console
    process.exit(1);
}
function log(out, size) {
    console.log(RollupConfig.inputOptions.input + '  ' + out + '  ' + size + ' kB ---> ' + new Date().toUTCString().split(' ')[4]); // eslint-disable-line no-console
}
