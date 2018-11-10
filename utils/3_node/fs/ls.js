import * as $fs from 'fs';
import * as $path from 'path';

/**
 * @param {String} flag R - recursive
 */
export default function ls(a, flag, fn, next) {
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
            $fs.readdir(dirPath, function(err, files) {
                if (err) {
                    return next(err);
                }
                (function nextFile() {
                    var file = files.shift();
                    if (!file) {
                        return callback ? callback() : nextDirPath();
                    } // -----------------------------------------------------> TO ABSOLUTE PATH
                    file = $path.resolve(dirPath + '/' + file);
                    $fs.stat(file, function(err, stat) {
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
