var Path = require('path');
var createBrowserify = require('browserify');
var Uglify = require('uglify-js');
var Fs = require('fs');

var keys = process.env.keys ? process.env.keys.split(/\s*,\s*/) : [];
var paths = [];
$ls('./utils2', 'R', function(filepath, stat, next) {
    if (stat.isFile()) {
        paths.push({ k: pathToKey(filepath), filepath });
    }
    next();
}, function(err) {
    if (err) kill(err);
    bundle(true, function(codeA) {
        bundle(false, function(codeB) {
            var minA = minify(codeA);
            if (minA.error) {
                kill(minA.error);
            }
            var minB = minify(codeB);
            if (minB.error) {
                kill(minB.error);
            }
            Fs.writeFileSync(Path.resolve('./dist/utils.js'), minA.code);
            Fs.writeFileSync(Path.resolve('./dist/utils.all.js'), minB.code);
            var sizeA = (Buffer.byteLength(minA.code, 'utf8') / 1000).toFixed(1);
            var sizeB = (Buffer.byteLength(minB.code, 'utf8') / 1000).toFixed(1);
            log(sizeA, sizeB);
        });
    });
});
function pathToKey(filepath) {
    var k = Path.basename(filepath, '.js');
    var i = k.indexOf('_');
    if (i >= 0) {
        k = k.slice(i + 1);
    }
    return k;
}
function kill(err) {
    console.log(err); // eslint-disable-line no-console
    process.exit(1);
}
function bundle(partial, next) {
    var b = createBrowserify();
    paths.forEach(function(v) {
        if (partial) {
            if (keys.indexOf(v.k) >= 0) {
                b.add(v.filepath);
            }
        }
        else {
            b.add(v.filepath);
        }
    });
    b.bundle(function(err, buffer) {
        if (err) kill(err);
        next(buffer.toString('utf8'));
    });
}
function minify(code) {
    return Uglify.minify(code);
}
function log(sizeA, sizeB) {
    console.log('./dist/utils.js \t' + sizeA + ' kB'); // eslint-disable-line no-console
    console.log('./dist/utils.all.js \t' + sizeB + ' kB'); // eslint-disable-line no-console
}
function $ls(a, flag, fn, next) {
    var fs = require('fs');
    if (next === undefined) {
        next = fn;
        fn = flag;
    }
    var dirPaths = Array.isArray(a) ? a : [a];
    flag = flag || '';
    (function nextDirPath() {
        var dirPath = dirPaths.shift();
        if (!dirPath) {
            return next();
        }
        (function listDirectory(dirPath, callback) {
            fs.readdir(dirPath, function(err, files) {
                if (err) {
                    return next(err);
                }
                (function nextFile() {
                    var file = files.shift();
                    if (!file) {
                        return callback ? callback() : nextDirPath();
                    } // -----------------------------------------------------> TO ABSOLUTE PATH
                    file = require('path').resolve(dirPath + '/' + file);
                    fs.stat(file, function(err, stat) {
                        if (err) {
                            return next(err);
                        }
                        fn(file, stat, function() {
                            if (stat.isDirectory() && flag === 'R') { // -----> RECURSIVE
                                listDirectory(file, function(err) {
                                    if (err) {
                                        return next(err);
                                    }
                                    return nextFile();
                                });
                            }
                            else {
                                return nextFile();
                            }
                        });
                    });
                }());
            });
        }(dirPath));
    }());
}
