var U = require('../dist/utils.git');

var watcher = new U.Watcher();
U.ls([
    './files/server/files',
    './files/server/views'
], 'R', function(path, stat, next) {
    if (stat.isFile()) {
        watcher.watch(path);
    }
    return next();
}, function(err) {
    if (err) {
        U.log(err);
        return process.exit(1);
    }
    var server = U.SERVER(require('./files/server/config.json')); // eslint-disable-line global-require
    watcher.on('change', function(filepath) {
        console.log('hotreload: ' + filepath);
        // U.SERVER().reload();
    });
});
