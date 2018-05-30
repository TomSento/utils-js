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
function Watcher(t) {
    this.t = t;
    this.fn = {};
    this.trigger = function(k, a1, a2, a3) {
        var fn = this.fn[k];
        return fn && fn(a1, a2, a3);
    };
}
Watcher.prototype = {
    watch: function(filepath) {
        var self = this;
        require('fs').watchFile(filepath, { // eslint-disable-line global-require
            interval: self.t || 1000 // --------------------------------------> DEFAULT: POLL EACH SECOND
        }, function(curr, prev) {
            if (curr && prev && curr.mtime !== prev.mtime) {
                return self.trigger('change', filepath, curr, prev);
            }
        });
    },
    on: function(k, fn) {
        this.fn[k] = fn;
    }
};
exports.Watcher = Watcher;
