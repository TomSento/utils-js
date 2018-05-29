var U = require('../dist/utils.git');

U.ls([
    '../utils',
    '../test-node'
], 'R', function(path, stat, next) {
    U.log('path: ' + path);
    return next();
}, function(err) {
    if (err) {
        return U.log('err:', err);
    }
    U.log('DONE');
});
