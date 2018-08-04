/* eslint-disable no-console */
require('../../dist/utils.node.js');

$ls([
    '../../utils',
    '../../tests/node'
], 'R', function(path, stat, next) {
    console.log('path: ' + path);
    next();
}, function(err) {
    if (err) {
        throw err;
    }
    console.log('DONE');
});
