require('../../dist/utils.all.js');

$ls([
    '../../utils',
    '../../tests/node'
], 'R', function(path, stat, next) {
    $log('path: ' + path);
    return next();
}, function(err) {
    if (err) {
        return $log('err:', err);
    }
    $log('DONE');
});
