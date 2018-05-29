/**
 * @param {String} flags R - recursive
 */
exports.ls = function(startPath, flags, fn, next) {
    var fs = require('fs'); // eslint-disable-line global-require
    if (next === undefined) {
        next = fn;
        fn = flags;
    }
    flags = flags || '';
    return listDirectory(startPath, flags, next);
    function listDirectory(dirPath, f, finalize) {
        fs.readdir(dirPath, function(err, files) { // eslint-disable-line global-require
            if (err) {
                return finalize(err);
            }
            (function nextFile() {
                var file = files.pop();
                if (!file) {
                    return finalize();
                } // ---------------------------------------------------------> TO ABSOLUTE PATH
                file = require('path').resolve(dirPath + '/' + file); // eslint-disable-line global-require
                fs.stat(file, function(err, stat) {
                    if (err) {
                        return finalize(err);
                    }
                    fn(file, stat, function() {
                        if (stat.isDirectory() && f === 'R') { // ------------> RECURSIVE
                            listDirectory(file, f, function(err) {
                                if (err) {
                                    return finalize(err);
                                }
                                return nextFile();
                            });
                        }
                        else {
                            return nextFile();
                        }
                    });
                });
            }(files));
        });
    }
};
