var U = require('../../dist/utils.git');

U.ls([
    '../../utils',
    '../../tests/node'
], 'R', function(path, stat, next) {
    U.log('path: ' + path);
    return next();
}, function(err) {
    if (err) {
        return U.log('err:', err);
    }
    U.log('DONE');
});
