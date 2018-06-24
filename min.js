var Path = require('path');
var createBrowserify = require('browserify');
var Uglify = require('uglify-js');
var Fs = require('fs');

var keys = process.env.k ? process.env.k.split(/\s*,\s*/) : [];
var paths = [];
var out = './dist/utils.js';

$ls('./utils2', 'R', function(filepath, stat, next) {
    if (stat.isFile()) {
        paths.push({ k: pathToKey(filepath), filepath });
    }
    next();
}, function(err) {
    if (err) {
        return kill(err);
    }
    bundle(function(code) {
        if (process.argv.indexOf('-m') >= 0) {
            var min = minify(code);
            if (min.error) {
                return kill(min.error);
            }
            code = min.code;
        }
        Fs.writeFileSync(Path.resolve(out), code);
        var size = (Buffer.byteLength(code, 'utf8') / 1000).toFixed(1);
        log(size);
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
function bundle(next) {
    var b = createBrowserify();
    paths.forEach(function(v) {
        if (keys.length === 0) {
            b.add(v.filepath);
        }
        else {
            if (keys.indexOf(v.k) >= 0) {
                b.add(v.filepath);
            }
        }
    });
    b.bundle(function(err, buffer) {
        if (err) {
            return kill(err);
        }
        next(buffer.toString('utf8'));
    });
}
function minify(code) {
    return Uglify.minify(code);
}
function log(size) {
    console.log(out + ' \t' + size + ' kB'); // eslint-disable-line no-console
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
