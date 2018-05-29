/**
 * @param {String} flag R - recursive
 */
exports.ls = function(a, flag, fn, next) {
    var fs = require('fs'); // eslint-disable-line global-require
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
            fs.readdir(dirPath, function(err, files) { // eslint-disable-line global-require
                if (err) {
                    return next(err);
                }
                (function nextFile() {
                    var file = files.shift();
                    if (!file) {
                        return callback ? callback() : nextDirPath();
                    } // -----------------------------------------------------> TO ABSOLUTE PATH
                    file = require('path').resolve(dirPath + '/' + file); // eslint-disable-line global-require
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
};
