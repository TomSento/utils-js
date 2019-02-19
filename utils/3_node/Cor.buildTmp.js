import * as child_process from 'child_process';
import * as fs from 'fs';

function buildTmp(fn) {
    if (typeof(fn) !== 'function') {
        fn = function(code, next) { next(null, code); };
    }

    var tmp_dir = './tmp';
    var components_dir = './components';

    var file_exists;
    var filename;
    var encoding = 'utf8';
    var code;
    var copy_cmd;

    child_process.execSync(`rm -rf ${tmp_dir} && mkdir ${tmp_dir}`);

    fs.readdirSync(components_dir).forEach(function(fname) {
        file_exists = false;
        filename = `${fname}.browser.js`;

        try {
            code = fs.readFileSync(`${components_dir}/${fname}/${filename}`, encoding);
            file_exists = true;
        }
        catch (e) {
            if (e.code !== 'ENOENT') throw e;
        }


        copy_cmd = `cp -a ${components_dir}/${fname}/public/ ${tmp_dir}/public/`;
        if (!file_exists) {
            child_process.exec(copy_cmd);
            return;
        }


        fn(code, function(err, str) {
            if (err) throw err;

            child_process.execSync(`mkdir -p ${components_dir}/${fname}/public/`); // CREATE IF DOES NOT EXIST
            fs.writeFileSync(`${components_dir}/${fname}/public/${filename}`, str || '', encoding);

            child_process.exec(copy_cmd);
        });
    });
}

if (!global.Cor) global.Cor = {};
global.Cor.buildTmp = buildTmp;
